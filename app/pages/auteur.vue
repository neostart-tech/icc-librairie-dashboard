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
            :loading="auteurStore.loading" skin="bh-table-hover bh-table-bordered" class="premium-table-v2">
            <template #actions="data">
              <div class="flex items-center gap-3">
                <button @click="openEditModal(data.value)"
                  class="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-500/5 transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      stroke-width="2" />
                  </svg>
                </button>
                <button @click="deleteAuteur(data.value)"
                  class="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-500/5 transition-all">
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

    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showModal"
        class="fixed inset-0 z-[110] flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm pt-10 overflow-y-auto"
        @click.self="showModal = false">
        <div
          class="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 my-8">
          <div class="p-8 bg-[#6a0d5f] relative overflow-hidden">
            <h3 class="text-2xl font-black text-white uppercase tracking-tighter relative z-10">
              {{ isEditing ? "Édition" : "Nouvel" }} <span class="text-orange-400">Auteur</span>
            </h3>
          </div>
          <div class="p-8 space-y-6">
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
            <div class="flex gap-4 pt-4">
              <button @click="showModal = false"
                class="flex-1 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-widest">Annuler</button>
              <button @click="saveAuteur"
                class="flex-[2] py-4 rounded-xl bg-[#6a0d5f] text-white font-black text-[10px] uppercase tracking-[0.2em]">Enregistrer</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
  font-weight: 700 !important;
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
  font-weight: 600 !important;
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
