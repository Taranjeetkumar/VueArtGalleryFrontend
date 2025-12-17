<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="$router.back()"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 class="text-4xl font-bold text-white">Create Auction</h1>
        <p class="text-slate-400 mt-2">List your artwork for auction</p>
      </div>

      <!-- Loading Projects -->
      <div v-if="projectsLoading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"/>
        <p class="text-slate-400 mt-4">Loading your projects...</p>
      </div>

      <!-- No Projects Message -->
      <div v-else-if="projects.length === 0" class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
        <svg class="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-xl font-bold text-white mb-2">No Projects Found</h3>
        <p class="text-slate-400 mb-6">You need to create a project before you can list it for auction</p>
        <RouterLink
          to="/projects/create"
          class="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all"
        >
          Create Project
        </RouterLink>
      </div>

      <!-- Auction Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Project Selection -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <label class="block text-sm font-medium text-white mb-2">
            Select Project <span class="text-red-400">*</span>
          </label>
          <select
            v-model="formData.projectId"
            required
            class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="" disabled>Choose a project...</option>
            <option
              v-for="project in projects"
              :key="project._id"
              :value="project._id"
            >
              {{ project.title }}
            </option>
          </select>
          <p class="text-xs text-slate-500 mt-2">Select the artwork you want to auction</p>
        </div>

        <!-- Auction Title -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <label class="block text-sm font-medium text-white mb-2">
            Auction Title <span class="text-red-400">*</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            maxlength="100"
            class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
            placeholder="Enter auction title"
          />
          <p class="text-xs text-slate-500 mt-2">A catchy title for your auction listing</p>
        </div>

        <!-- Description -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <label class="block text-sm font-medium text-white mb-2">
            Description <span class="text-red-400">*</span>
          </label>
          <textarea
            v-model="formData.description"
            required
            rows="6"
            maxlength="2000"
            class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none resize-none"
            placeholder="Describe your artwork, its story, and why it's special..."
          ></textarea>
          <p class="text-xs text-slate-500 mt-2">{{ formData.description.length }}/2000 characters</p>
        </div>

        <!-- Pricing -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
          <h3 class="text-lg font-semibold text-white mb-4">Pricing</h3>

          <!-- Starting Price -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Starting Price <span class="text-red-400">*</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
              <input
                v-model.number="formData.startingPrice"
                type="number"
                required
                min="1"
                step="0.01"
                class="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <p class="text-xs text-slate-500 mt-2">The initial bidding price</p>
          </div>

          <!-- Reserve Price -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Reserve Price (Optional)
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
              <input
                v-model.number="formData.reservePrice"
                type="number"
                min="0"
                step="0.01"
                class="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <p class="text-xs text-slate-500 mt-2">Minimum price you're willing to accept</p>
          </div>

          <!-- Buy Now Price -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Buy Now Price (Optional)
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
              <input
                v-model.number="formData.buyNowPrice"
                type="number"
                min="0"
                step="0.01"
                class="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <p class="text-xs text-slate-500 mt-2">Allow buyers to purchase immediately at this price</p>
          </div>
        </div>

        <!-- Duration -->
        <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <label class="block text-sm font-medium text-white mb-2">
            Auction Duration <span class="text-red-400">*</span>
          </label>
          <select
            v-model.number="formData.duration"
            required
            class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="" disabled>Select duration...</option>
            <option :value="24">24 Hours</option>
            <option :value="48">48 Hours</option>
            <option :value="72">72 Hours (3 Days)</option>
            <option :value="168">7 Days</option>
          </select>
          <p class="text-xs text-slate-500 mt-2">How long the auction will run</p>
        </div>

        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
          <p class="text-red-400 font-semibold mb-2">Please fix the following errors:</p>
          <ul class="list-disc list-inside text-red-400 text-sm space-y-1">
            <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
          </ul>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-4">
          <button
            type="button"
            @click="$router.back()"
            class="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || validationErrors.length > 0"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
          >
            <span v-if="loading">Creating Auction...</span>
            <span v-else>Create Auction</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuctionStore } from '../stores/auctionStore';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

const router = useRouter();
const auctionStore = useAuctionStore();
const authStore = useAuthStore();

const API_URL = 'http://localhost:3001/api';

interface Project {
  _id: string;
  title: string;
  thumbnail?: string;
}

const projects = ref<Project[]>([]);
const projectsLoading = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const formData = ref({
  projectId: '',
  title: '',
  description: '',
  startingPrice: null as number | null,
  reservePrice: null as number | null,
  buyNowPrice: null as number | null,
  duration: null as number | null
});

const validationErrors = computed(() => {
  const errors: string[] = [];

  if (formData.value.startingPrice && formData.value.startingPrice < 1) {
    errors.push('Starting price must be at least €1');
  }

  if (formData.value.reservePrice && formData.value.startingPrice) {
    if (formData.value.reservePrice < formData.value.startingPrice) {
      errors.push('Reserve price must be greater than or equal to starting price');
    }
  }

  if (formData.value.buyNowPrice && formData.value.startingPrice) {
    if (formData.value.buyNowPrice <= formData.value.startingPrice) {
      errors.push('Buy now price must be greater than starting price');
    }
  }

  if (formData.value.buyNowPrice && formData.value.reservePrice) {
    if (formData.value.buyNowPrice < formData.value.reservePrice) {
      errors.push('Buy now price must be greater than or equal to reserve price');
    }
  }

  return errors;
});

const fetchProjects = async () => {
  projectsLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/projects/my-projects`);
    projects.value = response.data.filter((project: any) => !project.forSale && !project.auctionId);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    error.value = 'Failed to load your projects';
  } finally {
    projectsLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (validationErrors.value.length > 0) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const auctionData = {
      projectId: formData.value.projectId,
      title: formData.value.title,
      description: formData.value.description,
      startingPrice: formData.value.startingPrice!,
      reservePrice: formData.value.reservePrice || undefined,
      buyNowPrice: formData.value.buyNowPrice || undefined,
      duration: formData.value.duration!
    };

    const result = await auctionStore.createAuction(auctionData);

    if (result) {
      router.push(`/auctions/${result._id}`);
    } else {
      error.value = auctionStore.error || 'Failed to create auction';
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to create auction';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  fetchProjects();
});
</script>
