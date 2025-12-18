<template>
  <div class="h-screen flex flex-col bg-slate-900">
    <!-- Sold Item Warning Banner -->
    <div v-if="project?.soldTo" class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-bold">This item has been sold and cannot be edited</p>
          <p class="text-sm opacity-90">Sold to {{ project.soldTo?.username }} for €{{ project.soldPrice?.toLocaleString() }}</p>
        </div>
      </div>
      <RouterLink
        :to="`/project/${project._id}`"
        class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
      >
        View Details & Fork
      </RouterLink>
    </div>

    <!-- Top Bar -->
    <div class="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <RouterLink to="/dashboard" class="text-slate-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </RouterLink>

        <div v-if="project">
          <h1 class="text-white font-semibold">
            {{ project.title }}
            <span v-if="project.soldTo" class="ml-2 text-xs px-2 py-1 bg-green-500 rounded-full">SOLD</span>
          </h1>
          <p class="text-xs text-slate-400">Version {{ project.currentVersion }}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Active Users -->
        <div v-if="activeUsers.length > 0" class="flex items-center gap-2">
          <div class="flex -space-x-2">
            <div
              v-for="user in activeUsers"
              :key="user.socketId"
              class="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center text-white text-xs font-medium"
              :style="{ backgroundColor: user.color }"
              :title="user.username"
            >
              {{ user.username[0].toUpperCase() }}
            </div>
          </div>
          <span class="text-sm text-slate-400">{{ activeUsers.length }} online</span>
        </div>

        <!-- Save Button (disabled for sold items) -->
        <button
          @click="saveVersion"
          :disabled="saving || project?.soldTo"
          :title="project?.soldTo ? 'Cannot edit sold items' : ''"
          class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="!saving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
          {{ saving ? 'Saving...' : project?.soldTo ? 'Read Only' : 'Save Version' }}
        </button>

        <!-- AR Preview -->
        <button
          @click="showARPreview = true"
          class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          AR View
        </button>

        <!-- Export -->
        <button
          @click="showExportModal = true"
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          Export
        </button>

        <!-- AI Assistant Toggle -->
        <button
          @click="showAIPanel = !showAIPanel"
          class="px-4 py-2 rounded-lg transition-all flex items-center gap-2"
          :class="showAIPanel ? 'bg-purple-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Toolbar -->
      <Toolbar
        @undo="handleUndo"
        @redo="handleRedo"
        @clear="handleClear"
      />

      <!-- Canvas Area -->
      <div class="flex-1 overflow-hidden">
        <DrawingCanvas
          ref="canvasRef"
          :project-id="projectId"
          :remote-cursors="remoteCursors"
          @draw="handleDraw"
          @cursor-move="handleCursorMove"
          @save-state="handleSaveState"
        />
      </div>

      <!-- AI Panel -->
      <AIPanel
        v-if="showAIPanel"
        @generated-image="handleGeneratedImage"
      />
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showExportModal = false">
      <div class="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
        <h2 class="text-xl font-semibold text-white mb-4">Export Artwork</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Format</label>
            <select v-model="exportFormat" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="png">PNG (High Quality)</option>
              <option value="jpg">JPG (Compressed)</option>
              <option value="webp">WebP (Modern)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Quality</label>
            <select v-model="exportQuality" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="1">Original Size</option>
              <option value="2">2x (High DPI)</option>
              <option value="0.5">0.5x (Web Optimized)</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="addWatermark" id="watermark" class="w-4 h-4 rounded">
            <label for="watermark" class="text-sm text-slate-300">Add watermark</label>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="showExportModal = false" class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            Cancel
          </button>
          <button @click="exportCanvas" class="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg transition-all">
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- AR Preview Modal -->
    <ARPreview
      v-if="showARPreview"
      :show="showARPreview"
      :project-id="projectId"
      @close="showARPreview = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '../stores/projectStore';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { useSocket } from '../composables/useSocket';
