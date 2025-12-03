<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Art Gallery</h1>
        <p class="text-xl text-slate-300">Explore amazing artworks created by our community</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search artworks..."
            class="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
        </div>
        <select
          v-model="sortBy"
          @change="fetchGallery"
          class="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="-voteCount">Most Popular</option>
          <option value="-createdAt">Newest</option>
          <option value="-viewCount">Most Viewed</option>
        </select>
      </div>

      <div v-if="projectStore.loading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"/>
      </div>

      <div v-else-if="projectStore.projects.length === 0" class="text-center py-12">
        <p class="text-slate-400 text-lg">No artworks found</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="project in projectStore.projects"
          :key="project._id"
          :to="`/project/${project._id}`"
          class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group"
        >
          <div class="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
            <img
              v-if="project.thumbnail"
              :src="project.thumbnail"
              :alt="project.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform"
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

            <div class="flex items-center gap-2 mb-3">
              <div class="w-6 h-6 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full"/>
              <span class="text-sm text-slate-400">{{ project.owner?.username }}</span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1 text-slate-400">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  {{ project.viewCount || 0 }}
                </span>
                <span class="flex items-center gap-1 text-slate-400">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {{ project.voteCount || 0 }}
                </span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProjectStore } from '../stores/projectStore';

const projectStore = useProjectStore();
const searchQuery = ref('');
const sortBy = ref('-voteCount');

onMounted(() => {
  fetchGallery();
});

const fetchGallery = () => {
  projectStore.fetchProjects({
    sort: sortBy.value,
    search: searchQuery.value
  });
};

let searchTimeout: any;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchGallery();
  }, 500);
};
</script>
