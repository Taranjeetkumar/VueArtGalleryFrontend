<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8">
        <h2 class="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="you@example.com"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="••••••••"
            >
          </div>

          <div v-if="authStore.error" class="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p class="text-sm text-red-400">{{ authStore.error }}</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full px-4 py-3 text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-400">
          Don't have an account?
          <RouterLink to="/register" class="text-cyan-400 hover:text-cyan-300 font-medium">
            Sign up
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value);
  if (success) {
    // Check if there's a redirect parameter
    const redirectUrl = route.query.redirect as string;
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/dashboard');
    }
  }
};
</script>
