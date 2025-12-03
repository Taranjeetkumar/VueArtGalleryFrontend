<template>
  <div class="bg-slate-800 border-r border-slate-700 w-16 flex flex-col items-center py-4 gap-2">
    <!-- Tools -->
    <button
      v-for="tool in tools"
      :key="tool.name"
      @click="canvasStore.setTool(tool.name as any)"
      :class="[
        'w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
        canvasStore.drawingState.tool === tool.name
          ? 'bg-cyan-500 text-white'
          : 'text-slate-400 hover:bg-slate-700 hover:text-white'
      ]"
      :title="tool.label"
    >
      <component :is="tool.icon" class="w-6 h-6" />
    </button>

    <div class="w-10 h-px bg-slate-700 my-2"/>

    <!-- Color Picker -->
    <div class="relative">
      <div
        @click="showColorPicker = !showColorPicker"
        class="w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer"
        :style="{ backgroundColor: canvasStore.drawingState.color }"
      />

      <div
        v-if="showColorPicker"
        class="absolute left-full ml-2 top-0 bg-slate-800 border border-slate-700 rounded-lg p-3 z-10"
      >
        <div class="grid grid-cols-5 gap-2 mb-3">
          <div
            v-for="color in predefinedColors"
            :key="color"
            @click="selectColor(color)"
            class="w-8 h-8 rounded cursor-pointer border-2 transition-transform hover:scale-110"
            :class="canvasStore.drawingState.color === color ? 'border-white' : 'border-transparent'"
            :style="{ backgroundColor: color }"
          />
        </div>
        <input
          v-model="canvasStore.drawingState.color"
          type="color"
          class="w-full h-8 rounded cursor-pointer"
        >
      </div>
    </div>

    <div class="w-10 h-px bg-slate-700 my-2"/>

    <!-- Undo/Redo -->
    <button
      @click="$emit('undo')"
      :disabled="!canvasStore.canUndo"
      class="w-12 h-12 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
      :class="canvasStore.canUndo ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-600 cursor-not-allowed'"
      title="Undo"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    </button>

    <button
      @click="$emit('redo')"
      :disabled="!canvasStore.canRedo"
      class="w-12 h-12 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
      :class="canvasStore.canRedo ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-600 cursor-not-allowed'"
      title="Redo"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
      </svg>
    </button>
  </div>

  <!-- Right Panel with Controls -->
  <div class="bg-slate-800 border-l border-slate-700 w-64 p-4 overflow-y-auto">
    <h3 class="text-white font-semibold mb-4">Properties</h3>

    <div class="space-y-4">
      <!-- Brush Size -->
      <div>
        <label class="text-sm text-slate-300 mb-2 block">Brush Size: {{ canvasStore.drawingState.strokeWidth }}px</label>
        <input
          v-model.number="canvasStore.drawingState.strokeWidth"
          type="range"
          min="1"
          max="50"
          class="w-full"
        >
      </div>

      <!-- Opacity -->
      <div>
        <label class="text-sm text-slate-300 mb-2 block">Opacity: {{ Math.round(canvasStore.drawingState.opacity * 100) }}%</label>
        <input
          v-model.number="canvasStore.drawingState.opacity"
          type="range"
          min="0"
          max="1"
          step="0.1"
          class="w-full"
        >
      </div>

      <!-- Zoom -->
      <div>
        <label class="text-sm text-slate-300 mb-2 block">Zoom: {{ Math.round(canvasStore.zoom * 100) }}%</label>
        <input
          v-model.number="canvasStore.zoom"
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          class="w-full"
        >
      </div>

      <!-- Clear Canvas -->
      <button
        @click="$emit('clear')"
        class="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
      >
        Clear Canvas
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { useCanvasStore } from '../../stores/canvasStore';

defineEmits<{
  undo: [];
  redo: [];
  clear: [];
}>();

const canvasStore = useCanvasStore();
const showColorPicker = ref(false);

const tools = [
  {
    name: 'brush',
    label: 'Brush',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' }))
  },
  {
    name: 'pencil',
    label: 'Pencil',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' }))
  },
  {
    name: 'eraser',
    label: 'Eraser',
    icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' }))
  }
];

const predefinedColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#00FF7F', '#4169E1'
];

const selectColor = (color: string) => {
  canvasStore.setColor(color);
  showColorPicker.value = false;
};
</script>

<style scoped>
input[type="range"] {
  @apply appearance-none bg-slate-700 h-2 rounded-full;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-cyan-500 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-4 h-4 bg-cyan-500 rounded-full cursor-pointer border-0;
}
</style>
