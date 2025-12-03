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
              <button
                v-if="authStore.isAuthenticated"
                @click="handleVote(1)"
                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                👍 {{ project.voteCount || 0 }}
              </button>
              <button
                v-if="authStore.isAuthenticated"
                @click="handleFork"
                class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white rounded-lg transition-all"
              >
                Fork Project
              </button>
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

const project = ref<any>(null);

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
</script>
