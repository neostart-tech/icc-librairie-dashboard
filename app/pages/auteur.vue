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
    ]" title="Auteurs" description="Gérez la liste des auteurs et leurs bibliographies."
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
            :loading="auteurStore.loading" skin="bh-table-hover" class="premium-table">
            <template #actions="data">
              <div class="flex items-center gap-3">
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
      :title="isEditing ? 'Édition Auteur' : 'Nouvel Auteur'"
      description="Gérez les informations biographiques de l'auteur."
      icon='<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>'
      @close="showModal = false"
    >
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom complet</label>
          <input v-model="form.nom" type="text"
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-bold text-gray-700 dark:text-gray-200" />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Biographie</label>
          <textarea v-model="form.biographie" rows="4"
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-medium text-gray-700 dark:text-gray-200 resize-none"></textarea>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Bibliographie</label>
          <textarea v-model="form.bibliographie" rows="4"
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-medium text-gray-700 dark:text-gray-200 resize-none"></textarea>
        </div>
      </div>
      
      <template #footer>
        <button @click="showModal = false"
          class="px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-widest">
          Annuler
        </button>
        <button @click="saveAuteur"
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
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import Swal from "sweetalert2";

const auteurStore = useAuteurStore();
const search = ref("");
const showModal = ref(false);
const isEditing = ref(false);
const isPageLoading = ref(true);

const form = ref({ id: null as string | null, nom: "", biographie: "", bibliographie: "" });

const columns = [
  { field: "nom", title: "Nom", sortable: true },
  { field: "biographie", title: "Biographie", sortable: false },
  { field: "actions", title: "Actions", sortable: false },
];

const rows = computed(() => {
  return auteurStore.auteurs.filter(a => a.nom.toLowerCase().includes(search.value.toLowerCase()));
});

const openCreateModal = () => {
  isEditing.value = false;
  form.value = { id: null, nom: "", biographie: "", bibliographie: "" };
  showModal.value = true;
};

const openEditModal = (row: any) => {
  isEditing.value = true;
  form.value = { ...row };
  showModal.value = true;
};

const saveAuteur = async () => {
  try {
    if (isEditing.value && form.value.id) {
      await auteurStore.updateAuteur(form.value.id, form.value.nom, form.value.biographie, form.value.bibliographie);
    } else {
      await auteurStore.createAuteur(form.value.nom, form.value.biographie, form.value.bibliographie);
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
