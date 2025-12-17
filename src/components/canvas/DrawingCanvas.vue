<template>
  <div class="relative w-full h-full flex items-center justify-center bg-slate-900" ref="containerRef">
    <div class="relative" :style="{ transform: `scale(${canvasStore.zoom})` }">
      <canvas
        ref="canvasRef"
        :width="canvasStore.canvasSize.width"
        :height="canvasStore.canvasSize.height"
        class="border border-slate-600 cursor-crosshair bg-white"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      />

      <!-- Remote Cursors -->
      <div
        v-for="[socketId, cursor] in remoteCursors"
        :key="socketId"
        class="absolute pointer-events-none transition-all duration-100"
        :style="{
          left: `${cursor.x}px`,
          top: `${cursor.y}px`,
          transform: 'translate(-50%, -50%)'
        }"
      >
        <svg class="w-6 h-6" :style="{ color: cursor.color }" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
        </svg>
        <span
          class="absolute top-6 left-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
          :style="{ backgroundColor: cursor.color }"
        >
          {{ cursor.username }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useCanvasStore } from '../../stores/canvasStore';

interface Props {
  projectId: string;
  remoteCursors: Map<string, { x: number; y: number; username: string; color: string }>;
}

defineProps<Props>();
const emit = defineEmits<{
  draw: [data: any];
  'cursor-move': [x: number, y: number];
  'save-state': [];
}>();

const canvasStore = useCanvasStore();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let isDrawing = ref(false);
let lastX = ref(0);
let lastY = ref(0);
let startX = ref(0);
let startY = ref(0);
let tempCanvas: HTMLCanvasElement | null = null;
let tempCtx: CanvasRenderingContext2D | null = null;

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
    if (ctx) {
      ctx.fillStyle = canvasStore.backgroundColor;
      ctx.fillRect(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
    }

    // Create temporary canvas for shape preview
    tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasStore.canvasSize.width;
    tempCanvas.height = canvasStore.canvasSize.height;
    tempCtx = tempCanvas.getContext('2d');
  }
});

watch(() => canvasStore.backgroundColor, (newColor) => {
  if (ctx) {
    ctx.fillStyle = newColor;
    ctx.fillRect(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
  }
});

const startDrawing = (e: MouseEvent) => {
  if (!canvasRef.value) return;

  isDrawing.value = true;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = (e.clientX - rect.left) / canvasStore.zoom;
  const y = (e.clientY - rect.top) / canvasStore.zoom;

  lastX.value = x;
  lastY.value = y;
  startX.value = x;
  startY.value = y;

  const tool = canvasStore.drawingState.tool;

  // For fill tool, execute immediately
  if (tool === 'fill') {
    floodFill(Math.floor(x), Math.floor(y));
    isDrawing.value = false;
    emit('save-state');
  }
};

const draw = (e: MouseEvent) => {
  if (!canvasRef.value || !ctx) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const currentX = (e.clientX - rect.left) / canvasStore.zoom;
  const currentY = (e.clientY - rect.top) / canvasStore.zoom;

  emit('cursor-move', currentX, currentY);

  if (!isDrawing.value) return;

  const tool = canvasStore.drawingState.tool;

  // For shape tools, show preview
  if (['rectangle', 'circle', 'line'].includes(tool)) {
    drawShapePreview(currentX, currentY);
    return;
  }

  // For freehand tools
  ctx.strokeStyle = canvasStore.drawingState.color;
  ctx.lineWidth = canvasStore.drawingState.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = canvasStore.drawingState.opacity;

  if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.globalCompositeOperation = 'source-over';
  }

  if (tool === 'brush' || tool === 'pencil' || tool === 'eraser') {
    ctx.beginPath();
    ctx.moveTo(lastX.value, lastY.value);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.closePath();

    // Emit drawing data for collaboration
    emit('draw', {
      tool,
      color: canvasStore.drawingState.color,
      strokeWidth: canvasStore.drawingState.strokeWidth,
      opacity: canvasStore.drawingState.opacity,
      from: { x: lastX.value, y: lastY.value },
      to: { x: currentX, y: currentY }
    });
  }

  lastX.value = currentX;
  lastY.value = currentY;
};

