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
      { label: 'Bannières', to: '/banniere' },
    ]" title="Bannières" description="Gérez les images qui défilent sur la page d'accueil."
      icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <div
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden">
        
        <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex flex-1 items-center gap-4">
            <h2 class="text-lg font-black text-[#6a0d5f] uppercase tracking-tighter">Liste des bannières</h2>
          </div>

          <button @click="openCreateModal"
            class="px-6 py-3 bg-[#6a0d5f] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/20 hover:bg-[#8a1a7a] transition-all flex items-center gap-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter une bannière
          </button>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="banner in bannerStore.banners" :key="banner.id" 
            class="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 transition-all hover:shadow-2xl hover:shadow-[#6a0d5f]/10">
            
            <div class="aspect-[16/9] overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img :src="banner.image_url" :alt="banner.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>

            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f] bg-[#6a0d5f]/5 px-3 py-1 rounded-full">
                  Ordre: {{ banner.order }}
                </span>
                <span :class="[
                  'text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full',
                  banner.is_active ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'
                ]">
                  {{ banner.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </div>
              <h3 class="font-bold text-gray-700 dark:text-gray-200 truncate">{{ banner.title || 'Sans titre' }}</h3>
              
              <div class="flex gap-2 pt-2">
                <button @click="openEditModal(banner)"
                  class="flex-1 py-2.5 rounded-xl bg-blue-500/5 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500/10 transition-colors">
                  Modifier
                </button>
                <button @click="deleteBanner(banner)"
                  class="flex-1 py-2.5 rounded-xl bg-rose-500/5 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <div v-if="bannerStore.banners.length === 0" class="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <svg class="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm font-bold uppercase tracking-widest">Aucune bannière trouvée</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Creation/Edition -->
    <Modal
      :show="showModal"
      variant="primary"
      max-width="2xl"
      :title="isEditing ? 'Édition Bannière' : 'Nouvelle Bannière'"
      description="Gérez le visuel principal de votre plateforme."
      icon='<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
      @close="showModal = false"
    >
      <form @submit.prevent="saveBanner" id="banner-form" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Image (16:9 recommandé)</label>
          <div class="relative group">
            <input type="file" @change="handleFileChange" accept="image/*" :required="!isEditing"
              class="hidden" id="banner-image" />
            <label for="banner-image" class="cursor-pointer block w-full aspect-[16/9] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-[#6a0d5f] transition-all overflow-hidden text-left">
              <div v-if="previewUrl" class="w-full h-full relative">
                <img :src="previewUrl" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="text-white font-bold text-xs uppercase tracking-widest">Changer l'image</span>
                </div>
              </div>
              <div v-else class="w-full h-full flex flex-col items-center justify-center space-y-3">
                <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-4">Cliquez pour choisir une image</span>
              </div>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Titre (optionnel)</label>
            <input v-model="form.title" type="text"
              class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-bold text-gray-700 dark:text-gray-200" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Ordre d'affichage</label>
            <input v-model.number="form.order" type="number"
              class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-bold text-gray-700 dark:text-gray-200" />
          </div>
        </div>

        <div class="flex items-center gap-3 ml-1">
          <input v-model="form.is_active" type="checkbox" id="is_active"
            class="w-5 h-5 text-[#6a0d5f] rounded focus:ring-[#6a0d5f]" />
          <label for="is_active" class="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Rendre cette bannière active</label>
        </div>
      </form>

      <template #footer>
        <button type="button" @click="showModal = false"
          class="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-widest">
          Annuler
        </button>
        <button type="submit" form="banner-form" :disabled="bannerStore.loading"
          class="px-8 py-3 rounded-xl bg-[#6a0d5f] text-white font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 shadow-lg shadow-[#6a0d5f]/30">
          {{ bannerStore.loading ? 'Traitement...' : 'Enregistrer' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBannerStore, type Banner } from "~~/stores/banner";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Swal from "sweetalert2";

const bannerStore = useBannerStore();
const showModal = ref(false);
const isEditing = ref(false);
const isPageLoading = ref(true);
const previewUrl = ref("");
const selectedFile = ref<File | null>(null);

const form = ref({
  id: null as string | null,
  title: "",
  order: 0,
  is_active: true
});

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = { id: null, title: "", order: 0, is_active: true };
  previewUrl.value = "";
  selectedFile.value = null;
  showModal.value = true;
};

const openEditModal = (banner: Banner) => {
  isEditing.value = true;
  form.value = {
    id: banner.id,
    title: banner.title || "",
    order: banner.order,
    is_active: banner.is_active
  };
  previewUrl.value = banner.image_url;
  selectedFile.value = null;
  showModal.value = true;
};

const saveBanner = async () => {
  try {
    if (isEditing.value && form.value.id) {
      await bannerStore.updateBanner(form.value.id, {
        image: selectedFile.value || undefined,
        title: form.value.title,
        order: form.value.order,
        is_active: form.value.is_active
      });
      Swal.fire({
        icon: 'success',
        title: 'Mis à jour',
        text: 'Bannière mise à jour avec succès',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      if (!selectedFile.value) return;
      await bannerStore.createBanner({
        image: selectedFile.value,
        title: form.value.title,
        order: form.value.order,
        is_active: form.value.is_active
      });
      Swal.fire({
        icon: 'success',
        title: 'Créé',
        text: 'Nouvelle bannière ajoutée',
        timer: 1500,
        showConfirmButton: false
      });
    }
    showModal.value = false;
  } catch (e: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: e.message || 'Une erreur est survenue'
    });
  }
};

const deleteBanner = async (banner: Banner) => {
  const result = await Swal.fire({
    title: "Supprimer ?",
    text: `Voulez-vous vraiment supprimer cette bannière ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a0d5f",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler"
  });
  
  if (result.isConfirmed) {
    try {
      await bannerStore.deleteBanner(banner.id);
      Swal.fire({
        icon: 'success',
        title: 'Supprimé',
        text: 'Bannière supprimée',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (e) {
       Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la suppression'
      });
    }
  }
};

onMounted(async () => {
  isPageLoading.value = true;
  await bannerStore.fetchBanners();
  isPageLoading.value = false;
});
</script>
