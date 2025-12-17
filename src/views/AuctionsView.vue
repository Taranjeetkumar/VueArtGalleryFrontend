<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-white">Art Auctions</h1>
        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/auctions/create"
          class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Auction
        </RouterLink>
      </div>

      <!-- Featured Auctions -->
      <div v-if="featuredAuctions.endingSoon.length > 0" class="mb-12">
        <h2 class="text-2xl font-bold text-white mb-4">Ending Soon</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="auction in featuredAuctions.endingSoon"
            :key="auction._id"
            @click="$router.push(`/auctions/${auction._id}`)"
            class="bg-slate-800/50 border border-yellow-500/50 rounded-xl overflow-hidden hover:border-yellow-500 transition-all cursor-pointer group"
          >
            <div class="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden relative">
              <img
                v-if="auction.thumbnail"
                :src="auction.thumbnail"
                :alt="auction.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div v-else class="text-slate-600">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                ENDING SOON
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {{ auction.title }}
              </h3>
              <p class="text-sm text-slate-400 mb-3">By {{ auction.seller.username }}</p>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs text-slate-500">Current Bid</p>
                  <p class="text-xl font-bold text-cyan-400">€{{ auction.currentPrice }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-slate-500">Ends in</p>
                  <p class="text-sm font-semibold text-yellow-400">{{ getTimeRemaining(auction.endDate) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="auctionStore.loading" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"/>
      </div>

      <!-- Active Auctions -->
      <div v-else-if="auctionStore.auctions.length === 0" class="text-center py-12">
        <p class="text-slate-400 text-lg mb-4">No active auctions at the moment</p>
        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/auctions/create"
          class="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all"
        >
          Create First Auction
        </RouterLink>
      </div>

      <div v-else>
        <h2 class="text-2xl font-bold text-white mb-4">All Active Auctions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            v-for="auction in nonFeaturedAuctions"
            :key="auction._id"
            @click="$router.push(`/auctions/${auction._id}`)"
            class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div class="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                v-if="auction.thumbnail"
                :src="auction.thumbnail"
                :alt="auction.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div v-else class="text-slate-600">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {{ auction.title }}
              </h3>
              <p class="text-sm text-slate-400 mb-3">By {{ auction.seller.username }}</p>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs text-slate-500">Current Bid</p>
                  <p class="text-xl font-bold text-cyan-400">€{{ auction.currentPrice }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-slate-500">{{ auction.bids.length }} bids</p>
                  <p class="text-sm text-slate-400">{{ getTimeRemaining(auction.endDate) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="auctionStore.pagination.pages > 1" class="flex justify-center gap-2">
          <button
            v-for="page in auctionStore.pagination.pages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-4 py-2 rounded-lg transition-all',
              page === auctionStore.pagination.page
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuctionStore } from '../stores/auctionStore';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const auctionStore = useAuctionStore();
const authStore = useAuthStore();

const featuredAuctions = computed(() => auctionStore.featuredAuctions);

// Filter out auctions that are already shown in "Ending Soon"
const nonFeaturedAuctions = computed(() => {
  if (!auctionStore.auctions || !featuredAuctions.value?.endingSoon) {
    return auctionStore.auctions;
  }

  const endingSoonIds = new Set(
    featuredAuctions.value.endingSoon.map((auction: any) => auction._id)
  );

  return auctionStore.auctions.filter(
    (auction: any) => !endingSoonIds.has(auction._id)
  );
});

onMounted(() => {
  auctionStore.fetchActiveAuctions();
  auctionStore.fetchFeaturedAuctions();
});

const changePage = (page: number) => {
  auctionStore.fetchActiveAuctions(page);
};

const getTimeRemaining = (endDate: string) => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};
</script>
