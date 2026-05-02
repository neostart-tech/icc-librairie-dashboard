<template>
  <div class="min-h-screen space-y-8 pb-12 relative">
    <!-- Header Section -->
    <Breadcrumb
      :items="[
        { label: 'Tableau de bord', to: '/dashboard' },
        { label: 'Livres', to: '/livres' },
        { label: 'Mises en avant', to: null },
      ]"
      title="Mises en Avant"
      description="Gérez les sélections spéciales affichées sur la page d'accueil."
      :icon="StarIconPath"
    />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <div v-if="isPageLoading" class="flex items-center justify-center py-24">
         <div class="w-12 h-12 rounded-full border-4 border-[#6a0d5f]/10 border-t-[#6a0d5f] animate-spin"></div>
      </div>

      <div v-else class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <!-- SECTION 1: LIVRE DU MOIS (UN SEUL) -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-500 rounded-lg shadow-lg shadow-amber-500/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Livre <span class="text-amber-500">du Mois</span></h3>
            </div>
            <button @click="openModal('is_livre_du_mois')" class="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
            <div v-if="livreDuMois" class="w-full space-y-6">
               <div class="aspect-[3/4.5] w-full max-w-[240px] mx-auto relative group">
                  <div class="absolute inset-0 bg-amber-500 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
                  <img :src="livreStore.getCoverImage(livreDuMois)" class="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/20 relative z-10" />
                  <div class="absolute -top-4 -right-4 z-20">
                     <div class="bg-amber-500 text-white p-3 rounded-xl shadow-xl">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                     </div>
                  </div>
               </div>
               <div class="text-center space-y-2">
                  <h4 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter line-clamp-2">{{ livreDuMois.titre }}</h4>
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">{{ livreDuMois.auteurRel?.nom || livreDuMois.auteur || 'Auteur inconnu' }}</p>
                  <div class="pt-4 flex justify-center">
                     <button @click="toggleSelection(livreDuMois, 'is_livre_du_mois')" class="px-8 py-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                        Retirer de la sélection
                     </button>
                  </div>
               </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center text-center space-y-4 opacity-50">
               <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Aucun livre sélectionné</p>
            </div>
          </div>
        </div>

        <!-- SECTION 2: LIVRE DUO (UN SEUL) -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Livre <span class="text-blue-500">Duo</span></h3>
            </div>
            <button @click="openModal('is_livre_duo')" class="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
            <div v-if="livreDuo" class="w-full space-y-6">
               <div class="aspect-[3/4.5] w-full max-w-[240px] mx-auto relative group">
                  <div class="absolute inset-0 bg-blue-500 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
                  <img :src="livreStore.getCoverImage(livreDuo)" class="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/20 relative z-10" />
                  <div class="absolute -top-4 -right-4 z-20">
                     <div class="bg-blue-500 text-white p-3 rounded-xl shadow-xl">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                     </div>
                  </div>
               </div>
               <div class="text-center space-y-2">
                  <h4 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter line-clamp-2">{{ livreDuo.titre }}</h4>
                  <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">{{ livreDuo.auteurRel?.nom || livreDuo.auteur || 'Auteur inconnu' }}</p>
                  <div class="pt-4 flex justify-center">
                     <button @click="toggleSelection(livreDuo, 'is_livre_duo')" class="px-8 py-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                        Retirer de la sélection
                     </button>
                  </div>
               </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center text-center space-y-4 opacity-50">
               <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
               <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Aucun livre sélectionné</p>
            </div>
          </div>
        </div>

        <!-- SECTION 3: SELECTION DE L'ANNEE (PLUSIEURS) -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-[#6a0d5f] rounded-lg shadow-lg shadow-[#6a0d5f]/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Sélection <span class="text-[#6a0d5f]">de l'Année</span></h3>
            </div>
            <button @click="openModal('is_selection_annee')" class="p-2 bg-[#6a0d5f]/10 text-[#6a0d5f] hover:bg-[#6a0d5f]/20 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl p-6 min-h-[400px] flex flex-col relative">
            <div v-if="isReordering" class="absolute top-4 right-4 z-20">
               <div class="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 animate-pulse">
                  <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span class="text-[9px] font-black uppercase tracking-widest">Enregistrement...</span>
               </div>
            </div>

            <div v-if="selectionAnnee.length === 0" class="flex flex-col items-center justify-center flex-1 py-20 text-center space-y-4 opacity-50">
               <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Aucun livre sélectionné</p>
            </div>
            
            <draggable 
              v-model="selectionAnnee" 
              item-key="id"
              handle=".drag-handle"
              @end="onDragEnd"
              class="space-y-4"
              ghost-class="opacity-50"
              drag-class="scale-105"
            >
              <template #item="{ element: livre }">
                <div class="group relative bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                   <div class="flex gap-4">
                      <!-- Drag Handle -->
                      <div class="drag-handle flex items-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-[#6a0d5f] transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                        </svg>
                      </div>

                      <img :src="livreStore.getCoverImage(livre)" class="w-16 h-20 object-cover rounded-lg shadow-sm" />
                      <div class="flex-1 min-w-0">
                         <h4 class="font-black text-sm text-gray-900 dark:text-white truncate uppercase tracking-tight">{{ livre.titre }}</h4>
                         <p class="text-[10px] font-bold text-gray-400 uppercase mt-1">{{ livre.auteurRel?.nom || livre.auteur || 'Auteur inconnu' }}</p>
                         <p class="text-[10px] font-black text-[#6a0d5f] mt-2">{{ livre.prix.toLocaleString() }} FCFA</p>
                      </div>
                      <div class="flex flex-col items-end justify-center">
                        <button @click="toggleSelection(livre, 'is_selection_annee')" class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                        </button>
                      </div>
                   </div>
                </div>
              </template>
            </draggable>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal pour sélectionner un livre -->
    <Modal
      :show="isModalOpen"
      :title="modalTitle"
      maxWidth="3xl"
      @close="isModalOpen = false"
    >
      <div class="space-y-6">
        <!-- Barre de recherche -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] dark:focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Rechercher un livre par titre ou auteur..."
          >
        </div>

        <!-- Liste des livres -->
        <div class="max-h-[50vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          <div v-if="filteredLivres.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400 font-medium">
            Aucun livre trouvé.
          </div>
          
          <div 
            v-for="livre in filteredLivres" 
            :key="livre.id" 
            class="group flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#6a0d5f]/30 dark:hover:border-purple-500/30 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
            @click="handleModalSelection(livre)"
          >
            <div class="flex items-center gap-4">
              <img :src="livreStore.getCoverImage(livre)" class="w-12 h-16 object-cover rounded shadow-sm" />
              <div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-tight">{{ livre.titre }}</h4>
                <p class="text-xs font-semibold text-gray-400 uppercase mt-0.5">{{ livre.auteurRel?.nom || livre.auteur || 'Auteur inconnu' }}</p>
                <p class="text-xs font-black text-[#6a0d5f] dark:text-purple-400 mt-1">{{ livre.prix.toLocaleString() }} FCFA</p>
              </div>
            </div>
            
            <div class="flex-shrink-0 ml-4">
              <div 
                class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors"
                :class="isLivreSelected(livre) ? 'bg-[#6a0d5f] border-[#6a0d5f] dark:bg-purple-500 dark:border-purple-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-[#6a0d5f] dark:group-hover:border-purple-500'"
              >
                <svg v-if="isLivreSelected(livre)" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button 
          @click="isModalOpen = false" 
          class="px-5 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
          :disabled="isSaving"
        >
          Annuler
        </button>
        <button 
          @click="saveModalSelection" 
          class="px-5 py-2.5 bg-[#6a0d5f] text-white hover:bg-[#5a0b50] dark:bg-purple-600 dark:hover:bg-purple-700 rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
          :disabled="isSaving"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-else>Enregistrer</span>
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import draggable from 'vuedraggable';
import Breadcrumb from "~/components/Breadcrumb.vue";
import Modal from "~/components/Modal.vue";
import { useLivreStore } from "~~/stores/livre";
import { useToast } from "#imports";

