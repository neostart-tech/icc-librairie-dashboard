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
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Initialisation du flux</span>
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
        { label: 'Stocks', to: '/stocks' },
        { label: 'Nouveau Flux', to: null },
      ]"
      title="Nouveau Flux"
      description="Enregistrez un mouvement d'entrée ou de sortie pour régulariser votre stock."
      :icon="FluxIconPath"
    />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-8">
          <form @submit.prevent="submitMouvement" class="space-y-8">
            <div 
              v-reveal="{ delay: 200 }"
              class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[3rem] p-8 shadow-2xl"
            >
              <div class="flex items-center gap-4 mb-8">
                <div class="p-3 bg-[#6a0d5f]/10 rounded-2xl">
                  <svg class="w-6 h-6 text-[#6a0d5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Paramètres <span class="text-[#6a0d5f]">du Mouvement</span></h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Renseignez les détails de l'opération</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Sélection du Livre -->
                <div class="md:col-span-2 space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Livre concerné *</label>
                  <select
                    v-model="mouvement.livre_id"
                    required
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Rechercher un livre dans le catalogue...</option>
                    <option v-for="l in livres" :key="l.id" :value="l.id">{{ l.titre }}</option>
                  </select>
                </div>

                <!-- Type -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Type de Flux *</label>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      @click="mouvement.type = 'entree'"
                      :class="[
                        'py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all',
                        mouvement.type === 'entree' 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-white/10 text-gray-400 grayscale'
                      ]"
                    >
                      Entrée (+)
                    </button>
                    <button
                      type="button"
                      @click="mouvement.type = 'sortie'"
                      :class="[
                        'py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all',
                        mouvement.type === 'sortie' 
                          ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
                          : 'bg-white/50 dark:bg-gray-800/50 border-white/20 dark:border-white/10 text-gray-400 grayscale'
                      ]"
                    >
                      Sortie (-)
                    </button>
                  </div>
                </div>

                <!-- Quantité -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Quantité *</label>
                  <input
                    v-model.number="mouvement.quantite"
                    type="number"
                    required
                    min="1"
                    placeholder="Nombre d'exemplaires"
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                  />
                </div>

                <!-- Commentaire -->
                <div class="md:col-span-2 space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Motif / Commentaire</label>
                  <textarea
                    v-model="mouvement.commentaire"
                    rows="4"
                    placeholder="Ex: Réapprovisionnement annuel, Retour client, Correction inventaire..."
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-3xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-medium text-gray-700 dark:text-gray-200 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div 
              v-reveal="{ delay: 400 }"
              class="flex gap-4"
            >
              <button
                type="button"
                @click="resetForm"
                class="flex-1 py-5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:bg-white/10 transition-all"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-[2] py-5 bg-[#6a0d5f] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#6a0d5f]/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {{ isSubmitting ? 'Validation...' : 'Valider le Flux' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar Preview -->
        <div class="lg:col-span-1 space-y-8">
          <div 
            v-reveal="{ delay: 600 }"
            class="sticky top-24 space-y-6"
          >
            <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[3rem] p-8 shadow-2xl overflow-hidden relative">
              <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#6a0d5f]/10 rounded-full blur-3xl"></div>
              
              <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b dark:border-white/5 pb-4">Impact <span class="text-[#6a0d5f]">Stock</span></h4>
              
              <div v-if="selectedLivreData" class="space-y-6">
                <div class="flex items-center gap-4">
                  <img :src="livreStore.getCoverImage(selectedLivreData)" class="w-16 h-20 object-cover rounded-xl shadow-lg border border-white/10" />
                  <div>
                    <h5 class="text-sm font-black text-gray-900 dark:text-white uppercase italic tracking-tighter truncate max-w-[150px]">{{ selectedLivreData.titre }}</h5>
                    <p class="text-[10px] text-[#6a0d5f] font-bold uppercase tracking-widest mt-1">{{ selectedLivreData.categorie?.libelle }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 text-center">
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Actuel</p>
                    <p class="text-xl font-black text-gray-900 dark:text-white">{{ selectedLivreData.stock?.quantite || 0 }}</p>
                  </div>
                  <div :class="[
                    'p-6 rounded-3xl border text-center transition-all duration-500',
                    mouvement.type === 'entree' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'
                  ]">
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Après Flux</p>
                    <p :class="[
                      'text-xl font-black italic tracking-tighter transition-all duration-500',
                      mouvement.type === 'entree' ? 'text-emerald-600' : 'text-rose-600'
                    ]">
                      {{ finalStock }}
                    </p>
                  </div>
                </div>

                <div class="p-6 bg-[#6a0d5f]/5 rounded-3xl border border-[#6a0d5f]/10 relative overflow-hidden">
                  <div class="flex items-center gap-3 relative z-10">
                    <div class="p-2 bg-[#6a0d5f] text-white rounded-lg">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-tight">
                      L'opération sera enregistrée sous le nom de <span class="text-gray-900 dark:text-white">{{ userStore.user?.nom }}</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div v-else class="py-12 text-center space-y-4">
                <div class="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto grayscale opacity-50">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.832 5.477 4 6.253v13C4.832 18.477 6.416 19 7.5 19s2.668-.523 3.5-1.253V6.253z" />
                  </svg>
                </div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sélectionnez un livre<br/>pour voir l'impact</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useStockStore } from "~~/stores/stock";
import { useLivreStore } from "~~/stores/livre";
import { useUserStore } from "~~/stores/user";
import { useToast } from "#imports";

/* =======================
   RESOURCES
======================= */
const FluxIconPath = "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4";

/* =======================
   STORES & HOOKS
======================= */
const stockStore = useStockStore();
const livreStore = useLivreStore();
const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

const isPageLoading = ref(true);
const isSubmitting = ref(false);

/* =======================
   DATA STATE
======================= */
const livres = ref([]);
const mouvement = ref({
  livre_id: "",
  type: "entree",
  quantite: null,
  commentaire: "",
});

const selectedLivreData = computed(() => {
  if (!mouvement.value.livre_id) return null;
  return livres.value.find(l => l.id === mouvement.value.livre_id);
});

const finalStock = computed(() => {
  if (!selectedLivreData.value) return 0;
  const current = selectedLivreData.value.stock?.quantite || 0;
  const qty = mouvement.value.quantite || 0;
  return mouvement.value.type === 'entree' ? current + qty : Math.max(0, current - qty);
});

/* =======================
   ACTIONS
======================= */
const resetForm = () => {
  mouvement.value = {
    livre_id: "",
    type: "entree",
    quantite: null,
    commentaire: "",
  };
};

const submitMouvement = async () => {
  if (!mouvement.value.livre_id || !mouvement.value.type || !mouvement.value.quantite) {
    toast.error({ message: "Veuillez remplir tous les champs obligatoires." });
    return;
  }

  try {
    isSubmitting.value = true;
    await stockStore.addMouvement({
      livre_id: mouvement.value.livre_id,
      type: mouvement.value.type,
      quantite: mouvement.value.quantite,
      commentaire: mouvement.value.commentaire,
    });

    toast.success({ message: "Mouvement de stock enregistré !" });
    router.push("/stocks");
  } catch (error) {
    toast.error({ message: "Une erreur est survenue lors de l'enregistrement." });
  } finally {
    isSubmitting.value = false;
  }
};

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  try {
    isPageLoading.value = true;
    await Promise.all([
      livreStore.fetchLivres(),
      userStore.fetchProfile()
    ]);
    livres.value = livreStore.livres;
  } finally {
    isPageLoading.value = false;
  }
});
</script>
