<template>
  <div class="min-h-screen space-y-8 pb-12 relative">
    <!-- Premium Loading Overlay -->
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-700 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPageLoading"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl"
      >
        <div class="relative">
          <div class="w-24 h-24 rounded-full border-4 border-[#6a0d5f]/10 border-t-[#6a0d5f] animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <img src="/logo/logo_librairie(1).png" class="w-12 h-12 object-contain" alt="Logo" />
          </div>
        </div>
        <div class="mt-6 flex flex-col items-center">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Chargement des flux</span>
          <div class="flex gap-1 mt-2">
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.3s"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Header Section -->
    <Breadcrumb :items="[
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Stocks', to: null },
    ]" title="Mouvements de Stock" description="Suivez l'historique complet des entrées et sorties de votre catalogue." :icon="StockIconPath" />

    <div class="max-w-[1600px] mx-auto space-y-8 px-4 sm:px-8">
      <!-- Toolbar -->
      <div 
        v-reveal="{ delay: 200 }"
        class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/40 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl p-6 shadow-xl relative z-20"
      >
        <div class="flex flex-1 items-center gap-4">
          <div class="relative flex-1 max-w-md group">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6a0d5f] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="search"
              type="text"
              placeholder="Filtrer par titre de livre..."
              class="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300"
              title="Configurer les colonnes"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div v-if="isDropdownOpen" class="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                <div class="p-2 space-y-1">
                  <label v-for="col in allColumns" :key="col.field" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-[#6a0d5f]/5 dark:hover:bg-[#6a0d5f]/10 rounded-xl cursor-pointer transition-colors group">
                    <input type="checkbox" v-model="col.visible" class="w-4 h-4 rounded-lg border-gray-300 text-[#6a0d5f] focus:ring-[#6a0d5f]" />
                    <span class="font-bold uppercase text-[10px] tracking-widest">{{ col.title }}</span>
                  </label>
                </div>
              </div>
            </transition>
          </div>

          <NuxtLink
            to="/stocks/mouvements"
            class="px-6 py-3 bg-[#6a0d5f] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau Flux
          </NuxtLink>
        </div>
      </div>

      <!-- Table Section -->
      <div 
        v-reveal="{ delay: 400 }"
        class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-8 shadow-2xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <Vue3Datatable
          :rows="filteredRows"
          :columns="columns"
          :pagination="true"
          :page-size="10"
          :sortable="true"
          skin="bh-table-hover"
          class="premium-table"
        >
          <template #livre="data">
            <div class="flex items-center gap-4">
              <img 
                :src="data.value.image" 
                class="w-10 h-14 object-cover rounded-lg shadow-md border border-white/10" 
              />
              <span class="font-bold text-gray-900 dark:text-white uppercase tracking-tighter text-sm">
                {{ data.value.titre }}
              </span>
            </div>
          </template>

          <template #type="data">
            <div class="flex items-center gap-2">
              <div 
                v-if="data.value.type === 'Entrée'" 
                class="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span class="text-[10px] font-black uppercase tracking-widest">Entrée</span>
              </div>
              <div 
                v-else 
                class="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                <span class="text-[10px] font-black uppercase tracking-widest">Sortie</span>
              </div>
            </div>
          </template>

          <template #quantite="data">
            <span :class="[ 'text-lg font-black tracking-tighter', data.value.type === 'Entrée' ? 'text-emerald-600' : 'text-rose-600' ]">
              {{ data.value.type === 'Entrée' ? '+' : '-' }}{{ data.value.quantite }}
            </span>
          </template>

          <template #date="data">
            <div class="flex flex-col">
              <span class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f]">{{ data.value.date }}</span>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ data.value.heure }}</span>
            </div>
          </template>

          <template #actions="data">
            <button
              @click="openDetails(data.value)"
              class="p-2.5 rounded-xl bg-gray-500/10 text-gray-500 hover:bg-[#6a0d5f] hover:text-white transition-all group"
              title="Détails"
            >
              <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Details Modal -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="showDetailModal" 
        class="fixed inset-0 z-[110] flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm pt-20"
        @click.self="showDetailModal = false"
      >
        <div class="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">
          <div :class="[ 'p-8 relative overflow-hidden transition-colors duration-500', selectedMouvement.type === 'Entrée' ? 'bg-emerald-600' : 'bg-rose-600' ]">
            <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div class="flex justify-between items-start relative z-10">
              <div class="flex items-center gap-4">
                <div class="p-4 bg-white/10 rounded-xl backdrop-blur-md">
                  <svg v-if="selectedMouvement.type === 'Entrée'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-white uppercase tracking-tighter">
                    Flux de <span class="text-white/80">Stock</span>
                  </h3>
                  <p class="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">
                    Mouvement #{{ selectedMouvement.id.split('-')[0] }}
                  </p>
                </div>
              </div>
              <button @click="showDetailModal = false" class="p-3 text-white/60 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-8">
            <div class="flex flex-col md:flex-row gap-8">
              <div class="md:w-1/3 shrink-0">
                <img :src="selectedMouvement.image" class="w-full aspect-[3/4] object-cover rounded-xl shadow-xl border border-gray-100 dark:border-white/10" />
                <div class="mt-4 text-center space-y-1">
                  <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Référence Livre</p>
                  <p class="text-xs font-black text-gray-900 dark:text-white uppercase truncate">{{ selectedMouvement.titre }}</p>
                </div>
              </div>

              <div class="flex-1 space-y-6">
                <!-- Stats Row -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Mouvement</p>
                    <p :class="[ 'text-2xl font-black tracking-tighter', selectedMouvement.type === 'Entrée' ? 'text-emerald-600' : 'text-rose-600' ]">
                      {{ selectedMouvement.type === 'Entrée' ? '+' : '-' }}{{ selectedMouvement.quantite }}
                    </p>
                  </div>
                  <div class="p-5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Horodatage</p>
                    <p class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{{ selectedMouvement.date }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ selectedMouvement.heure }}</p>
                  </div>
                </div>

                <!-- Commentaire -->
                <div class="space-y-2">
                  <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Notes de mouvement</p>
                  <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 min-h-[100px]">
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
                      {{ selectedMouvement.commentaire || "Aucun commentaire n'a été saisi pour ce mouvement de stock." }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-white/10 flex justify-end">
            <button @click="showDetailModal = false" class="px-8 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useStockStore } from "~~/stores/stock";
import { useLivreStore } from "~~/stores/livre";

/* =======================
   RESOURCES
======================= */
const StockIconPath = "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z";

/* =======================
   STORES
======================= */
const livreStore = useLivreStore();
const stockStore = useStockStore();

/* =======================
   UI STATE
======================= */
const search = ref("");
const isDropdownOpen = ref(false);
const isPageLoading = ref(true);

/* =======================
   COLUMNS
======================= */
const allColumns = ref([
  { field: "livre", title: "Livre", sortable: true, visible: true },
  { field: "type", title: "Type", sortable: true, visible: true },
  { field: "quantite", title: "Quantité", sortable: true, visible: true },
  { field: "date", title: "Date / Heure", sortable: true, visible: true },
  { field: "actions", title: "Actions", sortable: false, visible: true },
]);

const columns = computed(() => allColumns.value.filter((c) => c.visible));

/* =======================
   DATA PROCESSING
======================= */
const rows = computed(() =>
  (stockStore.mouvements ?? []).map((m) => ({
    id: m.id,
    titre: m.livre?.titre ?? "—",
    image: m.livre ? livreStore.getCoverImage(m.livre) : "/images/livre.jpg",
    type: m.type === "entree" ? "Entrée" : "Sortie",
    quantite: m.quantite,
    date: new Date(m.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    heure: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    commentaire: m.commentaire,
  })),
);

const filteredRows = computed(() =>
  rows.value.filter((r) =>
    r.titre.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

/* =======================
   ACTIONS
======================= */
const selectedMouvement = ref<any>(null);
const showDetailModal = ref(false);

const openDetails = (row: any) => {
  selectedMouvement.value = row;
  showDetailModal.value = true;
};

const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  try {
    isPageLoading.value = true;
    await stockStore.fetchAllMouvements();
  } finally {
    isPageLoading.value = false;
  }
});
</script>

<style>
/* PREMIUM TABLE STYLES - STOCKS */
.premium-table {
  background-color: transparent !important;
  border: none !important;
}
.premium-table thead tr th {
  background-color: rgba(106, 13, 95, 0.05) !important;
  color: #9ca3af !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  font-size: 10px !important;
  letter-spacing: 0.1em !important;
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
  border: none !important;
}
.dark .premium-table thead tr th {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
.premium-table tbody tr {
  background-color: transparent !important;
  border-bottom: 1px solid rgba(229, 231, 235, 1) !important;
}
.dark .premium-table tbody tr {
  border-bottom-color: rgba(255, 255, 255, 0.05) !important;
}
.premium-table tbody tr td {
  padding-top: 1.25rem !important;
  padding-bottom: 1.25rem !important;
  font-size: 0.875rem !important;
  font-weight: 700 !important;
  color: #374151 !important;
}
.dark .premium-table tbody tr td {
  color: #d1d5db !important;
}
.premium-table .bh-pagination .bh-page-item.bh-active {
  background-color: #6a0d5f !important;
}
</style>