const StarIconPath = "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";

const livreStore = useLivreStore();
const toast = useToast();

const isPageLoading = ref(true);
const isReordering = ref(false);
const selectionAnnee = ref<any[]>([]);
const livreDuMois = ref<any>(null);
const livreDuo = ref<any>(null);

const isModalOpen = ref(false);
const isSaving = ref(false);
const modalType = ref<'is_selection_annee' | 'is_livre_du_mois' | 'is_livre_duo'>('is_selection_annee');
const searchQuery = ref('');
const localSelectedIds = ref<string[]>([]);

const modalTitle = computed(() => {
  if (modalType.value === 'is_selection_annee') return 'Sélection de l\'Année';
  if (modalType.value === 'is_livre_du_mois') return 'Livre du Mois';
  if (modalType.value === 'is_livre_duo') return 'Livre Duo';
  return 'Sélection';
});

const openModal = (type: 'is_selection_annee' | 'is_livre_du_mois' | 'is_livre_duo') => {
  modalType.value = type;
  searchQuery.value = '';
  
  // Initialize local selection state
  if (type === 'is_selection_annee') {
    localSelectedIds.value = selectionAnnee.value.map(l => l.id);
  } else if (type === 'is_livre_du_mois') {
    localSelectedIds.value = livreDuMois.value ? [livreDuMois.value.id] : [];
  } else if (type === 'is_livre_duo') {
    localSelectedIds.value = livreDuo.value ? [livreDuo.value.id] : [];
  }

  isModalOpen.value = true;
};

