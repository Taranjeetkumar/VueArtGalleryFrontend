<template>
  <div class="flex h-full w-80 flex-col border-l border-slate-700 bg-slate-800">
    <!-- Header -->
    <div class="border-b border-slate-700 px-4 py-3">
      <h2 class="flex items-center gap-2 font-semibold text-white">
        <svg class="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        AI Assistant
      </h2>
    </div>

    <!-- Content -->
    <div class="flex-1 space-y-4 overflow-y-auto p-4">
      <!-- Tab Navigation -->
      <div class="flex gap-2 rounded-lg bg-slate-900 p-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-1 rounded px-3 py-2 text-sm font-medium transition-all"
          :class="
            activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Generate Tab -->
      <div v-if="activeTab === 'generate'" class="space-y-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-300">
            Describe your artwork
          </label>
          <textarea
            v-model="generatePrompt"
            placeholder="A beautiful sunset over mountains..."
            rows="4"
            class="w-full resize-none rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-300"> Size </label>
          <select
            v-model="imageSize"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="1024x1024">Square (1024x1024)</option>
            <option value="1792x1024">Landscape (1792x1024)</option>
            <option value="1024x1792">Portrait (1024x1792)</option>
          </select>
        </div>

        <button
          @click="handleGenerateImage"
          :disabled="loading || !generatePrompt"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div
            v-if="loading"
            class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
          />
          <span>{{ loading ? "Generating..." : "Generate Image" }}</span>
        </button>

        <!-- Generated Image Preview -->
        <div v-if="generatedImage" class="space-y-2">
          <img
            :src="generatedImage"
            alt="Generated"
            class="w-full rounded-lg border border-slate-600"
          />
          <button
            @click="addToCanvas"
            class="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white transition-colors hover:bg-slate-600"
          >
            Add to Canvas
          </button>
        </div>
      </div>

      <!-- Suggestions Tab -->
      <div v-if="activeTab === 'suggestions'" class="space-y-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-300"> Artwork Description </label>
          <textarea
            v-model="suggestionDescription"
            placeholder="Describe your current artwork..."
            rows="3"
            class="w-full resize-none rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-300"> Style </label>
          <input
            v-model="artStyle"
            placeholder="e.g., Abstract, Realistic, Minimalist"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <button
          @click="handleGetSuggestions"
          :disabled="loading || !suggestionDescription"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 font-medium text-white transition-all hover:from-cyan-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div
            v-if="loading"
            class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
          />
          <span>{{ loading ? "Getting Suggestions..." : "Get AI Suggestions" }}</span>
        </button>

        <!-- Suggestions Display -->
        <div v-if="suggestions" class="mt-4 rounded-lg border border-slate-600 bg-slate-900 p-4">
          <h3 class="mb-2 text-sm font-medium text-purple-400">AI Suggestions:</h3>
          <div class="text-sm whitespace-pre-wrap text-slate-300">{{ suggestions }}</div>
        </div>
      </div>

      <!-- Palette Tab -->
      <div v-if="activeTab === 'palette'" class="space-y-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-300"> Theme Description </label>
          <input
            v-model="paletteDescription"
            placeholder="e.g., Ocean sunset, Forest morning"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <button
          @click="handleGetPalette"
          :disabled="loading || !paletteDescription"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 px-4 py-3 font-medium text-white transition-all hover:from-green-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div
            v-if="loading"
            class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
          />
          <span>{{ loading ? "Generating..." : "Generate Palette" }}</span>
        </button>

        <!-- Color Palette Display -->
        <div v-if="colorPalette.length > 0" class="space-y-2">
          <div class="grid grid-cols-5 gap-2">
            <div
              v-for="(color, index) in colorPalette"
              :key="index"
              @click="applyColor(color)"
              class="aspect-square cursor-pointer rounded-lg border-2 border-slate-600 transition-transform hover:scale-110 hover:border-white"
              :style="{ backgroundColor: color }"
              :title="color"
            />
          </div>
          <div class="grid grid-cols-5 gap-2 text-center text-xs">
            <div
              v-for="(color, index) in colorPalette"
              :key="index"
              class="font-mono text-slate-400"
            >
              {{ color }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Notice -->
    <div class="border-t border-slate-700 bg-slate-900 px-4 py-3">
      <p class="text-xs text-slate-400">AI features powered by OpenAI. Results may vary.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useCanvasStore } from "../../stores/canvasStore";
import { useToast } from "../../composables/useToast";

const canvasStore = useCanvasStore();
const toast = useToast();

const emit = defineEmits<{
  "generated-image": [imageUrl: string];
}>();

const tabs = [
  { id: "generate", label: "Generate" },
  { id: "suggestions", label: "Suggest" },
  { id: "palette", label: "Palette" },
];

const activeTab = ref("generate");
const loading = ref(false);

// Generate Tab
const generatePrompt = ref("");
const imageSize = ref("1024x1024");
const generatedImage = ref("");

// Suggestions Tab
const suggestionDescription = ref("");
const artStyle = ref("");
const suggestions = ref("");

// Palette Tab
const paletteDescription = ref("");
const colorPalette = ref<string[]>([]);

const API_URL = "http://localhost:3001/api";

const handleGenerateImage = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/ai/generate`,
      {
        prompt: generatePrompt.value,
        size: imageSize.value,
        quality: "standard",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    generatedImage.value = response.data.imageUrl;
    toast.success('Image generated successfully!');
  } catch (error: any) {
    console.error("Generate image error:", error);
    toast.error(
      error.response?.data?.message ||
        "Failed to generate image. Please check if OpenAI API key is configured."
    );
  } finally {
    loading.value = false;
  }
};

const handleGetSuggestions = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/ai/suggestions`,
      {
        description: suggestionDescription.value,
        style: artStyle.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    suggestions.value = response.data.suggestions;
    toast.success('Suggestions generated!');
  } catch (error: any) {
    console.error("Get suggestions error:", error);
    toast.error(error.response?.data?.message || "Failed to get suggestions");
  } finally {
    loading.value = false;
  }
};

const handleGetPalette = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/ai/palette`,
      {
        description: paletteDescription.value,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    colorPalette.value = response.data.palette;
    toast.success('Color palette generated!');
  } catch (error: any) {
    console.error("Get palette error:", error);
    toast.error(error.response?.data?.message || "Failed to generate palette");
  } finally {
    loading.value = false;
  }
};

const addToCanvas = () => {
  if (generatedImage.value) {
    emit("generated-image", generatedImage.value);
  }
};

const applyColor = (color: string) => {
  canvasStore.setColor(color);
};
</script>
