import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Bid {
  bidder: {
    _id: string;
    username: string;
  };
  amount: number;
  timestamp: string;
}

export interface Auction {
  _id: string;
  project: {
    _id: string;
    title: string;
    thumbnail?: string;
  };
  seller: {
    _id: string;
    username: string;
  };
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  reservePrice: number;
  buyNowPrice?: number;
  bids: Bid[];
  startDate: string;
  endDate: string;
  status: 'active' | 'ended' | 'sold' | 'cancelled';
  winner?: {
    _id: string;
    username: string;
  };
  thumbnail: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const useAuctionStore = defineStore('auction', () => {
  const auctions = ref<Auction[]>([]);
  const myAuctions = ref<Auction[]>([]);
  const myBids = ref<any[]>([]);
  const currentAuction = ref<Auction | null>(null);
  const featuredAuctions = ref<{ endingSoon: Auction[]; popular: Auction[] }>({
    endingSoon: [],
    popular: []
  });
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Fetch all active auctions
  const fetchActiveAuctions = async (page = 1) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/auctions/active`, {
        params: { page, limit: pagination.value.limit }
      });
      auctions.value = response.data.auctions;
      pagination.value = response.data.pagination;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch auctions';
      console.error('Fetch auctions error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch auction by ID
  const fetchAuctionById = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/auctions/${id}`);
      currentAuction.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch auction';
      console.error('Fetch auction error:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Create new auction
  const createAuction = async (auctionData: {
    projectId: string;
    title: string;
    description: string;
    startingPrice: number;
    reservePrice?: number;
    buyNowPrice?: number;
    duration?: number;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/auctions`, auctionData);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create auction';
      console.error('Create auction error:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Place a bid
  const placeBid = async (auctionId: string, amount: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post(`${API_URL}/auctions/${auctionId}/bid`, { amount });
      currentAuction.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to place bid';
      console.error('Place bid error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch my auctions (selling)
  const fetchMyAuctions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/auctions/my/selling`);
      myAuctions.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch your auctions';
      console.error('Fetch my auctions error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch my bids
  const fetchMyBids = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/auctions/my/bidding`);
      myBids.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch your bids';
      console.error('Fetch my bids error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Cancel auction
  const cancelAuction = async (auctionId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}/auctions/${auctionId}/cancel`);
      await fetchMyAuctions();
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to cancel auction';
      console.error('Cancel auction error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // End auction
  const endAuction = async (auctionId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.put(`${API_URL}/auctions/${auctionId}/end`);
      await fetchMyAuctions();
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to end auction';
      console.error('End auction error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch featured auctions
  const fetchFeaturedAuctions = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`${API_URL}/auctions/featured`);
      featuredAuctions.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch featured auctions';
      console.error('Fetch featured auctions error:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    auctions,
    myAuctions,
    myBids,
    currentAuction,
    featuredAuctions,
    loading,
    error,
    pagination,
    fetchActiveAuctions,
    fetchAuctionById,
    createAuction,
    placeBid,
    fetchMyAuctions,
    fetchMyBids,
    cancelAuction,
    endAuction,
    fetchFeaturedAuctions
  };
});
