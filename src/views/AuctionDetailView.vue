<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading && !auction" class="text-center py-12">
        <div class="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"/>
      </div>

      <!-- Error State -->
      <div v-else-if="error && !auction" class="text-center py-12">
        <p class="text-red-400 text-lg mb-4">{{ error }}</p>
        <RouterLink
          to="/auctions"
          class="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all"
        >
          Back to Auctions
        </RouterLink>
      </div>

      <!-- Auction Content -->
      <div v-else-if="auction" class="space-y-6">
        <!-- Back Button -->
        <button
          @click="$router.back()"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <!-- Status Badge -->
        <div class="flex items-center gap-3">
          <span
            :class="[
              'px-4 py-2 rounded-full text-sm font-bold uppercase',
              auction.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
              auction.status === 'ended' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/50' :
              auction.status === 'sold' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' :
              'bg-red-500/20 text-red-400 border border-red-500/50'
            ]"
          >
            {{ auction.status }}
          </span>
          <span v-if="auction.status === 'active'" class="text-slate-400">
            <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ auction.views }} views
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Image and Description -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Auction Image -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div class="aspect-video bg-slate-900 flex items-center justify-center">
                <img
                  v-if="auction.thumbnail"
                  :src="auction.thumbnail"
                  :alt="auction.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-slate-600">
                  <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 class="text-xl font-bold text-white mb-4">Description</h2>
              <p class="text-slate-300 whitespace-pre-wrap">{{ auction.description }}</p>
            </div>

            <!-- Seller Info -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 class="text-xl font-bold text-white mb-4">Seller Information</h2>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-lg">{{ auction.seller.username.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <p class="text-white font-semibold">{{ auction.seller.username }}</p>
                  <p class="text-slate-400 text-sm">Seller</p>
                </div>
              </div>
            </div>

            <!-- Bid History -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 class="text-xl font-bold text-white mb-4">Bid History ({{ auction.bids.length }})</h2>
              <div v-if="auction.bids.length === 0" class="text-center py-8 text-slate-400">
                No bids yet. Be the first to bid!
              </div>
              <div v-else class="space-y-3 max-h-96 overflow-y-auto">
                <div
                  v-for="(bid, index) in sortedBids"
                  :key="index"
                  class="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span class="text-white font-bold">{{ bid.bidder.username.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <p class="text-white font-semibold">{{ bid.bidder.username }}</p>
                      <p class="text-slate-400 text-sm">{{ formatDate(bid.timestamp) }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xl font-bold text-cyan-400">€{{ bid.amount.toLocaleString() }}</p>
                    <p v-if="index === 0" class="text-xs text-green-400 font-semibold">Highest Bid</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Bidding -->
          <div class="space-y-6">
            <!-- Auction Info Card -->
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sticky top-6">
              <h1 class="text-2xl font-bold text-white mb-2">{{ auction.title }}</h1>
              <p class="text-slate-400 text-sm mb-6">From {{ auction.project.title }}</p>

              <!-- Current Price -->
              <div class="mb-6">
                <p class="text-sm text-slate-400 mb-1">Current Bid</p>
                <p class="text-4xl font-bold text-cyan-400">€{{ auction.currentPrice.toLocaleString() }}</p>
                <p class="text-sm text-slate-500 mt-1">{{ auction.bids.length }} {{ auction.bids.length === 1 ? 'bid' : 'bids' }}</p>
              </div>

              <!-- Time Remaining -->
              <div v-if="auction.status === 'active' && !isAuctionEnded" class="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <p class="text-sm text-slate-400 mb-1">Time Remaining</p>
                <p class="text-2xl font-bold text-white">{{ timeRemaining }}</p>
              </div>

              <!-- Auction Ended Message -->
              <div v-if="isAuctionEnded && auction.status === 'active'" class="mb-6 p-4 bg-orange-500/10 rounded-lg border border-orange-500/50">
                <p class="text-sm text-orange-400 mb-1">Auction Ended</p>
                <p class="text-lg font-bold text-white">Bidding has closed</p>
              </div>

              <!-- Auction Results -->
              <div v-if="(auction.status === 'ended' || auction.status === 'sold' || isAuctionEnded) && auction.bids.length > 0" class="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/50">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p class="text-sm text-green-400 font-semibold">SOLD!</p>
                </div>
                <p class="text-white font-bold text-lg">Winner: {{ sortedBids[0].bidder.username }}</p>
                <p class="text-slate-300 text-sm">Final Price: €{{ auction.currentPrice.toLocaleString() }}</p>
              </div>

              <div v-else-if="(auction.status === 'ended' || isAuctionEnded) && auction.bids.length === 0" class="mb-6 p-4 bg-slate-500/10 rounded-lg border border-slate-500/50">
                <p class="text-sm text-slate-400 mb-1">Auction Ended</p>
                <p class="text-lg font-bold text-white">No bids received</p>
                <p class="text-slate-400 text-sm">This item was not sold</p>
              </div>

              <!-- Winner Info -->
              <div v-if="auction.winner && auction.status === 'sold'" class="mb-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/50">
                <p class="text-sm text-cyan-400 mb-1">Winner</p>
                <p class="text-lg font-bold text-white">{{ auction.winner.username }}</p>
              </div>

              <!-- Buy Now Button -->
              <button
                v-if="auction.buyNowPrice && auction.status === 'active' && canBid && !isAuctionEnded"
                @click="handleBuyNow"
                :disabled="buyNowLoading"
                class="w-full mb-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
              >
                <span v-if="buyNowLoading">Processing...</span>
                <span v-else>Buy Now - €{{ auction.buyNowPrice.toLocaleString() }}</span>
              </button>

              <!-- Bidding Form (for authenticated users who don't own the auction) -->
              <div v-if="auction.status === 'active' && !isAuctionEnded && authStore.isAuthenticated && canBid">
                <div class="mb-4">
                  <label class="block text-sm text-slate-400 mb-2">Your Bid</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">€</span>
                    <input
                      v-model.number="bidAmount"
                      type="number"
                      :min="minBidAmount"
                      step="0.01"
                      class="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="Enter bid amount"
                    />
                  </div>
                  <p class="text-xs text-slate-500 mt-1">Minimum bid: €{{ minBidAmount.toLocaleString() }}</p>
                </div>
                <button
                  @click="handlePlaceBid"
                  :disabled="!isValidBid || bidLoading"
                  class="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                >
                  <span v-if="bidLoading">Placing Bid...</span>
                  <span v-else>Place Bid</span>
                </button>
                <p v-if="bidError" class="text-red-400 text-sm mt-2">{{ bidError }}</p>
              </div>

              <!-- Login Prompt -->
              <div v-else-if="auction.status === 'active' && !isAuctionEnded && !authStore.isAuthenticated" class="text-center p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                <p class="text-slate-400 mb-4">Please login to place a bid</p>
                <RouterLink
                  to="/login"
                  class="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all"
                >
                  Login
                </RouterLink>
              </div>

              <!-- Owner Message -->
              <div v-else-if="auction.status === 'active' && !isAuctionEnded && !canBid && authStore.isAuthenticated" class="text-center p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                <p class="text-slate-400">This is your auction</p>
              </div>

              <!-- Auction Ended - Cannot Bid -->
              <div v-else-if="isAuctionEnded || auction.status === 'ended' || auction.status === 'sold'" class="text-center p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                <p class="text-slate-400">Bidding has ended</p>
              </div>

              <!-- Auction Info -->
              <div class="mt-6 pt-6 border-t border-slate-700 space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-400">Starting Price</span>
                  <span class="text-white font-semibold">€{{ auction.startingPrice.toLocaleString() }}</span>
                </div>
                <div v-if="auction.reservePrice" class="flex justify-between">
                  <span class="text-slate-400">Reserve Price</span>
                  <span class="text-white font-semibold">€{{ auction.reservePrice.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Started</span>
                  <span class="text-white font-semibold">{{ formatDate(auction.startDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Ends</span>
                  <span class="text-white font-semibold">{{ formatDate(auction.endDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuctionStore } from '../stores/auctionStore';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const auctionStore = useAuctionStore();
const authStore = useAuthStore();
const toast = useToast();

const auction = computed(() => auctionStore.currentAuction);
const loading = ref(false);
const error = ref<string | null>(null);
const bidAmount = ref<number>(0);
const bidLoading = ref(false);
const bidError = ref<string | null>(null);
const buyNowLoading = ref(false);
const timeRemaining = ref('');
let countdownInterval: number | null = null;

const sortedBids = computed(() => {
  if (!auction.value) return [];
  return [...auction.value.bids].sort((a, b) => b.amount - a.amount);
});

const minBidAmount = computed(() => {
  if (!auction.value) return 0;
  const increment = auction.value.currentPrice * 0.05; // 5% increment
  return Math.ceil(auction.value.currentPrice + Math.max(increment, 1));
});

const isValidBid = computed(() => {
  return bidAmount.value >= minBidAmount.value;
});

const canBid = computed(() => {
  if (!auction.value || !authStore.user) return false;
  return auction.value.seller._id !== authStore.user._id;
});

const isAuctionEnded = computed(() => {
  if (!auction.value) return false;
  const now = new Date().getTime();
  const end = new Date(auction.value.endDate).getTime();
  return now >= end || auction.value.status === 'ended' || auction.value.status === 'sold';
});

const updateCountdown = () => {
  if (!auction.value || auction.value.status !== 'active') {
    timeRemaining.value = 'Ended';
    return;
  }

  const now = new Date().getTime();
  const end = new Date(auction.value.endDate).getTime();
  const diff = end - now;

  if (diff <= 0) {
    timeRemaining.value = 'Ended';
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) {
    timeRemaining.value = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    timeRemaining.value = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    timeRemaining.value = `${minutes}m ${seconds}s`;
  }
};

const handlePlaceBid = async () => {
  if (!isValidBid.value || !auction.value) return;

  bidLoading.value = true;
  bidError.value = null;

  try {
    await auctionStore.placeBid(auction.value._id, bidAmount.value);

    // Show success feedback
    bidError.value = null;
    bidAmount.value = minBidAmount.value; // Reset to new minimum

    // Show success message
    toast.success('Bid placed successfully!', `You are now the highest bidder at €${auction.value.currentPrice.toLocaleString()}`);
  } catch (err: any) {
    bidError.value = err.response?.data?.message || 'Failed to place bid';
    toast.error(bidError.value);
  } finally {
    bidLoading.value = false;
  }
};

const handleBuyNow = async () => {
  if (!auction.value || !auction.value.buyNowPrice) return;

  const confirmed = await toast.confirm(`Are you sure you want to buy this item for €${auction.value.buyNowPrice.toLocaleString()}?`);
  if (!confirmed) {
    return;
  }

  buyNowLoading.value = true;
  try {
    await auctionStore.placeBid(auction.value._id, auction.value.buyNowPrice);
    toast.success('Purchase completed successfully!');
    // Auction should now be marked as sold
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || 'Failed to complete purchase';
    toast.error(errorMsg);
  } finally {
    buyNowLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(async () => {
  const auctionId = route.params.id as string;
  loading.value = true;

  try {
    await auctionStore.fetchAuctionById(auctionId);
    if (auction.value) {
      bidAmount.value = minBidAmount.value;
      updateCountdown();
      countdownInterval = window.setInterval(updateCountdown, 1000);
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load auction';
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>
