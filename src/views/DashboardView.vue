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
          class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group relative"
        >
          <!-- Sold Badge -->
          <div v-if="project.soldTo" class="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            SOLD - €{{ project.soldPrice?.toLocaleString() }}
          </div>

          <!-- Auction Badge -->
          <div v-else-if="project.auction?.isActive" class="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            ON AUCTION
          </div>

          <div
            class="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer relative"
            @click="openProject(project._id)"
          >
            <!-- Sold Overlay -->
            <div v-if="project.soldTo" class="absolute inset-0 bg-black/40 flex items-center justify-center z-5">
              <div class="text-center">
                <svg class="w-16 h-16 text-green-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p class="text-white font-bold text-sm">SOLD</p>
              </div>
            </div>

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
            <h3
              class="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors cursor-pointer"
              @click="openProject(project._id)"
            >
              {{ project.title }}
            </h3>
            <p class="text-sm text-slate-400 mb-3 line-clamp-2">{{ project.description || 'No description' }}</p>

            <!-- Sold Info -->
            <div v-if="project.soldTo" class="mb-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <div class="flex items-center gap-2 text-sm">
                <span class="text-green-400 font-medium">Sold to:</span>
                <span class="text-white">{{ project.soldTo?.username || 'Unknown' }}</span>
              </div>
              <div class="text-xs text-slate-400 mt-1">
                {{ formatDate(project.soldAt) }}
              </div>
            </div>

            <!-- Auction Info -->
            <div v-else-if="project.auction?.isActive" class="mb-3 p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <div class="flex justify-between items-center text-sm">
                <span class="text-yellow-400 font-medium">Current Bid:</span>
                <span class="text-white font-bold">€{{ project.auction.currentPrice || project.auction.startPrice }}</span>
              </div>
              <div class="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>{{ project.auction.bids?.length || 0 }} bids</span>
                <span v-if="project.auction.endDate">{{ getAuctionTimeRemaining(project.auction.endDate) }}</span>
              </div>
            </div>

            <!-- Action Buttons (disable for sold items) -->
            <div class="flex items-center gap-2 mb-3">
              <button
                v-if="!project.soldTo"
                @click.stop="openShareModal(project)"
                class="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button
                v-if="!project.soldTo"
                @click.stop="openCollaboratorsModal(project)"
                class="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ project.collaborators?.length || 0 }}
              </button>
              <div v-if="project.soldTo" class="flex-1 text-center text-sm text-slate-400 italic">
                This item has been sold
              </div>
              <button
                v-if="!project.soldTo"
                @click.stop="handleDeleteProject(project._id)"
                class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

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
        @click.self="closeCreateDialog"
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
              </select>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeCreateDialog"
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

      <!-- Share Modal -->
      <div v-if="showShareModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showShareModal = false">
        <div class="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4" @click.stop>
          <h2 class="text-xl font-semibold text-white mb-4">Share Project</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Permission</label>
              <select v-model="shareRole" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white">
                <option value="viewer">Viewer (Can view only)</option>
                <option value="editor">Editor (Can edit)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Expires In</label>
              <select v-model="shareExpiry" class="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white">
                <option :value="24">24 hours</option>
                <option :value="72">3 days</option>
                <option :value="168">7 days</option>
                <option :value="720">30 days</option>
              </select>
            </div>

            <div v-if="shareLink" class="p-3 bg-slate-900 rounded-lg">
              <label class="block text-xs font-medium text-slate-400 mb-1">Share Link:</label>
              <div class="flex gap-2">
                <input
                  :value="shareLink"
                  readonly
                  class="flex-1 px-2 py-1 bg-slate-800 text-white text-sm rounded border border-slate-600"
                />
                <button
                  @click="copyShareLink"
                  class="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button @click="showShareModal = false" class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
              Cancel
            </button>
            <button @click="generateShare" :disabled="generatingLink" class="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg">
              {{ generatingLink ? 'Generating...' : 'Generate Link' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Collaborators Modal -->
      <div v-if="showCollaboratorsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showCollaboratorsModal = false">
        <div class="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto" @click.stop>
          <h2 class="text-xl font-semibold text-white mb-4">Manage Collaborators</h2>

          <div class="space-y-3">
            <div
              v-for="collab in selectedProject?.collaborators"
              :key="collab.user._id"
              class="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {{ collab.user.username[0].toUpperCase() }}
                </div>
                <div>
                  <p class="text-white font-medium">{{ collab.user.username }}</p>
                  <p class="text-sm text-slate-400">{{ collab.role }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <select
                  :value="collab.role"
                  @change="updateRole(collab.user._id, ($event.target as HTMLSelectElement).value)"
                  class="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  @click="removeCollab(collab.user._id)"
                  class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Remove
                </button>
              </div>
            </div>

            <div v-if="!selectedProject?.collaborators || selectedProject.collaborators.length === 0" class="text-center py-8 text-slate-400">
              No collaborators yet. Share a link to invite people!
            </div>
          </div>

          <button @click="showCollaboratorsModal = false" class="w-full mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '../stores/projectStore';
import { useToast } from '../composables/useToast';

const router = useRouter();
const projectStore = useProjectStore();
const toast = useToast();

const showCreateDialog = ref(false);
const showShareModal = ref(false);
const showCollaboratorsModal = ref(false);
const selectedProject = ref<any>(null);
const shareLink = ref('');
const shareRole = ref('viewer');
const shareExpiry = ref(168);
const generatingLink = ref(false);

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

const closeCreateDialog = () => {
  showCreateDialog.value = false;
};

const openShareModal = (project: any) => {
  selectedProject.value = project;
  showShareModal.value = true;
};

const openCollaboratorsModal = (project: any) => {
  selectedProject.value = project;
  showCollaboratorsModal.value = true;
};

const handleDeleteProject = async (id: string) => {
  const confirmed = await toast.confirm('Are you sure you want to delete this project? This action cannot be undone.');
  if (confirmed) {
    const success = await projectStore.deleteProject(id);
    if (success) {
      toast.success('Project deleted successfully');
      projectStore.fetchMyProjects();
    } else {
      toast.error('Failed to delete project');
    }
  }
};

const generateShare = async () => {
  if (!selectedProject.value) return;

  generatingLink.value = true;
  try {
    const share = await projectStore.generateShareLink(selectedProject.value._id, shareRole.value, shareExpiry.value);
    shareLink.value = share.link;
  } catch (error) {
    console.error('Error generating share link:', error);
  } finally {
    generatingLink.value = false;
  }
};

const copyShareLink = () => {
  if (shareLink.value) {
    navigator.clipboard.writeText(shareLink.value).then(() => {
      // Show success toast or feedback
    });
  }
};

const updateRole = async (userId: string, role: string) => {
  if (!selectedProject.value) return;

  try {
    await projectStore.updateCollaboratorRole(selectedProject.value._id, userId, role);
  } catch (error) {
    console.error('Error updating collaborator role:', error);
  }
};

const removeCollab = async (userId: string) => {
  if (!selectedProject.value) return;

  try {
    await projectStore.removeCollaborator(selectedProject.value._id, userId);
  } catch (error) {
    console.error('Error removing collaborator:', error);
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

const getAuctionTimeRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
</script>
