<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">
            Create Art
            <span class="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Together
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            A collaborative digital art studio with real-time co-creation, version control, and AI-powered tools
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink
              to="/register"
              class="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 rounded-xl transition-all transform hover:scale-105"
            >
              Get Started Free
            </RouterLink>
            <RouterLink
              to="/gallery"
              class="px-8 py-4 text-lg font-semibold text-white border-2 border-slate-600 hover:border-cyan-500 rounded-xl transition-all"
            >
              Explore Gallery
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Animated background -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"/>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"/>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white text-center mb-12">
          Powerful Features for Creative Collaboration
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon="users"
            title="Real-time Collaboration"
            description="Work together with multiple artists on the same canvas in real-time with live cursors"
          />
          <FeatureCard
            icon="layers"
            title="Advanced Layers"
            description="Professional layer system with opacity controls and blending modes"
          />
          <FeatureCard
            icon="git"
            title="Version Control"
            description="Git-like forking and version history to track your artistic evolution"
          />
          <FeatureCard
            icon="ai"
            title="AI-Assisted Tools"
            description="Get AI suggestions, auto-enhancements, and style transfer capabilities"
          />
          <FeatureCard
            icon="export"
            title="Multi-format Export"
            description="Export your artwork in PNG, JPG, SVG, and other popular formats"
          />
          <FeatureCard
            icon="gallery"
            title="Public Gallery"
            description="Share your work, vote on favorites, and even auction your digital art"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-white mb-6">
          Ready to Start Creating?
        </h2>
        <p class="text-xl text-slate-300 mb-8">
          Join thousands of artists collaborating and creating amazing digital art
        </p>
        <RouterLink
          to="/register"
          class="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 rounded-xl transition-all transform hover:scale-105"
        >
          Create Free Account
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import FeatureCard from '../components/common/FeatureCard.vue';
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse 4s ease-in-out infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
