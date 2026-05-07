<template>
  <div class="min-h-screen space-y-8 pb-12 relative">
    <!-- Premium Loading Overlay -->
    <transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-700 ease-in" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="commandeStore.loading || isPageLoading"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl">
        <div class="relative">
          <div class="w-24 h-24 rounded-full border-4 border-[#6a0d5f]/10 border-t-[#6a0d5f] animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <img src="/logo/logo_librairie(1).png" class="w-12 h-12 object-contain" alt="Logo" />
          </div>
        </div>
        <div class="mt-6 flex flex-col items-center">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Enregistrement de la vente...</span>
        </div>
      </div>
    </transition>

    <!-- Header Section -->
    <Breadcrumb :items="[
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Commandes', to: '/commandes' },
      { label: 'Nouvelle Commande', to: null },
    ]" title="Vente au Comptoir" description="Enregistrez une vente directe et déduisez-la immédiatement du stock."
      :icon="AddIconPath" showBackButton />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Column: Selection (8/12) -->
      <div class="lg:col-span-8 space-y-8">
        
        <!-- Client Information Card -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
            <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Informations Client</h2>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Coordonnées de l'acheteur</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Nom Complet <span class="text-red-500">*</span></label>
                    <input v-model="clientInfo.nom_complet" type="text" placeholder="Ex: Jean Kossi" class="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#6a0d5f] rounded-xl outline-none font-bold text-gray-700 dark:text-gray-200 transition-all" />
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Téléphone</label>
                    <input v-model="clientInfo.telephone" type="tel" placeholder="+228..." class="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#6a0d5f] rounded-xl outline-none font-bold text-gray-700 dark:text-gray-200 transition-all" />
                </div>
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email</label>
                    <input v-model="clientInfo.email" type="email" placeholder="client@email.com" class="w-full px-5 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#6a0d5f] rounded-xl outline-none font-bold text-gray-700 dark:text-gray-200 transition-all" />
                </div>
            </div>
        </div>

        <!-- Book Selection Card (LARGE & SCROLLABLE) -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-xl flex flex-col h-[700px]">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Catalogue de Vente</h2>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sélectionnez les livres à ajouter</p>
                    </div>
                </div>

                <div class="w-full md:w-96 relative">
                    <input 
                        v-model="searchQuery"
                        type="text" 
                        placeholder="Rechercher par titre ou auteur..."
                        class="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-[#6a0d5f] rounded-2xl outline-none font-bold text-sm text-gray-700 dark:text-gray-200 transition-all shadow-inner"
                    />
                    <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <!-- Scrollable Grid of Books -->
            <div class="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div 
                        v-for="livre in filteredLivres" 
                        :key="livre.id"
                        class="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#6a0d5f]/30 transition-all group flex flex-col"
                    >
                        <div class="flex gap-4">
                            <!-- Image click to show modal -->
                            <div 
                                @click="openBookDetails(livre)"
                                class="w-16 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 dark:border-white/10 cursor-pointer hover:ring-2 hover:ring-[#6a0d5f] transition-all"
                            >
                                <img :src="livreStore.getCoverImage(livre)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-xs font-black text-gray-900 dark:text-white truncate" :title="livre.titre">{{ livre.titre }}</h4>
                                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 truncate">{{ livre.auteur || 'Sans auteur' }}</p>
                                <div class="mt-2 flex flex-col gap-1">
                                    <div class="flex items-center justify-between">
                                        <span class="text-[9px] font-black uppercase text-[#6a0d5f]">Stock:</span>
                                        <span :class="['text-[10px] font-black', (livre.stock?.quantite ?? 0) > 0 ? 'text-emerald-500' : 'text-red-500']">
                                            {{ livre.stock?.quantite ?? 0 }} ex.
                                        </span>
                                    </div>
                                    <p class="text-sm font-black text-gray-900 dark:text-white">
                                        {{ (livre.prix_promo ?? livre.prix ?? 0).toLocaleString() }} <span class="text-[8px]">FCFA</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 flex items-center gap-3">
                            <div class="flex-1 h-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-white/10 flex items-center overflow-hidden">
                                <button @click="adjustLocalQty(livre.id, -1)" class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-[#6a0d5f] hover:bg-gray-50 dark:hover:bg-white/5 transition-all">-</button>
                                <input type="number" v-model.number="localQuantities[livre.id]" class="w-full h-full text-center bg-transparent text-xs font-black outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                <button @click="adjustLocalQty(livre.id, 1)" class="w-10 h-full flex items-center justify-center text-gray-400 hover:text-[#6a0d5f] hover:bg-gray-50 dark:hover:bg-white/5 transition-all">+</button>
                            </div>
                            <button 
                                @click="addToCartFromGrid(livre)"
                                :disabled="(livre.stock?.quantite ?? 0) <= 0"
                                class="h-10 px-4 bg-[#6a0d5f] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#6a0d5f]/20 hover:bg-[#8a1a7a] transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                                </svg>
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="filteredLivres.length === 0" class="py-20 text-center flex flex-col items-center gap-4">
                    <div class="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-200">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p class="text-[11px] font-black uppercase tracking-widest text-gray-400">Aucun livre trouvé</p>
                </div>
            </div>
        </div>
      </div>

      <!-- Right Column: Cart & Summary (4/12) -->
      <div class="lg:col-span-4 space-y-8 sticky top-24">
        <!-- Cart Items Card -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col max-h-[600px]">
            <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-black uppercase tracking-tighter text-gray-900 dark:text-white">Panier Actuel</h3>
                    <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{{ cart.length }} articles</p>
                </div>
                <button @click="cart = []" v-if="cart.length > 0" class="text-[9px] font-black uppercase tracking-widest text-red-500 hover:underline">Vider</button>
            </div>
            
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                <div v-for="(item, index) in cart" :key="item.livre.id" class="flex items-center gap-4 group">
                    <!-- Image click to show modal also in cart -->
                    <div 
                        @click="openBookDetails(item.livre)"
                        class="w-12 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10 shadow-sm cursor-pointer hover:ring-2 hover:ring-[#6a0d5f] transition-all"
                    >
                        <img :src="livreStore.getCoverImage(item.livre)" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-[11px] font-black text-gray-900 dark:text-white truncate">{{ item.livre.titre }}</p>
                        <div class="flex items-center justify-between mt-1">
                            <span class="text-[10px] font-bold text-gray-400">x{{ item.quantite }}</span>
                            <span class="text-[11px] font-black text-[#6a0d5f]">{{ ((item.livre.prix_promo ?? item.livre.prix) * item.quantite).toLocaleString() }} FCFA</span>
                        </div>
                    </div>
                    <button @click="removeFromCart(index)" class="p-2 text-gray-300 hover:text-red-500 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <div v-if="cart.length === 0" class="py-12 text-center flex flex-col items-center gap-4 opacity-50">
                    <svg class="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p class="text-[10px] font-black uppercase tracking-widest text-gray-300">Panier vide</p>
                </div>
            </div>

            <div class="p-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
                <div class="flex items-center justify-between mb-6">
                    <span class="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a0d5f]">Total à payer</span>
                    <p class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{{ totalPrice.toLocaleString() }} <span class="text-[10px] font-medium">FCFA</span></p>
                </div>

                <button 
                    @click="submitVente"
                    :disabled="cart.length === 0 || !clientInfo.nom_complet"
                    class="w-full py-5 bg-[#6a0d5f] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#6a0d5f]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    Valider la Vente
                </button>
            </div>
        </div>

        <!-- Stock Alert -->
        <div v-if="hasStockWarning" class="p-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-3xl flex gap-4">
            <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
                <p class="text-[11px] font-black uppercase tracking-widest text-red-600">Stock insuffisant !</p>
                <p class="text-[10px] font-bold text-red-700/80 dark:text-red-400/80 mt-1 leading-relaxed">Certaines quantités sélectionnées dépassent le stock physique disponible.</p>
            </div>
        </div>
      </div>

    </div>

    <!-- Book Details Modal -->
    <Modal
        :show="showBookModal"
        @close="showBookModal = false"
        :title="selectedBookForModal?.titre"
        description="Détails complets du livre"
        maxWidth="3xl"
    >
        <div v-if="selectedBookForModal" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
                <img :src="livreStore.getCoverImage(selectedBookForModal)" class="w-full h-full object-cover" />
            </div>
            <div class="space-y-6">
                <div>
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a0d5f] mb-1">Auteur</h4>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedBookForModal.auteur || 'Non spécifié' }}</p>
                </div>
                <div>
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a0d5f] mb-1">Prix</h4>
                    <div class="flex items-center gap-3">
                        <p class="text-2xl font-black text-gray-900 dark:text-white">{{ (selectedBookForModal.prix_promo ?? selectedBookForModal.prix).toLocaleString() }} FCFA</p>
                        <p v-if="selectedBookForModal.prix_promo" class="text-sm font-bold text-gray-400 line-through">{{ selectedBookForModal.prix.toLocaleString() }} FCFA</p>
                    </div>
                </div>
                <div>
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a0d5f] mb-1">Stock Disponible</h4>
                    <div class="flex items-center gap-2">
                        <span :class="['px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest', (selectedBookForModal.stock?.quantite ?? 0) > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600']">
                            {{ selectedBookForModal.stock?.quantite ?? 0 }} exemplaires
                        </span>
                    </div>
                </div>
                <div>
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a0d5f] mb-2">Description</h4>
                    <div class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar pr-2" v-html="selectedBookForModal.description || 'Aucune description disponible.'">
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <button 
                @click="showBookModal = false"
                class="px-8 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >
                Fermer
            </button>
            <button 
                @click="addToCartFromGrid(selectedBookForModal); showBookModal = false"
                :disabled="(selectedBookForModal?.stock?.quantite ?? 0) <= 0"
                class="px-8 py-3 bg-[#6a0d5f] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-[#6a0d5f]/20 hover:bg-[#8a1a7a] transition-all disabled:opacity-50"
            >
                Ajouter au panier
            </button>
        </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useLivreStore } from '~~/stores/livre';
