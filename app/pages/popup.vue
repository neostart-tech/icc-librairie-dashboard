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
      { label: 'Popups', to: '/popup' },
    ]" title="Popups" description="Gérez les popups qui s'affichent lors de l'arrivée sur le site."
      icon="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <div
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden">
        
        <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex flex-1 items-center gap-4">
            <h2 class="text-lg font-black text-[#6a0d5f] uppercase tracking-tighter">Liste des popups</h2>
          </div>

          <button @click="openCreateModal"
            class="px-6 py-3 bg-[#6a0d5f] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/20 hover:bg-[#8a1a7a] transition-all flex items-center gap-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un popup
          </button>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="popup in popupStore.popups" :key="popup.id" 
            class="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 transition-all hover:shadow-2xl hover:shadow-[#6a0d5f]/10">
            
            <div class="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img :src="popup.image_url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>

            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between">
                <span :class="[
                  'text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full',
                  popup.is_active ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'
                ]">
                  {{ popup.is_active ? 'Actif' : 'Inactif' }}
                </span>
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {{ new Date(popup.created_at!).toLocaleDateString() }}
                </span>
              </div>
              
              <div v-if="popup.link" class="text-[10px] font-bold text-gray-400 truncate">
                Lien: {{ popup.link }}
              </div>

              <div class="flex gap-2 pt-2">
                <button @click="openEditModal(popup)"
                  class="flex-1 py-2.5 rounded-xl bg-blue-500/5 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500/10 transition-colors">
                  Modifier
                </button>
                <button @click="deletePopup(popup)"
                  class="flex-1 py-2.5 rounded-xl bg-rose-500/5 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <div v-if="popupStore.popups.length === 0" class="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <svg class="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p class="text-sm font-bold uppercase tracking-widest">Aucun popup trouvé</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Creation/Edition -->
    <Modal
      :show="showModal"
      variant="primary"
      max-width="2xl"
      :title="isEditing ? 'Édition Popup' : 'Nouveau Popup'"
      description="Configurez le visuel qui apparaîtra aux visiteurs."
      icon='<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" /></svg>'
      @close="showModal = false"
    >
      <form @submit.prevent="savePopup" id="popup-form" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Image du popup</label>
          <div class="relative group">
            <input type="file" @change="handleFileChange" accept="image/*" :required="!isEditing"
              class="hidden" id="popup-image" />
            <label for="popup-image" class="cursor-pointer block w-full aspect-square md:aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-[#6a0d5f] transition-all overflow-hidden text-left">
              <div v-if="previewUrl" class="w-full h-full relative">
                <img :src="previewUrl" class="w-full h-full object-contain" />
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

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Lien de redirection (optionnel)</label>
          <input v-model="form.link" type="text" placeholder="https://..."
            class="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all font-bold text-gray-700 dark:text-gray-200" />
        </div>

        <div class="flex items-center gap-3 ml-1">
          <input v-model="form.is_active" type="checkbox" id="is_active"
            class="w-5 h-5 text-[#6a0d5f] rounded focus:ring-[#6a0d5f]" />
          <label for="is_active" class="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Rendre ce popup actif (désactivera les autres)</label>
        </div>
      </form>

      <template #footer>
        <button type="button" @click="showModal = false"
          class="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-widest">
          Annuler
        </button>
        <button type="submit" form="popup-form" :disabled="popupStore.loading"
          class="px-8 py-3 rounded-xl bg-[#6a0d5f] text-white font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 shadow-lg shadow-[#6a0d5f]/30">
          {{ popupStore.loading ? 'Traitement...' : 'Enregistrer' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePopupStore, type Popup } from "~~/stores/popup";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Swal from "sweetalert2";

const popupStore = usePopupStore();
const showModal = ref(false);
const isEditing = ref(false);
const isPageLoading = ref(true);
const previewUrl = ref("");
const selectedFile = ref<File | null>(null);

const form = ref({
  id: null as string | null,
  link: "",
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
  form.value = { id: null, link: "", is_active: true };
  previewUrl.value = "";
  selectedFile.value = null;
  showModal.value = true;
};

const openEditModal = (popup: Popup) => {
  isEditing.value = true;
  form.value = {
    id: popup.id,
    link: popup.link || "",
    is_active: popup.is_active
  };
  previewUrl.value = popup.image_url;
  selectedFile.value = null;
  showModal.value = true;
};

const savePopup = async () => {
  try {
    if (isEditing.value && form.value.id) {
      await popupStore.updatePopup(form.value.id, {
        image: selectedFile.value || undefined,
        link: form.value.link,
        is_active: form.value.is_active
      });
      Swal.fire({
        icon: 'success',
        title: 'Mis à jour',
        text: 'Popup mis à jour avec succès',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      if (!selectedFile.value) return;
      await popupStore.createPopup({
        image: selectedFile.value,
        link: form.value.link,
        is_active: form.value.is_active
      });
      Swal.fire({
        icon: 'success',
        title: 'Créé',
        text: 'Nouveau popup ajouté',
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

const deletePopup = async (popup: Popup) => {
  const result = await Swal.fire({
    title: "Supprimer ?",
    text: `Voulez-vous vraiment supprimer ce popup ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a0d5f",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler"
  });
  
  if (result.isConfirmed) {
    try {
      await popupStore.deletePopup(popup.id);
      Swal.fire({
        icon: 'success',
        title: 'Supprimé',
        text: 'Popup supprimé',
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
  await popupStore.fetchPopups();
  isPageLoading.value = false;
});
</script>
