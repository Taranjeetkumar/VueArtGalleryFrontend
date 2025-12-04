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

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
    if (ctx) {
      ctx.fillStyle = canvasStore.backgroundColor;
      ctx.fillRect(0, 0, canvasStore.canvasSize.width, canvasStore.canvasSize.height);
    }
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
  lastX.value = (e.clientX - rect.left) / canvasStore.zoom;
  lastY.value = (e.clientY - rect.top) / canvasStore.zoom;
};

const draw = (e: MouseEvent) => {
  if (!canvasRef.value || !ctx) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const currentX = (e.clientX - rect.left) / canvasStore.zoom;
  const currentY = (e.clientY - rect.top) / canvasStore.zoom;

  emit('cursor-move', currentX, currentY);

  if (!isDrawing.value) return;

  const tool = canvasStore.drawingState.tool;

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

const stopDrawing = () => {
  if (isDrawing.value) {
    isDrawing.value = false;
    emit('save-state');
  }
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