const filteredLivres = computed(() => {
  if (!searchQuery.value) return livreStore.livres;
  const q = searchQuery.value.toLowerCase();
  return livreStore.livres.filter(l => 
    l.titre.toLowerCase().includes(q) || 
    (l.auteurRel?.nom || l.auteur || '').toLowerCase().includes(q)
  );
});

const isLivreSelected = (livre: any) => {
  return localSelectedIds.value.includes(livre.id);
};

const handleModalSelection = (livre: any) => {
  if (modalType.value === 'is_livre_du_mois' || modalType.value === 'is_livre_duo') {
    // Toggle for singular (max 1)
    if (localSelectedIds.value.includes(livre.id)) {
      localSelectedIds.value = [];
    } else {
      localSelectedIds.value = [livre.id];
    }
  } else {
    // Toggle for lists
    const index = localSelectedIds.value.indexOf(livre.id);
    if (index > -1) {
      localSelectedIds.value.splice(index, 1);
    } else {
      localSelectedIds.value.push(livre.id);
    }
  }
};

const saveModalSelection = async () => {
  isSaving.value = true;
  try {
    let originalIds: string[] = [];
    if (modalType.value === 'is_selection_annee') {
      originalIds = selectionAnnee.value.map(l => l.id);
    } else if (modalType.value === 'is_livre_du_mois') {
      originalIds = livreDuMois.value ? [livreDuMois.value.id] : [];
    } else if (modalType.value === 'is_livre_duo') {
      originalIds = livreDuo.value ? [livreDuo.value.id] : [];
    }

    const addedIds = localSelectedIds.value.filter(id => !originalIds.includes(id));
    const removedIds = originalIds.filter(id => !localSelectedIds.value.includes(id));

    if (modalType.value === 'is_livre_du_mois' || modalType.value === 'is_livre_duo') {
       if (removedIds.length > 0) {
          await livreStore.updateLivre(removedIds[0], { [modalType.value]: false });
       }
       if (addedIds.length > 0) {
          await livreStore.updateLivre(addedIds[0], { [modalType.value]: true });
       }
    } else {
       const updatePromises = [];
       for (const id of removedIds) {
          updatePromises.push(livreStore.updateLivre(id, { [modalType.value]: false }));
       }
        const maxOrder = selectionAnnee.value.length > 0 
          ? Math.max(...selectionAnnee.value.map(l => l.featured_order || 0)) 
          : 0;
        
        let currentMax = maxOrder;
        for (const id of addedIds) {
           currentMax++;
           updatePromises.push(livreStore.updateLivre(id, { 
             [modalType.value]: true,
             featured_order: currentMax
           }));
        }
        await Promise.all(updatePromises);
    }

    toast.success({ message: "Modifications enregistrées" });
    await loadFeatured();
    isModalOpen.value = false;
  } catch (error) {
    toast.error({ message: "Erreur lors de l'enregistrement" });
  } finally {
    isSaving.value = false;
  }
};

const loadFeatured = async () => {
    try {
        const data = await livreStore.fetchFeatured();
        if (data) {
            selectionAnnee.value = data.selection_annee || [];
            livreDuMois.value = data.livre_du_mois || null;
            livreDuo.value = data.livre_duo || null;
        }
    } catch (error) {
        toast.error({ message: "Erreur lors du chargement des sélections." });
    }
}

const toggleSelection = async (livre: any, field: string) => {
    try {
        const payload = {
            [field]: false
        };
        await livreStore.updateLivre(livre.id, payload);
        toast.success({ message: "Modification enregistrée" });
        await loadFeatured();
    } catch (error) {
        toast.error({ message: "Erreur lors de la modification" });
    }
}

const onDragEnd = async () => {
    try {
        isReordering.value = true;
        // Map current positions to order values (starting from 1)
        const orders = selectionAnnee.value.map((livre, index) => ({
            id: livre.id,
            featured_order: index + 1
        }));

        await livreStore.reorderFeatured(orders);
        toast.success({ message: "Ordre mis à jour" });
        // Don't reload everything to keep the UI smooth, 
        // just update local values if needed (they are already in order)
        selectionAnnee.value.forEach((livre, index) => {
            livre.featured_order = index + 1;
        });
    } catch (error) {
        toast.error({ message: "Erreur lors du réordonnancement" });
        await loadFeatured(); // Rollback if error
    } finally {
        isReordering.value = false;
    }
}

onMounted(async () => {
    try {
        isPageLoading.value = true;
        await Promise.all([
          loadFeatured(),
          livreStore.fetchLivres()
        ]);
    } finally {
        isPageLoading.value = false;
    }
});
</script>
