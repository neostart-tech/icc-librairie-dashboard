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
        { label: 'Modifier', to: null },
      ]"
      title="Modifier la Fiche"
      description="Mettez à jour les informations et visuels de l'ouvrage."
      :icon="EditIconPath"
    />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <div v-if="!isPageLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Édition <span class="text-[#6a0d5f]">du Livre</span></h3>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Identifiant: #{{ route.params.id.toString().split('-')[0] }}</p>
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
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                  />
                </div>

                <!-- Auteur -->
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Auteur</label>
                  <input
                    v-model="livre.auteur"
                    type="text"
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
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prix Promo</label>
                  <input
                    v-model.number="livre.prix_promo"
                    type="number"
                    min="0"
                    placeholder="Laissez vide si pas de promo"
                    class="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none font-bold text-gray-700 dark:text-gray-200"
                  />
                </div>

                <!-- Image Upload -->
                <div class="md:col-span-2 space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 border-b dark:border-white/5 pb-1 block">Changer l'image de couverture</label>
                  <div class="flex items-center gap-4 pt-2">
                    <label
                      for="image"
                      class="flex items-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 border border-[#6a0d5f]/20 text-[#6a0d5f] dark:text-purple-400 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-[#6a0d5f] hover:text-white transition-all shadow-lg shadow-[#6a0d5f]/5"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Sélectionner une nouvelle image
                    </label>
                    <input id="image" type="file" accept="image/*" @change="handleFile" class="hidden" />
                    <span v-if="livre.image" class="text-xs font-bold text-emerald-500 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      Nouvel image chargée
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <div class="md:col-span-2 space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                  <textarea
                    v-model="livre.description"
                    rows="5"
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
              <NuxtLink
                to="/livres"
                class="flex-1 py-5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all text-center flex items-center justify-center"
              >
                Annuler
              </NuxtLink>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-[2] py-5 bg-[#6a0d5f] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#6a0d5f]/20 hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                {{ isSubmitting ? 'Mise à jour...' : 'Mettre à jour la fiche' }}
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
              <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#6a0d5f]/10 rounded-full blur-3xl"></div>
              
              <h4 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b dark:border-white/5 pb-4">Aperçu <span class="text-[#6a0d5f]">Dynamique</span></h4>
              
              <div class="space-y-6">
                <div class="aspect-[3/4.5] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 relative">
                  <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
                  <div class="absolute top-4 right-4 animate-in fade-in duration-1000">
                    <span v-if="livre.stock && livre.stock.quantite === 0" class="px-3 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">Rupture</span>
                    <span v-else class="px-3 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">En Stock</span>
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
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Prix Actuel</p>
                    <div class="flex flex-col items-center">
                      <p v-if="livre.prix_promo" class="text-[10px] text-gray-400 line-through font-bold">{{ livre.prix.toLocaleString() }}</p>
                      <p class="text-lg font-black text-[#6a0d5f] dark:text-purple-400">{{ (livre.prix_promo || livre.prix).toLocaleString() }} <span class="text-[8px] font-bold">FCFA</span></p>
                    </div>
                  </div>
                  <div class="text-center">
                    <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1">Disponible</p>
                    <p class="text-lg font-black text-emerald-600">{{ livre.stock?.quantite || '0' }} <span class="text-[8px] font-bold">UNITÉS</span></p>
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
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useLivreStore } from "~~/stores/livre";
import { useCategorieStore } from "~~/stores/categorie";
import { useToast } from "#imports";

/* =======================
   RESOURCES
 ======================= */
const EditIconPath = "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z";

/* =======================
   STORES & HOOKS
 ======================= */
const isPageLoading = ref(true);
const route = useRoute();
const router = useRouter();
const toast = useToast();
const livreStore = useLivreStore();
const categorieStore = useCategorieStore();

const MAX_IMAGE_SIZE = 4096 * 1024;

/* =======================
   DATA STATE
 ======================= */
const livre = ref<any>({
  titre: "",
  auteur: "",
  categorie_id: null,
  prix: 0,
  prix_promo: null,
  stock: 0,
  description: "",
  image: null,
});

const imagePreview = ref<string | null>(null);
const isSubmitting = ref(false);

/* =======================
   ACTIONS
 ======================= */
const handleFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files.length) return;

  const file = input.files[0];
  if (file.size > MAX_IMAGE_SIZE) {
    toast.error({ message: "L’image dépasse 4 Mo. Veuillez en choisir une autre." });
    input.value = "";
    return;
  }

  livre.value.image = file;
  imagePreview.value = URL.createObjectURL(file);
};

const submitLivre = async () => {
  try {
    isSubmitting.value = true;
    const payload: any = {
      titre: livre.value.titre,
      auteur: livre.value.auteur,
      description: livre.value.description,
      prix: livre.value.prix,
      prix_promo: livre.value.prix_promo,
      categorie_id: livre.value.categorie_id,
    };

    if (livre.value.image) payload.images = [livre.value.image];

    const id = route.params.id as string;
    await livreStore.updateLivre(id, payload);

    toast.success({ message: "Livre mis à jour avec succès" });
    router.push("/livres");
  } catch (err) {
    toast.error({ message: "Erreur lors de la mise à jour" });
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
    const id = route.params.id as string;
    const data = await livreStore.fetchLivre(id);
    if (!data) return;

    livre.value = {
      titre: data.titre || "",
      auteur: data.auteur || "",
      categorie_id: data.categorie_id || 0,
      prix: data.prix ?? 0,
      prix_promo: data.prix_promo ?? null,
      stock: data.stock ?? 0,
      description: data.description || "",
      image: null,
    };

    await categorieStore.fetchCategories();
    imagePreview.value = livreStore.getCoverImage(data);
  } catch (err) {
    toast.error({ message: "Impossible de charger le livre" });
  } finally {
    isPageLoading.value = false;
  }
});
</script>
