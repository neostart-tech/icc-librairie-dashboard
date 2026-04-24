<template>
  <div class="min-h-screen bg-[#f8f9fa] dark:bg-gray-950 transition-colors duration-500 overflow-x-hidden relative">
    <!-- Background Atmosphere (Épurée Library) -->
    <!-- <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#f8f9fa] dark:bg-gray-950">
      <img 
        src="/images/auth_background.png" 
        class="w-full h-full object-cover scale-110 opacity-20 dark:opacity-10 transition-all duration-1000"
        alt="Library Background"
      /> -->
      <!-- Soft Artistic Overlays -->
      <!-- <div class="absolute inset-0 bg-gradient-to-br from-[#6a0d5f]/10 via-transparent to-orange-400/5 backdrop-blur-[60px]"></div>
      <div class="absolute inset-0 bg-white/40 dark:bg-gray-950/60"></div> -->
    <!-- </div> -->

    <!-- Sidebar -->
    <Sidebar :is-sidebar-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" class="z-40" />

    <!-- Header -->
    <Header :is-sidebar-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" class="z-30" />

    <!-- Contenu principal -->
    <main
      :class="[ 'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pt-20 relative z-10', isSidebarOpen ? 'lg:ml-72' : 'lg:ml-24', ]"
      class="px-6 py-8"
    >
      <div class="max-w-[1600px] mx-auto">
        <!-- Zone de contenu avec révélation progressive -->
        <div v-reveal class="reveal-up">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleResize = () => {
  if (window.innerWidth >= 1280) {
    isSidebarOpen.value = true;
  } else {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
