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
        { label: 'Livres', to: '/livres' },
        { label: 'Ajouter', to: null },
      ]"
      title="Nouveau Livre"
      description="Enregistrez une nouvelle œuvre dans votre collection."
      :icon="PlusIconPath"
    />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-8">
          <form @submit.prevent="submitLivre" class="space-y-8">
            <div 
              v-reveal="{ delay: 200 }"
              class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-8 shadow-2xl"
            >
              <div class="flex items-center gap-4 mb-8">
                <div class="p-3 bg-[#6a0d5f]/10 rounded-xl">
                  <svg class="w-6 h-6 text-[#6a0d5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Informations <span class="text-[#6a0d5f]">Générales</span></h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Détails essentiels de l'ouvrage</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Titre -->
                <div class="md:col-span-2 space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Titre du livre *</label>
                  <input
                    v-model="livre.titre"
                    type="text"
                    required
                    placeholder="Ex: La Puissance de la Foi"
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                  />
                </div>

                <!-- Auteur -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Auteur</label>
                  <input
                    v-model="livre.auteur"
                    type="text"
                    placeholder="Ex: Pasteur Mohammed Sanogo"
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                  />
                </div>

                <!-- Catégorie -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Catégorie *</label>
                  <select
                    v-model="livre.categorie_id"
                    required
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200 appearance-none cursor-pointer"
                  >
                    <option :value="null" disabled>Sélectionner...</option>
                    <option v-for="cat in categorieStore.categories" :key="cat.id" :value="cat.id">{{ cat.libelle }}</option>
                  </select>
                </div>

                <!-- Prix -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prix Standard (FCFA) *</label>
                  <input
                    v-model.number="livre.prix"
                    type="number"
                    required
                    min="0"
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                  />
                </div>

                <!-- Prix Promo -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prix Promo (Optionnel)</label>
                  <input
                    v-model.number="livre.prix_promo"
                    type="number"
                    min="0"
                    placeholder="Laissez vide si pas de promo"
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                  />
                </div>

                <!-- Stock Initial -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Quantité Initial *</label>
                  <input
                    v-model.number="livre.stock"
                    type="number"
                    required
                    min="0"
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                  />
                </div>

                <!-- Image Upload -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 border-b dark:border-white/5 pb-1 block">Couverture</label>
                  <div class="flex items-center gap-4 pt-2">
                    <label
                      for="image"
                      class="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#6a0d5f] text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#6a0d5f]/20"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ livre.image ? 'Changer' : 'Sélectionner' }}
                    </label>
                    <input id="image" type="file" accept="image/*" @change="handleFile" class="hidden" />
                  </div>
                </div>

                <!-- Description -->
                <div class="md:col-span-2 space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description (Optionnelle)</label>
                  <textarea
                    v-model="livre.description"
                    rows="5"
                    placeholder="Décrivez l'ouvrage pour vos clients..."
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-medium text-gray-700 dark:text-gray-200 resize-none"
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
                class="flex-1 py-5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-[2] py-5 bg-[#6a0d5f] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#6a0d5f]/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer le livre' }}
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
            <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-8 shadow-2xl overflow-hidden relative">
              <!-- Decorative elements -->
              <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#6a0d5f]/10 rounded-full blur-3xl"></div>
              
              <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b dark:border-white/5 pb-4">Aperçu en <span class="text-[#6a0d5f]">Temps Réel</span></h4>
              
              <div class="space-y-6">
                <div class="aspect-[3/4.5] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner border border-white/10 flex items-center justify-center">
                  <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover animate-in fade-in zoom-in duration-500" />
                  <div v-else class="text-center p-8">
                    <svg class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">En attente d'image</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <span class="px-3 py-1 bg-[#6a0d5f]/10 text-[#6a0d5f] rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {{ categorieStore.categories.find(c => c.id === livre.categorie_id)?.libelle || 'Catégorie' }}
                  </span>
                  <h3 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight line-clamp-2">
                    {{ livre.titre || 'Titre du Livre' }}
                  </h3>
                  <p class="text-sm font-bold text-gray-500">
                    par {{ livre.auteur || 'Auteur Inconnu' }}
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-4 border-t dark:border-white/5">
                  <div class="text-center">
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Prix</p>
                    <p class="text-lg font-black text-[#6a0d5f] dark:text-purple-400">{{ livre.prix ? livre.prix.toLocaleString() : '0' }} <span class="text-[8px] font-bold">FCFA</span></p>
                  </div>
                  <div class="text-center">
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Stock</p>
                    <p class="text-lg font-black text-emerald-600">{{ livre.stock || '0' }} <span class="text-[8px] font-bold">UNITÉS</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useLivreStore } from "~~/stores/livre";
import { useCategorieStore } from "~~/stores/categorie";
import { useStockStore } from "~~/stores/stock";
import { useToast } from "#imports";
import { useRouter } from "vue-router";

/* =======================
   RESOURCES
======================= */
const PlusIconPath = "M12 4v16m8-8H4";

/* =======================
   STORES & HOOKS
======================= */
const livreStore = useLivreStore();
const categorieStore = useCategorieStore();
const stockStore = useStockStore();
const router = useRouter();
const toast = useToast();

const isPageLoading = ref(true);
const isSubmitting = ref(false);

/* =======================
   DATA STATE
======================= */
const livre = ref({
  titre: "",
  auteur: "",
  categorie_id: null as number | null,
  prix: 0,
  prix_promo: null as number | null,
  stock: 0,
  description: "",
  image: null as File | null,
});

const imagePreview = ref<any>(null);

/* =======================
   ACTIONS
======================= */
const handleFile = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files.length) return;

  const file = input.files[0];
  if (file.size > 4096 * 1024) {
    toast.error({ message: "L’image dépasse 4 Mo. Veuillez choisir une image plus légère." });
    input.value = "";
    livre.value.image = null;
    imagePreview.value = null;
    return;
  }

  livre.value.image = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result;
  };
  reader.readAsDataURL(file);
};

const resetForm = () => {
  livre.value = {
    titre: "",
    auteur: "",
    categorie_id: null,
    prix: 0,
    prix_promo: null,
    stock: 0,
    description: "",
    image: null,
  };
  imagePreview.value = null;
};

const submitLivre = async () => {
  try {
    isSubmitting.value = true;
    const newLivre = await livreStore.createLivre({
      titre: livre.value.titre,
      auteur: livre.value.auteur,
      description: livre.value.description,
      prix: livre.value.prix,
      prix_promo: livre.value.prix_promo ?? undefined,
      categorie_id: livre.value.categorie_id!,
      images: livre.value.image ? [livre.value.image] : [],
    });

    if (livre.value.stock > 0) {
      await stockStore.addMouvement({
        livre_id: newLivre.id,
        type: "entree",
        quantite: livre.value.stock,
        commentaire: "Stock initial",
      });
    }

    toast.success({ message: "Livre ajouté avec succès" });
    await router.push("/livres");
  } catch (e: any) {
    toast.error({ message: e?.message || "Erreur lors de l’ajout" });
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
    await categorieStore.fetchCategories();
  } finally {
    isPageLoading.value = false;
  }
});
</script>