import { useToast } from '../composables/useToast';
import DrawingCanvas from '../components/canvas/DrawingCanvas.vue';
import Toolbar from '../components/canvas/Toolbar.vue';
import AIPanel from '../components/canvas/AIPanel.vue';
import ARPreview from '../components/canvas/ARPreview.vue';

const route = useRoute();
const projectStore = useProjectStore();
const canvasStore = useCanvasStore();
const authStore = useAuthStore();
const toast = useToast();

const projectId = computed(() => route.params.id as string);
const project = ref<any>(null);
const canvasRef = ref<InstanceType<typeof DrawingCanvas> | null>(null);
const saving = ref(false);
const showAIPanel = ref(false);
const showExportModal = ref(false);
const showARPreview = ref(false);
const exportFormat = ref('png');
const exportQuality = ref('1');
const addWatermark = ref(false);
const lastAutoSave = ref<Date | null>(null);

// Auto-save configuration
const AUTO_SAVE_INTERVAL = 60000; // Auto-save every 60 seconds
let autoSaveInterval: number | null = null;

const {
  connect,
  disconnect,
  joinProject,
  leaveProject,
  emitDraw,
  emitCursorMove,
  emitUndo,
  emitRedo,
  emitClearCanvas,
  emitCanvasUpdate,
  onDraw,
  onSyncState,
  onCursorUpdate,
  onUserJoined,
  onUserLeft,
  onUndo,
  onRedo,
  onClearCanvas,
  activeUsers,
  remoteCursors
} = useSocket();

onMounted(async () => {
  const data = await projectStore.fetchProject(projectId.value);
  project.value = data;

  // Initialize canvas with project settings
  if (data.canvas) {
    canvasStore.setCanvasSize(data.canvas.width, data.canvas.height);
    canvasStore.setBackgroundColor(data.canvas.background);
  }

  // Load layers from project
  if (data.layers && data.layers.length > 0) {
    canvasStore.loadLayers(data.layers);
  }

  // Load last saved canvas state
  if (data.versions && data.versions.length > 0) {
    const lastVersion = data.versions[data.versions.length - 1];
    if (lastVersion.canvasData && canvasRef.value) {
      canvasRef.value.loadCanvasData(lastVersion.canvasData);
    }
  }

  // Set color palette from project
  if (data.colors && data.colors.length > 0) {
    canvasStore.setColor(data.colors[0]);
  }

  connect();

  if (authStore.user) {
    joinProject(projectId.value, authStore.user._id, authStore.user.username);
  }

  // Set up auto-save
  autoSaveInterval = window.setInterval(autoSave, AUTO_SAVE_INTERVAL);

  // Handle sync state from server (when joining a session with active users)
  onSyncState((state) => {
    if (canvasRef.value && state.canvasData) {
      canvasRef.value.loadCanvasData(state.canvasData);
    }
    if (state.layers) {
      canvasStore.loadLayers(state.layers);
    }
    console.log('Synced with project state, version:', state.version);
  });

  onDraw((data) => {
    canvasRef.value?.applyRemoteDrawing(data.drawData);
  });

  onCursorUpdate(() => {
  });

  onUserJoined(({ username }) => {
    console.log('User joined:', username);
  });

  onUserLeft(({ username }) => {
    console.log('User left:', username);
  });

  onUndo(() => {
    const state = canvasStore.undo();
    if (state) {
      canvasRef.value?.loadCanvasData(state);
    }
  });

  onRedo(() => {
    const state = canvasStore.redo();
    if (state) {
      canvasRef.value?.loadCanvasData(state);
    }
  });

  onClearCanvas(() => {
    canvasRef.value?.clearCanvas();
  });
});

onUnmounted(() => {
  leaveProject(projectId.value);
  disconnect();

  // Clear auto-save interval
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
});

