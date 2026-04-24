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

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <!-- Unified List Container -->
      <div 
        v-reveal="{ delay: 200 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <!-- Integrated Toolbar -->
        <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col xl:flex-row xl:items-center justify-between gap-6">
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
                class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
              />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative">
              <button
                @click="toggleDropdown"
                class="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#6a0d5f] transition-all text-gray-600 dark:text-gray-300"
                title="Configurer les colonnes"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
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
              class="px-6 py-3 bg-[#6a0d5f] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/20 hover:bg-[#8a1a7a] transition-all flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
              Nouveau Flux
            </NuxtLink>
          </div>
        </div>

        <div class="relative overflow-hidden p-0">
          <Vue3Datatable
            :rows="filteredRows"
            :columns="columns"
            :pagination="true"
            :page-size="10"
            :sortable="true"
            sortColumn="created_at"
            sortDirection="desc"
            skin="bh-table-hover bh-table-bordered"
            class="premium-table-v2"
          >
            <template #livre="data">
              <div class="flex items-center gap-4 py-1">
                <img 
                  :src="data.value.image" 
                  class="w-10 h-14 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-white/10" 
                />
                <span class="font-bold text-gray-900 dark:text-white uppercase tracking-tighter text-sm">
                  {{ data.value.titre }}
                </span>
              </div>
            </template>

            <template #type="data">
              <div class="flex items-center gap-2">
                <div v-if="data.value.type === 'Entrée'" class="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span class="text-[10px] font-bold uppercase tracking-widest">Entrée</span>
                </div>
                <div v-else class="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full border border-rose-500/20">
                  <div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                  <span class="text-[10px] font-bold uppercase tracking-widest">Sortie</span>
                </div>
              </div>
            </template>

            <template #quantite="data">
              <span :class="[ 'text-lg font-black tracking-tighter', data.value.type === 'Entrée' ? 'text-emerald-600' : 'text-rose-600' ]">
                {{ data.value.type === 'Entrée' ? '+' : '-' }}{{ data.value.quantite }}
              </span>
            </template>

            <template #created_at="data">
              <div class="flex flex-col">
                <span class="text-[11px] font-bold uppercase tracking-widest text-[#6a0d5f]">{{ data.value.date }}</span>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ data.value.heure }}</span>
              </div>
            </template>

            <template #actions="data">
              <button
                @click="openDetails(data.value)"
                class="p-2.5 rounded-xl text-[#6a0d5f] bg-[#6a0d5f]/5 hover:bg-[#6a0d5f]/10 transition-all group"
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
    </div>

    <!-- Details Modal -->
    <Modal
      :show="showDetailModal"
      :variant="selectedMouvement?.type === 'Entrée' ? 'success' : 'danger'"
      max-width="2xl"
      title="Flux de Stock"
      :description="`Mouvement #${selectedMouvement?.id?.split('-')[0]}`"
      @close="showDetailModal = false"
    >
      <div v-if="selectedMouvement" class="flex flex-col md:flex-row gap-8">
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
          <div class="space-y-2 text-left">
            <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Notes de mouvement</p>
            <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 min-h-[100px]">
              <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
                {{ selectedMouvement.commentaire || "Aucun commentaire n'a été saisi pour ce mouvement de stock." }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button @click="showDetailModal = false" class="px-8 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[10px] uppercase tracking-widest transition-all">
          Fermer
        </button>
      </template>
    </Modal>
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
  { field: "created_at", title: "Date / Heure", sortable: true, visible: true },
  { field: "actions", title: "Actions", sortable: false, visible: true },
]);

const columns = computed(() => allColumns.value.filter((c) => c.visible));

/* =======================
   DATA PROCESSING
======================= */
const rows = computed(() =>
  (stockStore.mouvements ?? [])
    .map((m) => ({
      id: m.id,
      titre: m.livre?.titre ?? "—",
      image: m.livre ? livreStore.getCoverImage(m.livre) : "/images/livre.jpg",
      type: m.type === "entree" ? "Entrée" : "Sortie",
      quantite: m.quantite,
      date: new Date(m.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      heure: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      commentaire: m.commentaire,
      created_at: m.created_at,
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
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
/* PREMIUM TABLE V2 */
.premium-table-v2 {
  background-color: transparent !important;
  border: none !important;
}

/* Headers */
.premium-table-v2 thead tr th {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
  font-size: 10px !important;
  letter-spacing: 0.1em !important;
  padding: 1.25rem 1.5rem !important;
  border-bottom: 2px solid #f1f5f9 !important;
}
.dark .premium-table-v2 thead tr th {
  background-color: rgba(255, 255, 255, 0.02) !important;
  color: #94a3b8 !important;
  border-bottom-color: rgba(255, 255, 255, 0.05) !important;
}

/* Rows */
.premium-table-v2 tbody tr {
  background-color: transparent !important;
  border-bottom: 1px solid #f1f5f9 !important;
  transition: all 0.2s;
}
.dark .premium-table-v2 tbody tr {
  border-bottom-color: rgba(255, 255, 255, 0.05) !important;
}
.premium-table-v2 tbody tr:hover {
  background-color: rgba(106, 13, 95, 0.01) !important;
}
.dark .premium-table-v2 tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.01) !important;
}

/* Cells */
.premium-table-v2 tbody tr td {
  padding: 1rem 1.5rem !important;
  font-size: 0.875rem !important;
  color: #334155 !important;
  vertical-align: middle !important;
}
.dark .premium-table-v2 tbody tr td {
  color: #cbd5e1 !important;
}

/* Sorting Icons */
.premium-table-v2 .bh-sort-icon {
  width: 14px !important;
  height: 14px !important;
  margin-left: 6px !important;
  color: #cbd5e1 !important;
}

/* Pagination */
.premium-table-v2 .bh-pagination {
  padding: 1.5rem !important;
  border-top: 1px solid #f1f5f9 !important;
}
.dark .premium-table-v2 .bh-pagination {
  border-top-color: rgba(255, 255, 255, 0.05) !important;
}

.premium-table-v2 .bh-pagination .bh-page-item {
  border-radius: 8px !important;
  border: 1px solid #e2e8f0 !important;
  background-color: #fff !important;
  color: #64748b !important;
  width: 32px !important;
  height: 32px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 2px !important;
  transition: all 0.2s !important;
}
.dark .premium-table-v2 .bh-pagination .bh-page-item {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #94a3b8 !important;
}

.premium-table-v2 .bh-pagination .bh-page-item.bh-active {
  background-color: #6a0d5f !important;
  border-color: #6a0d5f !important;
  color: #fff !important;
}

.premium-table-v2 .bh-pagination .bh-page-item:hover:not(.bh-active) {
  border-color: #6a0d5f !important;
  color: #6a0d5f !important;
}
</style>