import { useCommandeStore } from '~~/stores/commande';
import { navigateTo } from '#app';
import Swal from 'sweetalert2';
import Modal from '~~/app/components/Modal.vue';

const livreStore = useLivreStore();
const commandeStore = useCommandeStore();

const isPageLoading = ref(true);
const searchQuery = ref('');

// Modal State
const showBookModal = ref(false);
const selectedBookForModal = ref<any>(null);

// Icons
const AddIconPath = "M12 4v16m8-8H4";

// Form State
const clientInfo = ref({
    nom_complet: '',
    telephone: '',
    email: ''
});

const cart = ref<Array<{ livre: any, quantite: number }>>([]);
const localQuantities = ref<Record<string, number>>({});

// Computed
const filteredLivres = computed(() => {
    const disponibles = livreStore.livres.filter(l => !l.sur_commande);
    if (!searchQuery.value) return disponibles;
    const q = searchQuery.value.toLowerCase();
    return disponibles.filter(l =>
        l.titre.toLowerCase().includes(q) ||
        (l.auteur && l.auteur.toLowerCase().includes(q))
    );
});

const totalItems = computed(() => cart.value.reduce((acc, item) => acc + item.quantite, 0));
const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + (item.livre.prix_promo ?? item.livre.prix) * item.quantite, 0));

