<template>
  <div class="h-screen flex flex-col bg-slate-900">
    <!-- Top Bar -->
    <div class="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <RouterLink to="/dashboard" class="text-slate-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </RouterLink>

        <div v-if="project">
          <h1 class="text-white font-semibold">{{ project.title }}</h1>
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

        <!-- Save Button -->
        <button
          @click="saveVersion"
          :disabled="saving"
          class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <svg v-if="!saving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
          {{ saving ? 'Saving...' : 'Save Version' }}
        </button>

        <!-- Export -->
        <button
          @click="exportCanvas"
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          Export
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

      <!-- Right Panel (from Toolbar) is rendered separately -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '../stores/projectStore';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { useSocket } from '../composables/useSocket';
import DrawingCanvas from '../components/canvas/DrawingCanvas.vue';
import Toolbar from '../components/canvas/Toolbar.vue';

const route = useRoute();
const projectStore = useProjectStore();
const canvasStore = useCanvasStore();
const authStore = useAuthStore();

const projectId = computed(() => route.params.id as string);
const project = ref<any>(null);
const canvasRef = ref<InstanceType<typeof DrawingCanvas> | null>(null);
const saving = ref(false);

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
  onDraw,
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
  // Fetch project data
  const data = await projectStore.fetchProject(projectId.value);
  project.value = data;

  // Load canvas data if exists
  if (data.layers && data.layers.length > 0) {
    canvasStore.loadLayers(data.layers);
  }

  // Connect to WebSocket
  connect();

  // Join project room
  if (authStore.user) {
    joinProject(projectId.value, authStore.user._id, authStore.user.username);
  }

  // Setup WebSocket event handlers
  onDraw((data) => {
    canvasRef.value?.applyRemoteDrawing(data.drawData);
  });

  onCursorUpdate(() => {
    // Cursor updates are handled by remoteCursors map
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
});

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

    // Update project data
    await projectStore.updateProject(projectId.value, {
      layers: canvasStore.layers,
      thumbnail
    });

    alert('Version saved successfully!');
  } catch (error) {
    console.error('Failed to save version:', error);
    alert('Failed to save version');
  } finally {
    saving.value = false;
  }
};

const exportCanvas = () => {
  if (!canvasRef.value) return;

  const dataUrl = canvasRef.value.getCanvasData();
  const link = document.createElement('a');
  link.download = `${project.value?.title || 'artwork'}.png`;
  link.href = dataUrl;
  link.click();
};
</script>
