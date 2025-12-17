<template>
  <div class="h-screen w-full bg-black flex flex-col">
    <!-- Header -->
    <div class="bg-slate-900/90 backdrop-blur-sm p-4 flex items-center justify-between z-10">
      <div class="flex items-center gap-3">
        <RouterLink to="/" class="text-white hover:text-cyan-400 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </RouterLink>
        <div v-if="project">
          <h1 class="text-white font-semibold">{{ project.title }}</h1>
          <p class="text-xs text-slate-400">AR Preview</p>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          @click="resetPlacement"
          class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
        >
          Reset
        </button>
        <button
          @click="toggleControls"
          class="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-colors"
        >
          {{ showControls ? 'Hide' : 'Show' }} Controls
        </button>
      </div>
    </div>

    <!-- AR View -->
    <div class="flex-1 relative">
      <!-- Loading -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-white">Loading artwork...</p>
        </div>
      </div>

      <!-- AR Scene -->
      <div v-else class="w-full h-full relative">
        <!-- Model Viewer for AR -->
        <div ref="arContainer" class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <!-- Artwork Display -->
          <div
            ref="artworkRef"
            class="relative"
            :style="{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: '90%',
              maxHeight: '90%'
            }"
          >
            <img
              v-if="artworkImage"
              :src="artworkImage"
              alt="Artwork"
              class="max-w-full max-h-full rounded-lg shadow-2xl"
              :style="{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`
              }"
            />
          </div>

          <!-- AR Indicator -->
          <div class="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/30">
            <p class="text-sm text-white flex items-center gap-2">
              <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              AR Mode Active
            </p>
          </div>
        </div>
      </div>

      <!-- Controls Overlay -->
      <div
        v-if="showControls"
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 space-y-4"
      >
        <!-- Scale Control -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-white text-sm font-medium">Scale</label>
            <span class="text-cyan-400 text-sm">{{ (scale * 100).toFixed(0) }}%</span>
          </div>
          <input
            type="range"
            v-model.number="scale"
            min="0.1"
            max="3"
            step="0.1"
            class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <!-- Rotation Control -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-white text-sm font-medium">Rotation</label>
            <span class="text-cyan-400 text-sm">{{ rotation.toFixed(0) }}°</span>
          </div>
          <input
            type="range"
            v-model.number="rotation"
            min="0"
            max="360"
            step="1"
            class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <!-- Brightness -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-white text-sm font-medium">Brightness</label>
            <span class="text-cyan-400 text-sm">{{ brightness }}%</span>
          </div>
          <input
            type="range"
            v-model.number="brightness"
            min="50"
            max="150"
            step="5"
            class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <!-- Contrast -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-white text-sm font-medium">Contrast</label>
            <span class="text-cyan-400 text-sm">{{ contrast }}%</span>
          </div>
          <input
            type="range"
            v-model.number="contrast"
            min="50"
            max="150"
            step="5"
            class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2">
          <button
            @click="captureScreenshot"
            class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Capture
          </button>
          <button
            @click="shareAR"
            class="flex-1 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>

      <!-- Instructions (for first time) -->
      <div v-if="showInstructions" class="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-20">
        <div class="bg-slate-900 rounded-2xl p-8 max-w-md space-y-6">
          <div class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Welcome to AR View</h2>
            <p class="text-slate-400">View your artwork in augmented reality</p>
          </div>

          <div class="space-y-3">
            <div class="flex gap-3 items-start">
              <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span class="text-cyan-400 font-bold">1</span>
              </div>
              <p class="text-slate-300 text-sm pt-1">Use the controls to adjust size, rotation, and appearance</p>
            </div>
            <div class="flex gap-3 items-start">
              <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span class="text-cyan-400 font-bold">2</span>
              </div>
              <p class="text-slate-300 text-sm pt-1">Move your device to see the artwork from different angles</p>
            </div>
            <div class="flex gap-3 items-start">
              <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span class="text-cyan-400 font-bold">3</span>
              </div>
              <p class="text-slate-300 text-sm pt-1">Capture screenshots and share with friends</p>
            </div>
          </div>

          <button
            @click="showInstructions = false"
            class="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all"
          >
            Got it, let's start!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '../stores/projectStore';
import html2canvas from 'html2canvas';

const route = useRoute();
const projectStore = useProjectStore();

const projectId = ref(route.params.id as string);
const project = ref<any>(null);
const loading = ref(true);
const artworkImage = ref('');
const showControls = ref(true);
const showInstructions = ref(true);

const scale = ref(1);
const rotation = ref(0);
const brightness = ref(100);
const contrast = ref(100);
const arContainer = ref<HTMLDivElement | null>(null);
const artworkRef = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  try {
    project.value = await projectStore.fetchProject(projectId.value);

    // Use project thumbnail or generate from layers
    if (project.value.thumbnail) {
      artworkImage.value = project.value.thumbnail;
    } else {
      // TODO: Generate composite from layers
      artworkImage.value = project.value.thumbnail || '/placeholder-art.png';
    }
  } catch (error) {
    console.error('Failed to load project:', error);
  } finally {
    loading.value = false;
  }
});

const resetPlacement = () => {
  scale.value = 1;
  rotation.value = 0;
  brightness.value = 100;
  contrast.value = 100;
};

const toggleControls = () => {
  showControls.value = !showControls.value;
};

const captureScreenshot = async () => {
  if (!artworkRef.value) return;

  try {
    const canvas = await html2canvas(artworkRef.value);
    const link = document.createElement('a');
    link.download = `${project.value?.title || 'artwork'}-ar-screenshot.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
  }
};

const shareAR = async () => {
  const shareData = {
    title: project.value?.title || 'Artwork',
    text: 'Check out this artwork in AR!',
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: copy link
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  } catch (error) {
    console.error('Failed to share:', error);
  }
};
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, #6366f1);
  cursor: pointer;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, #6366f1);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}
</style>
