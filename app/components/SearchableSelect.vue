<template>
  <div class="relative" ref="container">
    <div
      @click="toggleDropdown"
      class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200 flex items-center justify-between cursor-pointer group"
    >
      <div class="flex items-center gap-3 overflow-hidden">
        <slot name="icon" v-if="!selectedOption"></slot>
        <span v-if="selectedOption" class="truncate">{{ selectedOption.label }}</span>
        <span v-else class="text-gray-400 font-medium truncate">{{ placeholder }}</span>
      </div>
      <svg
        class="w-4 h-4 text-gray-400 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-4"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-4"
    >
      <div
        v-if="isOpen"
        class="absolute z-[60] w-full mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden shadow-[#6a0d5f]/10"
      >
        <div class="p-4 border-b border-gray-50 dark:border-white/5">
          <div class="relative">
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-[#6a0d5f] outline-none transition-all"
              :placeholder="searchPlaceholder"
              @click.stop
            />
            <svg
              class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <ul class="max-h-64 overflow-y-auto py-2 custom-scrollbar">
          <li v-if="filteredOptions.length === 0" class="px-6 py-10 text-center flex flex-col items-center gap-2">
            <svg class="w-8 h-8 text-gray-200 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Aucun résultat trouvé</p>
          </li>
          
          <li
            v-for="option in filteredOptions"
            :key="option.id"
            @click="selectOption(option)"
            class="px-6 py-4 hover:bg-[#6a0d5f]/5 dark:hover:bg-white/5 cursor-pointer transition-all flex items-center justify-between group relative"
          >
            <div class="flex flex-col">
                <span
                class="text-xs font-bold transition-colors"
                :class="modelValue === option.id ? 'text-[#6a0d5f] dark:text-purple-400' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'"
                >
                {{ option.label }}
                </span>
                <span v-if="option.description" class="text-[9px] font-medium text-gray-400 truncate max-w-[200px]">
                    {{ option.description }}
                </span>
            </div>
            
            <div 
                v-if="modelValue === option.id"
                class="w-5 h-5 bg-[#6a0d5f] dark:bg-purple-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300"
            >
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: [String, Number, null],
  options: {
    type: Array,
    required: true,
    // Expects: { id: any, label: string, description?: string }
  },
  placeholder: {
    type: String,
    default: 'Sélectionner une option'
  },
  searchPlaceholder: {
    type: String,
    default: 'Rechercher...'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const container = ref(null);
const searchInputRef = ref(null);
const isOpen = ref(false);
const searchQuery = ref('');

const selectedOption = computed(() => {
  return props.options.find(opt => opt.id === props.modelValue);
});

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query) || 
    (opt.description && opt.description.toLowerCase().includes(query))
  );
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = '';
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
};

const selectOption = (option) => {
  emit('update:modelValue', option.id);
  emit('change', option);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(106, 13, 95, 0.1);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.1);
}
</style>