const hasStockWarning = computed(() => {
    return cart.value.some(item => (item.livre.stock?.quantite ?? 0) < item.quantite);
});

// Watch for store data to init local quantities
watch(() => livreStore.livres, (newLivres) => {
    if (!newLivres) return;
    newLivres.forEach(l => {
        if (!localQuantities.value[l.id]) localQuantities.value[l.id] = 1;
    });
}, { immediate: true });

// Actions
const openBookDetails = (livre: any) => {
    selectedBookForModal.value = livre;
    showBookModal.value = true;
};

const adjustLocalQty = (id: string, delta: number) => {
    const current = localQuantities.value[id] || 1;
    const next = current + delta;
    if (next >= 1) localQuantities.value[id] = next;
};

const addToCartFromGrid = (livre: any) => {
    const qtyToAdd = localQuantities.value[livre.id] || 1;
    
    const existingIndex = cart.value.findIndex(item => item.livre.id === livre.id);
    if (existingIndex !== -1) {
        cart.value[existingIndex]!.quantite += qtyToAdd;
    } else {
        cart.value.push({ livre, quantite: qtyToAdd });
    }
    
    // Reset local qty
    localQuantities.value[livre.id] = 1;
};

const removeFromCart = (index: number) => {
    cart.value.splice(index, 1);
};

const submitVente = async () => {
    if (cart.value.length === 0 || !clientInfo.value.nom_complet) return;

    // Check stock before submitting
    if (hasStockWarning.value) {
        Swal.fire({
            title: 'Stock insuffisant',
            text: 'Veuillez ajuster les quantités avant de valider la vente.',
            icon: 'warning',
            confirmButtonColor: '#6a0d5f',
        });
        return;
    }

    const result = await Swal.fire({
        title: 'Confirmer la vente',
        text: `Voulez-vous valider cette vente d'un montant de ${totalPrice.value.toLocaleString()} FCFA pour ${clientInfo.value.nom_complet} ?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, valider',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#6a0d5f',
    });

    if (result.isConfirmed) {
        try {
            const payload = {
                nom_client: clientInfo.value.nom_complet,
                telephone_client: clientInfo.value.telephone,
                email_client: clientInfo.value.email,
                livres: cart.value.map(item => ({
                    livre_id: item.livre.id,
                    quantite: item.quantite
                }))
            };

            await commandeStore.venteComptoir(payload);

            Swal.fire({
                title: 'Vente réussie !',
                text: 'La commande a été enregistrée et le stock mis à jour.',
                icon: 'success',
                confirmButtonColor: '#6a0d5f',
            });

            navigateTo('/commandes');
        } catch (error: any) {
            Swal.fire({
                title: 'Erreur',
                text: error.message || "Une erreur est survenue lors de l'enregistrement.",
                icon: 'error',
                confirmButtonColor: '#6a0d5f',
            });
        }
    }
};

onMounted(async () => {
    try {
        await livreStore.fetchLivres();
    } finally {
        isPageLoading.value = false;
    }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(106, 13, 95, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(106, 13, 95, 0.2);
}
</style>
