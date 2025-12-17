<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto" v-if="project">
      <div class="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div class="aspect-video bg-slate-900 flex items-center justify-center">
          <img
            v-if="project.thumbnail"
            :src="project.thumbnail"
            :alt="project.title"
            class="w-full h-full object-contain"
          >
        </div>

        <div class="p-8">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">{{ project.title }}</h1>
              <p class="text-slate-400">{{ project.description }}</p>
            </div>
            <div class="flex gap-2">
              <div v-if="!authStore.isAuthenticated" class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm">
                Login to interact
              </div>
              <template v-else>
                <!-- Owner Actions -->
                <template v-if="isOwner">
                  <button
                    @click="showShareModal = true"
                    class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button
                    @click="showCollaboratorsModal = true"
                    class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Collaborators ({{ project.collaborators?.length || 0 }})
                  </button>
                  <button
                    @click="handleDelete"
                    class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </template>

                <!-- Non-owner Actions -->
                <button
                  v-if="!isOwner"
                  @click="handleVote(1)"
                  class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  👍 {{ project.voteCount || 0 }}
                </button>
                <button
                  v-if="!isOwner"
                  @click="handleFork"
                  class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg transition-all"
                >
                  Fork Project
                </button>
              </template>
            </div>
          </div>

          <!-- Collaborators List (if any) -->
          <div v-if="project.collaborators && project.collaborators.length > 0" class="mb-6 p-4 bg-slate-900/50 rounded-lg">
            <h3 class="text-sm font-semibold text-slate-300 mb-2">Collaborators:</h3>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="collab in project.collaborators"
                :key="collab.user._id"
                class="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full"
              >
                <div class="w-6 h-6 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full" />
                <span class="text-sm text-white">{{ collab.user.username }}</span>
                <span class="text-xs text-slate-400">({{ collab.role }})</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 mb-6">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full"/>
              <div>
                <p class="text-white font-medium">{{ project.owner?.username }}</p>
                <p class="text-sm text-slate-400">{{ project.owner?.email }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-slate-900/50 rounded-lg p-4">
              <p class="text-sm text-slate-400 mb-1">Views</p>
              <p class="text-2xl font-bold text-white">{{ project.viewCount || 0 }}</p>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-4">
              <p class="text-sm text-slate-400 mb-1">Votes</p>
              <p class="text-2xl font-bold text-white">{{ project.voteCount || 0 }}</p>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-4">
              <p class="text-sm text-slate-400 mb-1">Version</p>
              <p class="text-2xl font-bold text-white">{{ project.currentVersion }}</p>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-4">
              <p class="text-sm text-slate-400 mb-1">Forks</p>
              <p class="text-2xl font-bold text-white">{{ project.forks?.length || 0 }}</p>
            </div>
          </div>
        </div>
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
            v-for="collab in project?.collaborators"
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

          <div v-if="!project?.collaborators || project.collaborators.length === 0" class="text-center py-8 text-slate-400">
            No collaborators yet. Share a link to invite people!
          </div>
        </div>

        <button @click="showCollaboratorsModal = false" class="w-full mt-6 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const authStore = useAuthStore();

const project = ref<any>(null);
const showShareModal = ref(false);
const showCollaboratorsModal = ref(false);
const shareLink = ref('');
const shareRole = ref('viewer');
const shareExpiry = ref(168); // 7 days default
const generatingLink = ref(false);

const isOwner = computed(() => {
  return project.value && authStore.user &&
         project.value.owner._id === authStore.user._id;
});

onMounted(async () => {
  const data = await projectStore.fetchProject(route.params.id as string);
  project.value = data;
});

const handleVote = async (value: number) => {
  await projectStore.voteProject(route.params.id as string, value);
  const data = await projectStore.fetchProject(route.params.id as string);
  project.value = data;
};

const handleFork = async () => {
  const forked = await projectStore.forkProject(route.params.id as string);
  if (forked) {
    router.push(`/editor/${forked._id}`);
  }
};

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
    return;
  }

  const success = await projectStore.deleteProject(route.params.id as string);
  if (success) {
    router.push('/dashboard');
  }
};

const generateShare = async () => {
  generatingLink.value = true;
  const result = await projectStore.generateShareLink(
    route.params.id as string,
    shareRole.value,
    shareExpiry.value
  );
  if (result) {
    shareLink.value = result.shareUrl;
  }
  generatingLink.value = false;
};

const copyShareLink = () => {
  navigator.clipboard.writeText(shareLink.value);
  alert('Link copied to clipboard!');
};

const updateRole = async (userId: string, role: string) => {
  await projectStore.updateCollaboratorRole(route.params.id as string, userId, role);
  const data = await projectStore.fetchProject(route.params.id as string);
  project.value = data;
};

const removeCollab = async (userId: string) => {
  if (!confirm('Are you sure you want to remove this collaborator?')) {
    return;
  }
  await projectStore.removeCollaborator(route.params.id as string, userId);
  const data = await projectStore.fetchProject(route.params.id as string);
  project.value = data;
};
</script>
