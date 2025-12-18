<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Art Gallery
          <span class="text-2xl ml-4 text-cyan-400">🎨</span>
        </h1>
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
        <!-- <select
          v-model="sortBy"
          @change="fetchGallery"
          class="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="-voteCount">Most Popular</option>
          <option value="-createdAt">Newest</option>
          <option value="-viewCount">Most Viewed</option>
        </select> -->
        <select
          v-model="filterType"
          @change="fetchGallery"
          class="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Artworks</option>
          <option value="auction">On Auction</option>
          <!-- <option value="trending">Trending</option> -->
        </select>
      </div>

      <div v-if="projectStore.loading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"/>
      </div>

      <div v-else-if="projectStore.projects.length === 0" class="text-center py-12">
        <p class="text-slate-400 text-lg">No artworks found</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projectStore.projects"
          :key="project._id"
          class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group relative"
        >
          <!-- Auction Badge -->
          <div v-if="project.auction?.isActive" class="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            AUCTION
          </div>

          <RouterLink :to="`/project/${project._id}`" class="block">
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
          </RouterLink>

          <div class="p-4">
            <RouterLink :to="`/project/${project._id}`">
              <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {{ project.title }}
              </h3>
            </RouterLink>

            <div class="flex items-center gap-2 mb-3">
              <div class="w-6 h-6 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full"/>
              <span class="text-sm text-slate-400">{{ project.owner?.username }}</span>
            </div>

            <!-- Auction Info -->
            <div v-if="project.auction?.isActive" class="mb-3 p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div class="flex justify-between items-center text-sm">
                <span class="text-yellow-400 font-medium">Current Bid:</span>
                <span class="text-white font-bold">€{{ project.auction.currentPrice || project.auction.startPrice }}</span>
              </div>
              <div class="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>{{ project.auction.bids?.length || 0 }} bids</span>
                <span v-if="project.auction.endDate">Ends {{ getTimeRemaining(project.auction.endDate) }}</span>
              </div>
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

                <!-- Vote Buttons -->
                <div class="flex items-center gap-1">
                  <button
                    @click.prevent="handleVote(project._id, 1)"
                    class="p-1 hover:bg-green-500/20 rounded transition-colors"
                    :class="{ 'text-green-500': hasUpvoted(project) }"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </button>
                  <span class="font-medium" :class="getVoteColor(project.voteCount)">
                    {{ project.voteCount || 0 }}
                  </span>
                  <!-- <button
                    @click.prevent="handleVote(project._id, -1)"
                    class="p-1 hover:bg-red-500/20 rounded transition-colors"
                    :class="{ 'text-red-500': hasDownvoted(project) }"
                  >
                    <svg class="w-4 h-4 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </button> -->
                </div>
              </div>

              <!-- Fork Count -->
              <span v-if="project.forks?.length > 0" class="flex items-center gap-1 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                {{ project.forks.length }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';

const projectStore = useProjectStore();
const authStore = useAuthStore();
const searchQuery = ref('');
const sortBy = ref('-voteCount');
const filterType = ref('all');

// Cache for search results
const searchCache = new Map<string, any>();

onMounted(() => {
  fetchGallery();
});

// Watch filterType changes
watch(filterType, () => {
  fetchGallery();
});

const fetchGallery = async () => {
  const cacheKey = `${searchQuery.value}-${sortBy.value}-${filterType.value}`;

  // Check cache first
  if (searchCache.has(cacheKey)) {
    projectStore.projects = searchCache.get(cacheKey);
    return;
  }

  const params: any = {
    sort: sortBy.value,
    search: searchQuery.value
  };

  // Filter by auction status
  if (filterType.value === 'auction') {
    params.onlyAuction = true;
  }

  const result = await projectStore.fetchProjects(params);

  // Cache the results
  if (result?.projects) {
    searchCache.set(cacheKey, result.projects);
  }
};

// Debounced search handler
let searchTimeout: any;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchGallery();
  }, 300); // Reduced to 300ms for better responsiveness
};

const handleVote = async (projectId: string, value: number) => {
  if (!authStore.isAuthenticated) {
    alert('Please login to vote');
    return;
  }

  try {
    await projectStore.voteProject(projectId, value);
    // Clear cache and refresh to show updated votes
    searchCache.clear();
    await fetchGallery();
  } catch (error) {
    console.error('Vote error:', error);
  }
};

const hasUpvoted = (project: any) => {
  if (!authStore.user) return false;
  return project.votes?.some((v: any) => v.user === authStore.user._id && v.value === 1);
};

const hasDownvoted = (project: any) => {
  if (!authStore.user) return false;
  return project.votes?.some((v: any) => v.user === authStore.user._id && v.value === -1);
};

const getVoteColor = (count: number) => {
  if (count > 10) return 'text-green-400';
  if (count > 5) return 'text-cyan-400';
  if (count < -5) return 'text-red-400';
  return 'text-slate-400';
};

const getTimeRemaining = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `in ${days}d ${hours}h`;
  return `in ${hours}h`;
};
</script>
