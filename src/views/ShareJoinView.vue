<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div class="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"/>
          <h2 class="text-2xl font-bold text-white">Joining Project...</h2>
          <p class="text-slate-400">Please wait while we add you to the project</p>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="space-y-4">
          <div class="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white">Successfully Joined!</h2>
          <p class="text-slate-400">{{ message }}</p>
          <button
            @click="goToProject"
            class="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all"
          >
            Open Project
          </button>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="space-y-4">
          <div class="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white">Failed to Join</h2>
          <p class="text-slate-400">{{ errorMessage }}</p>
          <div class="flex gap-3">
            <button
              @click="goToHome"
              class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Go Home
            </button>
            <button
              v-if="!authStore.isAuthenticated"
              @click="goToLogin"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref(false);
const error = ref(false);
const message = ref('');
const errorMessage = ref('');
const projectId = ref('');

onMounted(async () => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    error.value = true;
    loading.value = false;
    errorMessage.value = 'You need to be logged in to join a project. Please login first.';
    return;
  }

  const id = route.params.id as string;
  const token = route.params.token as string;

  projectId.value = id;

  if (!id || !token) {
    error.value = true;
    loading.value = false;
    errorMessage.value = 'Invalid share link. Please check the link and try again.';
    return;
  }

  try {
    const response = await projectStore.joinViaShareLink(id, token);
    success.value = true;
    message.value = response.message || 'You have been successfully added as a collaborator!';
  } catch (err: any) {
    error.value = true;
    errorMessage.value = err.response?.data?.message || 'Failed to join project. The link may be expired or invalid.';
  } finally {
    loading.value = false;
  }
});

const goToProject = () => {
  router.push(`/editor/${projectId.value}`);
};

const goToHome = () => {
  router.push('/');
};

const goToLogin = () => {
  // Store the current URL to redirect back after login
  const returnUrl = route.fullPath;
  router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
};
</script>