// Auto-save function
const autoSave = async () => {
  if (!canvasRef.value || saving.value) return;

  try {
    const canvasData = canvasRef.value.getCanvasData();
    const thumbnail = canvasData;

    // Silent save (no UI feedback for auto-save)
    await projectStore.updateProject(projectId.value, {
      layers: canvasStore.layers,
      canvas: {
        width: canvasStore.canvasSize.width,
        height: canvasStore.canvasSize.height,
        background: canvasStore.backgroundColor
      },
      thumbnail
    });

    lastAutoSave.value = new Date();
    console.log('Auto-saved at', lastAutoSave.value.toLocaleTimeString());
  } catch (error) {
    console.error('Auto-save failed:', error);
  }
};

const handleDraw = (drawData: any) => {
  emitDraw(projectId.value, drawData);
};

const handleCursorMove = (x: number, y: number) => {
  emitCursorMove(projectId.value, x, y);
};

const handleSaveState = () => {
  if (canvasRef.value) {
    const canvasData = canvasRef.value.getCanvasData();
    canvasStore.saveState(canvasData);
  }
};

const handleUndo = () => {
  const state = canvasStore.undo();
  if (state) {
    canvasRef.value?.loadCanvasData(state);
    emitUndo(projectId.value);
  }
};

const handleRedo = () => {
  const state = canvasStore.redo();
  if (state) {
    canvasRef.value?.loadCanvasData(state);
    emitRedo(projectId.value);
  }
};

const handleClear = () => {
  if (confirm('Are you sure you want to clear the canvas?')) {
    canvasRef.value?.clearCanvas();
    canvasStore.clear();
    emitClearCanvas(projectId.value);
  }
};

const saveVersion = async () => {
  if (!canvasRef.value) return;

  if (project.value?.soldTo) {
    toast.error('Cannot edit sold items', 'Please fork this project to make changes');
    return;
  }

  saving.value = true;
  try {
    const canvasData = canvasRef.value.getCanvasData();
    const thumbnail = canvasData;

    await projectStore.createVersion(projectId.value, {
      canvasData,
      layers: canvasStore.layers,
      message: 'Manual save',
      thumbnail
    });

    await projectStore.updateProject(projectId.value, {
      layers: canvasStore.layers,
      canvas: {
        width: canvasStore.canvasSize.width,
        height: canvasStore.canvasSize.height,
        background: canvasStore.backgroundColor
      },
      thumbnail
    });

    // Emit canvas state to WebSocket for synchronization
    emitCanvasUpdate(projectId.value, canvasData, canvasStore.layers);

    toast.success('Version saved successfully!');
  } catch (error: any) {
    console.error('Failed to save version:', error);
    const errorMsg = error.response?.data?.message || 'Failed to save version';
    toast.error(errorMsg);
  } finally {
    saving.value = false;
  }
};

const exportCanvas = () => {
  if (!canvasRef.value) return;

  const canvas = canvasRef.value.getCanvas();
  if (!canvas) return;

  const scale = parseFloat(exportQuality.value);
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = canvas.width * scale;
  exportCanvas.height = canvas.height * scale;
  const ctx = exportCanvas.getContext('2d');

  if (ctx) {
    ctx.scale(scale, scale);
    ctx.drawImage(canvas, 0, 0);

    if (addWatermark.value) {
      ctx.font = '20px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('Art Studio', 20, canvas.height - 20);
    }

    const mimeType = exportFormat.value === 'png' ? 'image/png' :
                     exportFormat.value === 'jpg' ? 'image/jpeg' : 'image/webp';
    const dataUrl = exportCanvas.toDataURL(mimeType, 0.95);

    const link = document.createElement('a');
    link.download = `${project.value?.title || 'artwork'}.${exportFormat.value}`;
    link.href = dataUrl;
    link.click();

    showExportModal.value = false;
  }
};

const handleGeneratedImage = async (imageUrl: string) => {
  if (!canvasRef.value) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    canvasRef.value?.drawImage(img);
  };
  img.src = imageUrl;
};
</script>
