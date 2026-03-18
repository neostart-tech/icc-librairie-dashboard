<!-- components/Breadcrumb.vue -->
<template>
  <div class="w-full mb-8" v-reveal="{ delay: 100 }">
    <!-- Main Container Card -->
    <div class="relative overflow-hidden bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-[0_8px_32px_0_rgba(106,13,95,0.05)]">
      <!-- Decorative Gradient Glow -->
      <div class="absolute -top-12 -right-12 w-24 h-24 bg-[#6a0d5f]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col gap-6">
        <!-- Breadcrumb Navigation -->
        <nav aria-label="Breadcrumb">
          <ol class="flex items-center flex-wrap gap-2 text-[11px] font-black uppercase tracking-widest">
            <!-- Back Button Component -->
            <li v-if="showBackButton && items.length > 1" class="flex items-center mr-2">
              <button
                @click="handleBack"
                class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6a0d5f]/5 text-[#6a0d5f] hover:bg-[#6a0d5f] hover:text-white transition-all duration-300 group"
              >
                <svg class="w-3 h-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Retour</span>
              </button>
            </li>

            <!-- Iterative Breadcrumb Items -->
            <li v-for="(item, index) in items" :key="index" class="flex items-center">
              <div class="flex items-center gap-2 group">
                <component
                  :is="item.to ? NuxtLink : 'span'"
                  :to="item.to"
                  class="flex items-center gap-2 transition-all duration-300 px-3 py-1.5 rounded-lg"
                  :class="[ index === items.length - 1 ? 'text-[#6a0d5f] bg-[#6a0d5f]/10 cursor-default' : 'text-gray-400 hover:text-[#6a0d5f] hover:bg-white cursor-pointer' ]"
                >
                  <svg v-if="item.icon" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="item.icon" />
                  </svg>
                  <span class="whitespace-nowrap">{{ item.label }}</span>
                  
                  <span
                    v-if="item.badge"
                    class="ml-2 px-2 py-0.5 rounded-full text-[9px] bg-[#6a0d5f] text-white"
                  >
                    {{ item.badge }}
                  </span>
                </component>

                <!-- Separator -->
                <svg
                  v-if="index < items.length - 1"
                  class="w-3 h-3 text-gray-300 mx-1"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Title & Actions Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-5">
            <!-- Interactive Icon Backdrop -->
            <div
              v-if="icon"
              class="relative flex-shrink-0"
            >
              <div class="absolute inset-0 bg-[#6a0d5f] blur-md opacity-20 animate-pulse"></div>
              <div class="relative w-14 h-14 bg-gradient-to-br from-[#6a0d5f] to-[#851178] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#6a0d5f]/20">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
                </svg>
              </div>
            </div>

            <!-- Title Content -->
            <div class="min-w-0">
              <h1 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-1">
                {{ title || 'Tableau de bord' }}
              </h1>
              <p v-if="description" class="text-xs font-bold text-gray-500 dark:text-gray-400 truncate max-w-md">
                {{ description }}
              </p>
            </div>
          </div>

          <!-- Actions Slot -->
          <div class="flex items-center gap-3">
            <slot name="actions" />
          </div>
        </div>

        <!-- Dynamic Stats Widgets -->
        <div v-if="stats && stats.length > 0" class="flex flex-wrap gap-4 pt-4 border-t border-white/20">
          <div
            v-for="(stat, statIndex) in stats"
            :key="statIndex"
            class="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-white group hover:border-[#6a0d5f]/20 hover:shadow-lg hover:shadow-[#6a0d5f]/5 transition-all duration-300"
          >
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ stat.label }}</span>
              <span class="text-sm font-black text-[#6a0d5f]">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NuxtLink } from "#components";
import { navigateTo } from "#app";

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  showBackButton: {
    type: Boolean,
    default: false
  },
  stats: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["back"]);

const handleBack = () => {
  emit("back");
  if (props.items.length > 1) {
    const prevItem = props.items[props.items.length - 2];
    if (prevItem.to) {
      navigateTo(prevItem.to);
    }
  }
};
</script>

<style scoped>
.v-reveal {
  opacity: 0;
}
</style>
