<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-[150] overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          @click="$emit('close')"
        ></div>

        <!-- Scrollable Container -->
        <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-6">
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div 
              v-if="show"
              class="relative w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 text-left align-middle shadow-2xl transition-all border border-white/20 dark:border-white/5"
              :class="maxWidthClass"
            >
              <!-- Modal Header -->
              <div v-if="title || $slots.header" class="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 relative">
                <!-- Subtle brand accent at the top -->
                <div class="absolute top-0 left-0 w-full h-[3px] bg-[#6a0d5f]"></div>
                
                <div class="flex justify-between items-center relative z-10">
                  <div class="flex items-center gap-4 text-left">
                    <div v-if="icon" class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#6a0d5f]/5 text-[#6a0d5f] dark:bg-[#6a0d5f]/20 dark:text-purple-400">
                      <component :is="iconComponent" class="w-5 h-5" v-if="typeof icon === 'object'"></component>
                      <div v-else v-html="icon" class="w-5 h-5"></div>
                    </div>
                    <slot name="header">
                      <div>
                        <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {{ title }}
                        </h3>
                        <p v-if="description" class="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                          {{ description }}
                        </p>
                      </div>
                    </slot>
                  </div>
                  <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Main Content -->
              <div class="p-6 sm:p-8" :class="contentClass">
                <slot></slot>
              </div>

              <!-- Modal Footer -->
              <div v-if="$slots.footer" class="px-6 py-5 sm:px-8 sm:py-6 bg-gray-50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-white/5 flex flex-wrap justify-end gap-3">
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  show: boolean;
  title?: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'fancy';
  icon?: any;
  contentClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  maxWidth: '2xl',
  variant: 'primary',
  contentClass: ''
});

defineEmits(['close']);

const maxWidthClass = computed(() => {
  return {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  }[props.maxWidth];
});

const variantBadgeClass = computed(() => {
  return {
    primary: 'bg-gray-400',
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    fancy: 'bg-[#6a0d5f]',
  }[props.variant];
});

const iconComponent = computed(() => props.icon);

// Lock body scroll
watch(() => props.show, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Handle Escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    // We don't emit close here because it might be unintended if not explicitly desired, 
    // but usually modals should close on ESC.
    // For now, let's keep it simple.
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', handleEscape);
});
</script>
