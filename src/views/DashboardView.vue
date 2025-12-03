<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-white">My Projects</h1>
        <button
          @click="showCreateDialog = true"
          class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>

      <div v-if="projectStore.loading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"/>
      </div>

      <div v-else-if="projectStore.myProjects.length === 0" class="text-center py-12">
        <p class="text-slate-400 text-lg mb-4">You don't have any projects yet</p>
        <button
          @click="showCreateDialog = true"
          class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all"
        >
          Create Your First Project
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projectStore.myProjects"
          :key="project._id"
          class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group cursor-pointer"
          @click="openProject(project._id)"
        >
          <div class="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
            <img
              v-if="project.thumbnail"
              :src="project.thumbnail"
              :alt="project.title"
              class="w-full h-full object-cover"
            >
            <div v-else class="text-slate-600">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div class="p-4">
            <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-sm text-slate-400 mb-3 line-clamp-2">{{ project.description || 'No description' }}</p>

            <div class="flex items-center justify-between text-sm">
              <span class="text-slate-500">
                Updated {{ formatDate(project.updatedAt) }}
              </span>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                  v{{ project.currentVersion }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Project Dialog -->
      <div
        v-if="showCreateDialog"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showCreateDialog = false"
      >
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
          <h2 class="text-2xl font-bold text-white mb-4">Create New Project</h2>

          <form @submit.prevent="createProject" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                v-model="newProject.title"
                type="text"
                required
                class="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="My Artwork"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                v-model="newProject.description"
                rows="3"
                class="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Describe your project..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Visibility</label>
              <select
                v-model="newProject.visibility"
                class="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="showCreateDialog = false"
                class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="projectStore.loading"
                class="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg transition-all disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '../stores/projectStore';

const router = useRouter();
const projectStore = useProjectStore();

const showCreateDialog = ref(false);
const newProject = ref({
  title: '',
  description: '',
  visibility: 'private'
});

onMounted(() => {
  projectStore.fetchMyProjects();
});

const openProject = (id: string) => {
  router.push(`/editor/${id}`);
};

const createProject = async () => {
  const project = await projectStore.createProject(newProject.value);
  if (project) {
    showCreateDialog.value = false;
    newProject.value = { title: '', description: '', visibility: 'private' };
    router.push(`/editor/${project._id}`);
  }
};

const formatDate = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
};
</script>