const drawShapePreview = (currentX: number, currentY: number) => {
  if (!canvasRef.value || !ctx || !tempCanvas || !tempCtx) return;

  // Save current canvas state to temp canvas
  tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.drawImage(canvasRef.value, 0, 0);

  // Draw shape preview on main canvas
  const tool = canvasStore.drawingState.tool;
  ctx.strokeStyle = canvasStore.drawingState.color;
  ctx.fillStyle = canvasStore.drawingState.color;
  ctx.lineWidth = canvasStore.drawingState.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = canvasStore.drawingState.opacity;
  ctx.globalCompositeOperation = 'source-over';

  // Restore canvas and draw preview
  ctx.clearRect(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
  ctx.drawImage(tempCanvas, 0, 0);

  if (tool === 'rectangle') {
    const width = currentX - startX.value;
    const height = currentY - startY.value;
    ctx.strokeRect(startX.value, startY.value, width, height);
  } else if (tool === 'circle') {
    const radius = Math.sqrt(
      Math.pow(currentX - startX.value, 2) + Math.pow(currentY - startY.value, 2)
    );
    ctx.beginPath();
    ctx.arc(startX.value, startY.value, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  } else if (tool === 'line') {
    ctx.beginPath();
    ctx.moveTo(startX.value, startY.value);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.closePath();
  }
};

const stopDrawing = () => {
  if (!isDrawing.value) return;

  const tool = canvasStore.drawingState.tool;

  // For shape tools, finalize the shape
  if (['rectangle', 'circle', 'line'].includes(tool) && ctx) {
    // The shape is already drawn, just restore temp canvas
    if (tempCanvas) {
      ctx.clearRect(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
      ctx.drawImage(tempCanvas, 0, 0);
    }

    // Redraw the final shape
    const currentX = lastX.value;
    const currentY = lastY.value;

    ctx.strokeStyle = canvasStore.drawingState.color;
    ctx.fillStyle = canvasStore.drawingState.color;
    ctx.lineWidth = canvasStore.drawingState.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = canvasStore.drawingState.opacity;
    ctx.globalCompositeOperation = 'source-over';

    if (tool === 'rectangle') {
      const width = currentX - startX.value;
      const height = currentY - startY.value;
      ctx.strokeRect(startX.value, startY.value, width, height);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(currentX - startX.value, 2) + Math.pow(currentY - startY.value, 2)
      );
      ctx.beginPath();
      ctx.arc(startX.value, startY.value, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
    } else if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startX.value, startY.value);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      ctx.closePath();
    }

    emit('save-state');
  } else if (isDrawing.value) {
    emit('save-state');
  }

  isDrawing.value = false;
};

// Flood fill implementation
const floodFill = (startX: number, startY: number) => {
  if (!ctx || !canvasRef.value) return;

  const imageData = ctx.getImageData(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
  const pixels = imageData.data;

  // Get target color at click position
  const startPos = (startY * canvasStore.canvasSize.width + startX) * 4;
  const targetColor = {
    r: pixels[startPos],
    g: pixels[startPos + 1],
    b: pixels[startPos + 2],
    a: pixels[startPos + 3]
  };

  // Convert fill color from hex to RGB
  const fillColor = hexToRgb(canvasStore.drawingState.color);
  if (!fillColor) return;

  const fillR = fillColor.r;
  const fillG = fillColor.g;
  const fillB = fillColor.b;
  const fillA = Math.round(canvasStore.drawingState.opacity * 255);

  // Don't fill if target color is same as fill color
  if (targetColor.r === fillR && targetColor.g === fillG &&
      targetColor.b === fillB && targetColor.a === fillA) {
    return;
  }

  const stack = [[startX, startY]];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const key = `${x},${y}`;

    if (visited.has(key)) continue;
    if (x < 0 || x >= canvasStore.canvasSize.width ||
        y < 0 || y >= canvasStore.canvasSize.height) continue;

    const pos = (y * canvasStore.canvasSize.width + x) * 4;

    // Check if pixel matches target color
    if (pixels[pos] !== targetColor.r ||
        pixels[pos + 1] !== targetColor.g ||
        pixels[pos + 2] !== targetColor.b ||
        pixels[pos + 3] !== targetColor.a) {
      continue;
    }

    visited.add(key);

    // Fill pixel
    pixels[pos] = fillR;
    pixels[pos + 1] = fillG;
    pixels[pos + 2] = fillB;
    pixels[pos + 3] = fillA;

    // Add neighbors to stack
    stack.push([x + 1, y]);
    stack.push([x - 1, y]);
    stack.push([x, y + 1]);
    stack.push([x, y - 1]);
  }

  ctx.putImageData(imageData, 0, 0);
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const applyRemoteDrawing = (drawData: any) => {
  if (!ctx) return;

  ctx.strokeStyle = drawData.color;
  ctx.lineWidth = drawData.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = drawData.opacity;

  if (drawData.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.globalCompositeOperation = 'source-over';
  }

  ctx.beginPath();
  ctx.moveTo(drawData.from.x, drawData.from.y);
  ctx.lineTo(drawData.to.x, drawData.to.y);
  ctx.stroke();
  ctx.closePath();
};

const getCanvasData = () => {
  return canvasRef.value?.toDataURL() || '';
};

const loadCanvasData = (dataUrl: string) => {
  if (!ctx || !canvasRef.value) return;

  const img = new Image();
  img.onload = () => {
    ctx!.clearRect(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
    ctx!.drawImage(img, 0, 0);
  };
  img.src = dataUrl;
};

const clearCanvas = () => {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
  ctx.fillStyle = canvasStore.backgroundColor;
  ctx.fillRect(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
};

const getCanvas = () => {
  return canvasRef.value;
};

const drawImage = (img: HTMLImageElement) => {
  if (!ctx) return;
  // Center the image on canvas
  const scale = Math.min(
    canvasStore.canvasSize.width / img.width,
    canvasStore.canvasSize.height / img.height
  );
  const scaledWidth = img.width * scale * 0.8; // Scale to 80% to leave some margin
  const scaledHeight = img.height * scale * 0.8;
  const x = (canvasStore.canvasSize.width - scaledWidth) / 2;
  const y = (canvasStore.canvasSize.height - scaledHeight) / 2;
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  emit('save-state');
};

defineExpose({
  applyRemoteDrawing,
  getCanvasData,
  loadCanvasData,
  clearCanvas,
  getCanvas,
  drawImage
});
</script>
