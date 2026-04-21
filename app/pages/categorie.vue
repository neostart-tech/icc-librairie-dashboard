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
          <!-- Outer Rotating Ring -->
          <div class="w-24 h-24 rounded-full border-4 border-[#6a0d5f]/10 border-t-[#6a0d5f] animate-spin"></div>
          <!-- Inner Logo (fixed) -->
          <div class="absolute inset-0 flex items-center justify-center">
            <img src="/logo/logo_librairie(1).png" class="w-12 h-12 object-contain" alt="Logo" />
          </div>
        </div>
        <div class="mt-6 flex flex-col items-center">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Initialisation</span>
          <div class="flex gap-1 mt-2">
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.3s"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Header Section -->
    <Breadcrumb
      :items="[
        { label: 'Tableau de bord', to: '/dashboard' },
        { label: 'Catégories', to: '/categorie' },
      ]"
      title="Catégories"
      description="Gérez les thématiques et l'organisation de votre catalogue."
      :icon="CategoryIconPath"
    />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <!-- Unified List Container -->
      <div 
        v-reveal="{ delay: 200 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <!-- Integrated Toolbar -->
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
                placeholder="Rechercher une catégorie..."
                class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm text-gray-700 dark:text-gray-200"
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
                <div v-if="isDropdownOpen" class="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <div class="p-2 space-y-1">
                    <label v-for="col in visibleColumns" :key="col.field" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-[#6a0d5f]/5 dark:hover:bg-[#6a0d5f]/10 rounded-xl cursor-pointer transition-colors group">
                      <input type="checkbox" v-model="col.visible" class="w-4 h-4 rounded border-gray-300 text-[#6a0d5f] focus:ring-[#6a0d5f]" />
                      <span class="font-bold uppercase text-[10px] tracking-widest">{{ col.title }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>

            <button
              @click="openCreateModal"
              class="px-6 py-3 bg-[#6a0d5f] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/20 hover:bg-[#8a1a7a] transition-all flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter
            </button>
          </div>
        </div>

        <!-- Table Content -->
        <div class="relative overflow-hidden p-0">
          <Vue3Datatable
            :rows="rows"
            :columns="columns"
            :pagination="true"
            :page-size="10"
            :sortable="true"
            :loading="categorieStore.loading"
            skin="bh-table-hover bh-table-bordered"
            class="premium-table"
          >
            <template #actions="data">
              <div class="flex items-center gap-3">
                <button
                  @click="openEditModal(data.value)"
                  class="p-2 rounded-xl text-blue-600 bg-blue-500/5 hover:bg-blue-500/10 transition-all"
                  title="Modifier"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  @click="deleteCategorie(data.value)"
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

    <!-- Premium Modal -->
    <Modal
      :show="showModal"
      variant="primary"
      max-width="lg"
      :title="isEditing ? 'Édition Catégorie' : 'Nouvelle Catégorie'"
      :description="isEditing ? 'Modifier les informations de la catégorie' : 'Définissez une nouvelle thématique pour vos livres'"
      icon='<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>'
      @close="showModal = false"
    >
      <div class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom de la catégorie</label>
          <input
            v-model="form.libelle"
            type="text"
            placeholder="Ex: Théologie, Jeunesse..."
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-bold text-gray-700 dark:text-gray-200"
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Décrivez brièvement cette catégorie..."
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-medium text-gray-700 dark:text-gray-200 resize-none"
          />
        </div>
      </div>

      <template #footer>
        <button
          @click="showModal = false"
          class="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="saveCategorie"
          class="px-8 py-3 rounded-xl bg-[#6a0d5f] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/30 hover:scale-105 active:scale-95 transition-all"
        >
          {{ isEditing ? "Mettre à jour" : "Enregistrer" }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useCategorieStore } from "~~/stores/categorie";
import Swal from "sweetalert2";
import { useToast } from "#imports";

/* =======================
   RESOURCES
======================= */
const CategoryIconPath = "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z";

/* =======================
   STORE
======================= */
const categorieStore = useCategorieStore();

/* =======================
   UI STATE
======================= */
const search = ref("");
const showModal = ref(false);
const isEditing = ref(false);
const isDropdownOpen = ref(false);
const isPageLoading = ref(true);

/* =======================
   FORM
======================= */
const form = ref({
  id: null as number | null,
  libelle: "",
  description: null as string | null,
});

/* =======================
   TABLE CONFIG
======================= */
const visibleColumns = ref([
  { field: "libelle", title: "Libellé", sortable: true, visible: true },
  { field: "description", title: "Description", sortable: false, visible: true },
  { field: "actions", title: "Actions", sortable: false, visible: true },
]);

const columns = computed(() => visibleColumns.value.filter((c) => c.visible));

/* =======================
   DATA PROCESSING
======================= */
const rows = computed(() => {
  const data = categorieStore.categories;
  return data
    .map((c) => ({
      ...c,
      description: c.description || "—",
    }))
    .filter((c) =>
      c.libelle.toLowerCase().includes(search.value.toLowerCase()),
    );
});

/* =======================
   ACTIONS
======================= */
const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
const closeDropdown = () => (isDropdownOpen.value = false);

const openCreateModal = () => {
  isEditing.value = false;
  form.value = { id: null, libelle: "", description: null };
  showModal.value = true;
};

const openEditModal = (row: any) => {
  isEditing.value = true;
  form.value = {
    id: row.id,
    libelle: row.libelle,
    description: row.description === "—" ? null : row.description,
  };
  showModal.value = true;
};

const saveCategorie = async () => {
  const toast = useToast();
  try {
    if (isEditing.value && form.value.id) {
      await categorieStore.updateCategorie(form.value.id, form.value.libelle, form.value.description);
      toast.success({ message: "Catégorie modifiée avec succès" });
    } else {
      await categorieStore.createCategorie(form.value.libelle, form.value.description);
      toast.success({ message: "Catégorie ajoutée avec succès" });
    }
    showModal.value = false;
  } catch (e: any) {
    toast.error({ message: e?.message || "Erreur lors de l'enregistrement" });
  }
};

const deleteCategorie = async (row: any) => {
  const result = await Swal.fire({
    title: "Êtes-vous sûr ?",
    text: `Vous allez supprimer la catégorie "${row.libelle}". Cette action est irréversible.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a0d5f",
    cancelButtonColor: "#f43f5e",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    customClass: {
      popup: 'rounded-xl border-none shadow-2xl bg-white dark:bg-gray-900',
      title: 'font-black uppercase tracking-tighter text-gray-800 dark:text-white',
      confirmButton: 'rounded-xl font-bold uppercase tracking-widest',
      cancelButton: 'rounded-xl font-bold uppercase tracking-widest'
    }
  });

  if (!result.isConfirmed) return;

  try {
    await categorieStore.deleteCategorie(row.id);
    useToast().success({ message: "Catégorie supprimée avec succès" });
  } catch (e) {
    useToast().error({ message: "Erreur lors de la suppression" });
  }
};

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  try {
    isPageLoading.value = true;
    await categorieStore.fetchCategories();
    window.addEventListener("click", (e: any) => {
      if (!e.target.closest(".relative")) closeDropdown();
    });
  } finally {
    isPageLoading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("click", closeDropdown);
});
</script>

<style scoped>
</style>
