<template>
  <nav class="bg-slate-900/90 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <span class="text-xl font-bold text-white">ArtStudio</span>
        </RouterLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <RouterLink to="/" class="nav-link">
            Home
            <div v-if="$route.path === '/'" class="active-underline"></div>
          </RouterLink>

          <RouterLink to="/gallery" class="nav-link">
            Gallery
            <div v-if="$route.path === '/gallery'" class="active-underline"></div>
          </RouterLink>

          <RouterLink to="/auctions" class="nav-link">
            Auctions
            <div v-if="$route.path.startsWith('/auctions')" class="active-underline"></div>
          </RouterLink>

          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/dashboard"
            class="nav-link"
          >
            My Projects
            <div v-if="$route.path === '/dashboard'" class="active-underline"></div>
          </RouterLink>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <span class="text-slate-300 hidden md:block">
              {{ authStore.user?.username }}
            </span>

            <button
              @click="handleLogout"
              class="px-4 py-2 font-medium text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Logout
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="px-4 py-2 font-medium text-white hover:text-cyan-400 transition-colors"
            >
              Login
            </RouterLink>

            <RouterLink
              to="/register"
              class="px-4 py-2 font-medium text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 rounded-lg transition-all"
            >
              Sign Up
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
@reference "tailwindcss";

.nav-link {
  @apply font-medium text-slate-300 hover:text-white transition-colors relative;
}

/* fixed underline element */
.active-underline {
  @apply absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full;
}
</style>
