<template>
  <div class="min-h-screen space-y-8 pb-12 relative">
    <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-700 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isPageLoading"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl">
        <div class="relative">
          <div class="w-24 h-24 rounded-full border-4 border-[#6a0d5f]/10 border-t-[#6a0d5f] animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <img src="/logo/logo_librairie(1).png" class="w-12 h-12 object-contain" alt="Logo" />
          </div>
        </div>
        <div class="mt-6 flex flex-col items-center">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Initialisation</span>
        </div>
      </div>
    </transition>

    <Breadcrumb :items="[
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Auteurs', to: '/auteur' },
    ]" title="Auteurs" description="Gérez la liste des auteurs et leurs informations biographiques."
      icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <div v-reveal="{ delay: 200 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden">
        
        <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex flex-1 items-center gap-4">
            <div class="relative flex-1 max-w-md group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6a0d5f] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input v-model="search" type="text" placeholder="Rechercher un auteur..."
                class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm text-gray-700 dark:text-gray-200" />
            </div>
          </div>

          <button @click="openCreateModal"
            class="px-6 py-3 bg-[#6a0d5f] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/20 hover:bg-[#8a1a7a] transition-all flex items-center gap-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </button>
        </div>

        <div class="relative overflow-hidden p-0">
          <Vue3Datatable :rows="rows" :columns="columns" :pagination="true" :page-size="10" :sortable="true"
            sortColumn="nom" sortDirection="asc"
            :loading="auteurStore.loading" skin="bh-table-hover" class="premium-table">
            <template #actions="data">
              <div class="flex items-center gap-3">
                <button @click="openShowModal(data.value)"
                  class="p-2 rounded-xl text-[#6a0d5f] bg-[#6a0d5f]/5 hover:bg-[#6a0d5f]/10 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button @click="openEditModal(data.value)"
                  class="p-2 rounded-xl text-blue-600 bg-blue-500/5 hover:bg-blue-500/10 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      stroke-width="2" />
                  </svg>
                </button>
                <button @click="deleteAuteur(data.value)"
                  class="p-2 rounded-xl text-rose-600 bg-rose-500/5 hover:bg-rose-500/10 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      stroke-width="2" />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
      </div>
    </div>

    <Modal
      :show="showModal"
      variant="primary"
      max-width="2xl"
      :title="isShowing ? 'Détails Auteur' : (isEditing ? 'Édition Auteur' : 'Nouvel Auteur')"
      description="Gérez les informations biographiques de l'auteur."
      :icon="isShowing ? '<svg class=\'w-5 h-5\' fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M15 12a3 3 0 11-6 0 3 3 0 016 0z\' /><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\' /></svg>' : '<svg class=\'w-5 h-5\' fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z\' /></svg>'"
      @close="showModal = false"
    >
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom complet</label>
          <input v-model="form.nom" type="text" :disabled="isShowing"
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-bold text-gray-700 dark:text-gray-200 disabled:opacity-70" />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Biographie</label>
          <textarea v-model="form.biographie" rows="4" :disabled="isShowing"
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-medium text-gray-700 dark:text-gray-200 resize-none disabled:opacity-70"></textarea>
        </div>

        <div v-if="isShowing" class="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
          <div class="flex items-center justify-between">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Ouvrages de l'auteur</label>
            <span class="text-[9px] font-black text-[#6a0d5f] bg-[#6a0d5f]/5 px-2 py-1 rounded-full uppercase tracking-widest">
              {{ authorBooks.length }} Livre(s)
            </span>
          </div>
          
          <div v-if="authorBooks.length > 0" class="relative group mt-2">
            <button @click="scrollCarousel('left')" 
              class="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 border border-gray-100 dark:border-white/10">
              <svg class="w-3 h-3 text-[#6a0d5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div ref="carouselRef" class="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-1">
              <div v-for="book in authorBooks" :key="book.id" class="flex-none w-28 space-y-3 group/book cursor-pointer">
                <div class="aspect-[3/4] rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm group-hover/book:shadow-md transition-all group-hover/book:-translate-y-1">
                  <img :src="livreStore.getCoverImage(book)" class="w-full h-full object-cover transition-transform duration-500 group-hover/book:scale-110" />
                </div>
                <p class="text-[10px] font-black text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight uppercase tracking-tighter text-center">
                  {{ book.titre }}
                </p>
              </div>
            </div>

            <button @click="scrollCarousel('right')" 
              class="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 border border-gray-100 dark:border-white/10">
              <svg class="w-3 h-3 text-[#6a0d5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div v-else class="p-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-center">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Aucun livre enregistré pour cet auteur</p>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button @click="showModal = false"
          class="px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-widest">
          {{ isShowing ? 'Fermer' : 'Annuler' }}
        </button>
        <button v-if="!isShowing" @click="saveAuteur"
          class="px-8 py-4 rounded-xl bg-[#6a0d5f] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/20">
          Enregistrer
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuteurStore } from "~~/stores/auteur";
import { useLivreStore } from "~~/stores/livre";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import Swal from "sweetalert2";

const auteurStore = useAuteurStore();
const livreStore = useLivreStore();
const search = ref("");
const showModal = ref(false);
const isEditing = ref(false);
const isShowing = ref(false);
const isPageLoading = ref(true);

const carouselRef = ref(null);
const authorBooks = ref([]);
const scrollCarousel = (direction: 'left' | 'right') => {
  if (carouselRef.value) {
    const scrollAmount = 240;
    carouselRef.value.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
  }
};

const form = ref({ id: null as string | null, nom: "", biographie: "" });

const columns = [
  { field: "nom", title: "Nom", sortable: true },
  { field: "biographie", title: "Biographie", sortable: false },
  { field: "actions", title: "Actions", sortable: false },
];

const rows = computed(() => {
  return auteurStore.auteurs
    .filter(a => a.nom.toLowerCase().includes(search.value.toLowerCase()))
    .sort((a, b) => a.nom.localeCompare(b.nom));
});

const openCreateModal = () => {
  isEditing.value = false;
  isShowing.value = false;
  form.value = { id: null, nom: "", biographie: "" };
  showModal.value = true;
};

const openEditModal = (row: any) => {
  isEditing.value = true;
  isShowing.value = false;
  form.value = { ...row };
  showModal.value = true;
};

const openShowModal = async (row: any) => {
  isEditing.value = false;
  isShowing.value = true;
  form.value = { ...row };
  showModal.value = true;

  if (livreStore.livres.length === 0) {
    await livreStore.fetchLivres();
  }
  authorBooks.value = livreStore.livres.filter(l => l.id_auteur === row.id);
};

const saveAuteur = async () => {
  try {
    if (isEditing.value && form.value.id) {
      await auteurStore.updateAuteur(form.value.id, form.value.nom, form.value.biographie, null);
    } else {
      await auteurStore.createAuteur(form.value.nom, form.value.biographie, null);
    }
    showModal.value = false;
  } catch (e) { }
};

const deleteAuteur = async (row: any) => {
  const result = await Swal.fire({
    title: "Supprimer ?",
    text: `Supprimer l'auteur "${row.nom}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a0d5f",
  });
  if (result.isConfirmed) await auteurStore.deleteAuteur(row.id);
};

onMounted(async () => {
  isPageLoading.value = true;
  await auteurStore.fetchAuteurs();
  isPageLoading.value = false;
});
</script>

<style scoped>
</style>
