<template>
  <div class="w-80 bg-slate-800 border-l border-slate-700 flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b border-slate-700">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-white font-semibold">Layers</h3>
        <button
          @click="canvasStore.addLayer()"
          class="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          title="Add Layer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Layers List -->
    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <div
        v-for="(layer, index) in reversedLayers"
        :key="layer.id"
        :class="[
          'p-3 rounded-lg border-2 transition-all cursor-pointer',
          canvasStore.currentLayerIndex === reversedLayers.length - 1 - index
            ? 'border-cyan-500 bg-slate-700'
            : 'border-slate-600 bg-slate-750 hover:border-slate-500'
        ]"
        @click="selectLayer(index)"
      >
        <div class="flex items-center justify-between mb-2">
          <!-- Layer Name -->
          <input
            v-if="editingLayer === layer.id"
            v-model="editLayerName"
            @blur="finishRenaming(reversedLayers.length - 1 - index)"
            @keyup.enter="finishRenaming(reversedLayers.length - 1 - index)"
            @click.stop
            class="flex-1 px-2 py-1 bg-slate-900 text-white text-sm rounded border border-cyan-500 focus:outline-none"
            ref="renameInput"
          />
          <span
            v-else
            @dblclick="startRenaming(layer)"
            class="flex-1 text-white text-sm font-medium truncate"
          >
            {{ layer.name }}
          </span>

          <!-- Actions -->
          <div class="flex items-center gap-1 ml-2">
            <!-- Visibility Toggle -->
            <button
              @click.stop="canvasStore.toggleLayerVisibility(reversedLayers.length - 1 - index)"
              class="p-1 hover:bg-slate-600 rounded transition-colors"
              :title="layer.visible ? 'Hide Layer' : 'Show Layer'"
            >
              <svg v-if="layer.visible" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>

            <!-- Delete Layer -->
            <button
              v-if="canvasStore.layers.length > 1"
              @click.stop="deleteLayer(reversedLayers.length - 1 - index)"
              class="p-1 hover:bg-red-600 rounded transition-colors"
              title="Delete Layer"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Opacity Slider -->
        <div class="flex items-center gap-2 mt-2">
          <span class="text-xs text-slate-400 w-16">Opacity:</span>
          <input
            type="range"
            min="0"
            max="100"
            :value="layer.opacity * 100"
            @input="updateOpacity(reversedLayers.length - 1 - index, $event)"
            @click.stop
            class="flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <span class="text-xs text-slate-300 w-8 text-right">{{ Math.round(layer.opacity * 100) }}%</span>
        </div>

        <!-- Layer Preview Thumbnail -->
        <div class="mt-2 h-12 bg-slate-900 rounded border border-slate-600 flex items-center justify-center">
          <span class="text-xs text-slate-500">Preview</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCanvasStore } from '../../stores/canvasStore';

const canvasStore = useCanvasStore();

const editingLayer = ref<string | null>(null);
const editLayerName = ref('');
const renameInput = ref<HTMLInputElement | null>(null);

// Reverse layers for display (top layer first)
const reversedLayers = computed(() => {
  return [...canvasStore.layers].reverse();
});

const selectLayer = (reversedIndex: number) => {
  const actualIndex = reversedLayers.value.length - 1 - reversedIndex;
  canvasStore.selectLayer(actualIndex);
};

const deleteLayer = (index: number) => {
  if (confirm('Are you sure you want to delete this layer?')) {
    canvasStore.deleteLayer(index);
  }
};

const updateOpacity = (index: number, event: Event) => {
  const value = parseFloat((event.target as HTMLInputElement).value) / 100;
  canvasStore.setLayerOpacity(index, value);
};

const startRenaming = (layer: any) => {
  editingLayer.value = layer.id;
  editLayerName.value = layer.name;
  setTimeout(() => {
    renameInput.value?.focus();
  }, 50);
};

const finishRenaming = (index: number) => {
  if (editLayerName.value.trim()) {
    canvasStore.renameLayer(index, editLayerName.value.trim());
  }
  editingLayer.value = null;
  editLayerName.value = '';
};
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: #06b6d4;
  cursor: pointer;
  border-radius: 50%;
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #06b6d4;
  cursor: pointer;
  border-radius: 50%;
  border: none;
}
</style>
