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
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Chargement des avis</span>
        </div>
      </div>
    </transition>

    <!-- Header Section -->
    <Breadcrumb
      :items="[
        { label: 'Tableau de bord', to: '/dashboard' },
        { label: 'Avis & Commentaires', to: '/avis' },
      ]"
      title="Avis Clients"
      description="Modérez les notes et commentaires laissés par les utilisateurs sur les ouvrages."
      icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total des avis</p>
          <p class="text-3xl font-black text-gray-900 dark:text-white">{{ rows.length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Livres notés</p>
          <p class="text-3xl font-black text-[#6a0d5f]">{{ ratedBooksCount }}</p>
        </div>
        <div class="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Commentaires</p>
          <p class="text-3xl font-black text-orange-500">{{ commentsCount }}</p>
        </div>
      </div>

      <!-- Main Content Container -->
      <div 
        v-reveal="{ delay: 200 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <!-- Toolbar -->
        <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                placeholder="Rechercher par livre ou utilisateur..."
                class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
        </div>

        <!-- Table Content -->
        <div class="relative overflow-hidden p-0">
          <Vue3Datatable
            :rows="filteredRows"
            :columns="columns"
            :pagination="true"
            :page-size="20"
            :sortable="true"
            :loading="livreStore.loading"
            skin="bh-table-hover bh-table-bordered"
            class="premium-table"
          >
            <template #user="data">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-[#6a0d5f]/10 flex items-center justify-center text-[#6a0d5f] font-bold text-xs">
                  {{ data.value.user?.prenom?.charAt(0) || 'U' }}
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-900 dark:text-white">{{ data.value.user?.prenom }} {{ data.value.user?.nom }}</p>
                  <p class="text-[10px] text-gray-400">{{ data.value.user?.email }}</p>
                </div>
              </div>
            </template>

            <template #livre="data">
              <div class="flex items-center gap-3 max-w-[250px]">
                <img :src="livreStore.getCoverImage(data.value.livre)" class="w-8 h-10 object-cover rounded shadow-sm shrink-0" />
                <div class="flex flex-col min-w-0">
                  <span class="text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-1">{{ data.value.livre?.titre }}</span>
                  <div class="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                    <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Moyenne: {{ booksAverageRatings[data.value.livre?.id] || '0.0' }}/5</span>
                  </div>
                </div>
              </div>
            </template>

            <template #note="data">
              <div class="flex items-center gap-1 text-amber-400">
                <template v-for="i in 5" :key="i">
                  <svg class="w-3 h-3" :class="i <= data.value.note ? 'fill-current' : 'fill-gray-200'" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </template>
                <span class="ml-1 text-[10px] font-black text-gray-400">{{ data.value.note }}/5</span>
              </div>
            </template>

            <template #commentaire="data">
              <div class="max-w-[400px]">
                <p v-if="data.value.commentaire" class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {{ data.value.commentaire }}
                </p>
                <span v-else class="text-[10px] italic text-gray-300">Aucun commentaire</span>
              </div>
            </template>

            <template #created_at="data">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {{ formatDate(data.value.created_at) }}
              </span>
            </template>

            <template #actions="data">
              <div class="flex items-center gap-3">
                <button
                  @click="openShowModal(data.value)"
                  class="p-2 rounded-xl text-[#6a0d5f] bg-[#6a0d5f]/5 hover:bg-[#6a0d5f]/10 transition-all"
                  title="Voir les détails"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="deleteAvis(data.value)"
                  class="p-2 rounded-xl text-rose-600 bg-rose-500/5 hover:bg-rose-500/10 transition-all"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <Modal
      :show="showModal"
      variant="primary"
      max-width="lg"
      title="Détails de l'avis"
      description="Consultez l'intégralité du commentaire et les informations de l'utilisateur."
      icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      @close="showModal = false"
    >
      <div v-if="selectedAvis" class="space-y-8">
        <!-- Book Header Card -->
        <div class="flex items-start gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
          <div class="relative group shrink-0">
            <img 
              :src="livreStore.getCoverImage(selectedAvis.livre)" 
              class="w-24 h-36 object-cover rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-105" 
            />
            <div class="absolute inset-0 rounded-xl shadow-inner pointer-events-none"></div>
          </div>
          
          <div class="flex-1 min-w-0 py-1 flex flex-col justify-between h-36">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded-md bg-[#6a0d5f]/10 text-[#6a0d5f] text-[8px] font-black uppercase tracking-widest">
                  {{ selectedAvis.livre?.categorie?.nom || 'Librairie' }}
                </span>
              </div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white leading-tight mb-0.5 line-clamp-2">
                {{ selectedAvis.livre?.titre }}
              </h3>
              <p class="text-xs text-gray-500 font-medium italic mb-2">{{ selectedAvis.livre?.auteur || 'Auteur non spécifié' }}</p>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="flex flex-col">
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Moyenne Ouvrage</span>
                <div class="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 w-fit">
                  <span class="text-sm font-black">{{ booksAverageRatings[selectedAvis.livre?.id] || '0.0' }} / 5</span>
                </div>
              </div>
              <div class="flex flex-col border-l border-gray-100 dark:border-white/10 pl-4">
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Avis</span>
                <span class="text-sm font-black text-gray-700 dark:text-gray-300">
                  {{ getBookReviewsCount(selectedAvis.livre?.id) }} avis
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Review Body -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6a0d5f] to-[#9d178c] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-[#6a0d5f]/20">
                {{ selectedAvis.user?.prenom?.charAt(0) || 'U' }}
              </div>
              <div>
                <p class="text-base font-black text-gray-900 dark:text-white leading-none mb-1">{{ selectedAvis.user?.prenom }} {{ selectedAvis.user?.nom }}</p>
                <div class="flex flex-col">
                   <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em]">{{ formatDate(selectedAvis.created_at) }}</p>
                   <p class="text-[10px] text-[#6a0d5f] font-bold lowercase opacity-60">{{ selectedAvis.user?.email }}</p>
                </div>
              </div>
            </div>
            
            <div class="text-right">
              <div class="flex items-center justify-end gap-1 text-amber-400 mb-0.5">
                <template v-for="i in 5" :key="i">
                  <svg class="w-5 h-5" :class="i <= selectedAvis.note ? 'fill-current' : 'fill-gray-200'" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </template>
              </div>
              <div class="flex flex-col items-end">
                <p class="text-[10px] font-black text-[#6a0d5f] uppercase tracking-[0.15em] leading-none mb-1">Note du lecteur</p>
                <span 
                  class="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border"
                  :class="getRatingBadgeClass(selectedAvis.note)"
                >
                  {{ getRatingLabel(selectedAvis.note) }}
                </span>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="absolute -left-2 -top-4 text-7xl text-[#6a0d5f]/5 font-serif pointer-events-none select-none">“</div>
            <div class="relative p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-inner-lg min-h-[120px] flex items-center">
              <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed italic font-medium w-full text-center">
                {{ selectedAvis.commentaire ? `"${selectedAvis.commentaire}"` : 'L\'utilisateur n\'a pas laissé de commentaire écrit, seulement une note.' }}
              </p>
            </div>
            <div class="absolute -right-2 -bottom-8 text-7xl text-[#6a0d5f]/5 font-serif pointer-events-none select-none">”</div>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          @click="showModal = false"
          class="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Fermer
        </button>
        <button
          @click="deleteAvis(selectedAvis)"
          class="px-8 py-3 rounded-xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          Supprimer l'avis
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useLivreStore } from "~~/stores/livre";
import Swal from "sweetalert2";
import { useToast } from "#imports";

/* =======================
   STORE
======================= */
const livreStore = useLivreStore();

/* =======================
   UI STATE
======================= */
const search = ref("");
const showModal = ref(false);
const selectedAvis = ref<any>(null);
const isPageLoading = ref(true);
const rows = ref<any[]>([]);

/* =======================
   TABLE CONFIG
======================= */
const columns = ref([
  { field: "created_at", title: "Date", sortable: true },
  { field: "user", title: "Utilisateur", sortable: false },
  { field: "livre", title: "Livre", sortable: false },
  { field: "note", title: "Note", sortable: true },
  { field: "commentaire", title: "Commentaire", sortable: false },
  { field: "actions", title: "Actions", sortable: false },
]);

/* =======================
   DATA PROCESSING
======================= */
const filteredRows = computed(() => {
  if (!search.value) return rows.value;
  const q = search.value.toLowerCase();
  return rows.value.filter((r) => 
    r.livre?.titre?.toLowerCase().includes(q) || 
    r.user?.prenom?.toLowerCase().includes(q) || 
    r.user?.nom?.toLowerCase().includes(q) ||
    r.user?.email?.toLowerCase().includes(q)
  );
});

const booksAverageRatings = computed(() => {
  const map = new Map();
  rows.value.forEach((r) => {
    if (!r.livre?.id) return;
    if (!map.has(r.livre.id)) {
      map.set(r.livre.id, { sum: 0, count: 0 });
    }
    const data = map.get(r.livre.id);
    data.sum += r.note;
    data.count += 1;
  });

  const ratings: Record<string, string> = {};
  map.forEach((val, key) => {
    ratings[key] = (val.sum / val.count).toFixed(1);
  });
  return ratings;
});

const ratedBooksCount = computed(() => {
  return new Set(rows.value.map((r) => r.livre?.id).filter(Boolean)).size;
});

const getBookReviewsCount = (bookId: string) => {
  if (!bookId) return 0;
  return rows.value.filter((r) => r.livre?.id === bookId).length;
};

const getRatingLabel = (note: number) => {
  if (note >= 5) return "Excellent";
  if (note >= 4) return "Très bon";
  if (note >= 3) return "Satisfaisant";
  if (note >= 2) return "Moyen";
  return "Décevant";
};

const getRatingBadgeClass = (note: number) => {
  if (note >= 4) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (note >= 3) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
};

const commentsCount = computed(() => {
  return rows.value.filter(r => r.commentaire).length;
});

/* =======================
   ACTIONS
======================= */
const fetchAvis = async () => {
  rows.value = await livreStore.fetchAllNotes();
};

const openShowModal = (row: any) => {
  selectedAvis.value = row;
  showModal.value = true;
};

const deleteAvis = async (row: any) => {
  const result = await Swal.fire({
    title: "Modération",
    text: `Voulez-vous vraiment supprimer cet avis ? Cette action est irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48",
    cancelButtonColor: "#9ca3af",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    customClass: {
      popup: 'rounded-2xl border-none shadow-2xl bg-white dark:bg-gray-900',
      title: 'font-black uppercase tracking-tighter text-gray-800 dark:text-white',
      confirmButton: 'rounded-xl font-bold uppercase tracking-widest',
      cancelButton: 'rounded-xl font-bold uppercase tracking-widest'
    }
  });

  if (!result.isConfirmed) return;

  try {
    await livreStore.deleteNote(row.id);
    showModal.value = false;
    await fetchAvis();
    useToast().success({ message: "Avis supprimé avec succès" });
  } catch (e) {
    useToast().error({ message: "Erreur lors de la suppression" });
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  try {
    isPageLoading.value = true;
    await fetchAvis();
  } finally {
    isPageLoading.value = false;
  }
});
</script>
