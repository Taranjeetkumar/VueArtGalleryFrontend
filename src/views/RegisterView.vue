<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8">
        <h2 class="text-3xl font-bold text-white text-center mb-8">Create Account</h2>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <input
              v-model="username"
              type="text"
              required
              minlength="3"
              class="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="artist123"
            >
          </div>

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
              minlength="6"
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
            {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-400">
          Already have an account?
          <RouterLink to="/login" class="text-cyan-400 hover:text-cyan-300 font-medium">
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  const success = await authStore.register(username.value, email.value, password.value);
  if (success) {
    router.push('/dashboard');
  }
};
</script>
