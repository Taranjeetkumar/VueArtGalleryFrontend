<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/authStore';
import NavBar from './components/common/NavBar.vue';
import Toast from './components/common/Toast.vue';

const route = useRoute();
const authStore = useAuthStore();

const isEditorRoute = computed(() => route.name === 'Editor');

onMounted(() => {
  if (authStore.token) {
    authStore.fetchUser();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <NavBar v-if="!isEditorRoute" />
    <main :class="{ 'h-screen': isEditorRoute }">
      <RouterView />
    </main>
    <Toast />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
