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
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Chargement des commandes</span>
          <div class="flex gap-1 mt-2">
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.3s"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Header Section -->
    <Breadcrumb :items="[
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Commandes', to: null },
    ]" title="Gestion des Commandes" description="Suivez et traitez les transactions de votre librairie." :icon="OrdersIconPath" />

    <div class="max-w-[1600px] mx-auto space-y-8 px-4 sm:px-8">
      <!-- Improved Quick Stats -->
      <div 
        v-reveal="{ delay: 200 }"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <!-- Chiffre d'Affaires Global -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all hover:shadow-emerald-500/5">
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">C.A. Global</p>
          </div>
          <p class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{{ globalRevenue.toLocaleString() }} <span class="text-[10px] font-bold text-gray-400">FCFA</span></p>
        </div>
        
        <!-- En Attente -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all hover:shadow-amber-500/5">
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">À Traiter</p>
          </div>
          <p class="text-2xl font-black text-amber-600 tracking-tighter">{{ pendingCount }} <span class="text-[10px] font-bold text-gray-400">CMD</span></p>
        </div>

        <!-- Traitées -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all hover:shadow-[#6a0d5f]/5">
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-[#6a0d5f]/5 rounded-full blur-2xl group-hover:bg-[#6a0d5f]/10 transition-colors"></div>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-xl bg-[#6a0d5f]/10 flex items-center justify-center text-[#6a0d5f]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Traitées</p>
          </div>
          <p class="text-2xl font-black text-[#6a0d5f] tracking-tighter">{{ processedCount }} <span class="text-[10px] font-bold text-gray-400">CMD</span></p>
        </div>

        <!-- Chiffre d'Affaires Période -->
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all hover:shadow-blue-500/5">
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">C.A. Période</p>
          </div>
          <p class="text-2xl font-black text-blue-600 tracking-tighter">{{ totalAmount }} <span class="text-[10px] font-bold text-gray-400">FCFA</span></p>
        </div>
      </div>

      <!-- Unified List Container -->
      <div 
        v-reveal="{ delay: 400 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <!-- Integrated Toolbar -->
        <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div class="flex flex-col md:flex-row items-center gap-4 flex-1">
            <div class="relative flex-1 max-w-md group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6a0d5f] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                v-model="search"
                type="text"
                placeholder="Référence commande..."
                class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
              />
            </div>

            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mois</span>
                <select
                  v-model="selectedMonth"
                  class="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-[#6a0d5f] outline-none cursor-pointer"
                >
                  <option value="all">Tous les mois</option>
                  <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
              </div>

              <div class="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Année</span>
                <select
                  v-model="selectedYear"
                  class="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-gray-500 outline-none cursor-pointer"
                >
                  <option v-for="y in years" :key="y.value" :value="y.value">{{ y.label }}</option>
                </select>
              </div>

              <div class="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Statut</span>
                <select
                  v-model="selectedStatus"
                  class="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-gray-500 outline-none cursor-pointer"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="termine">À traiter</option>
                  <option value="traite">Traitées</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="relative overflow-hidden p-0">
          <Vue3Datatable
            :rows="searchedRows"
            :columns="columns"
            :sortable="true"
            :pagination="true"
            :page-size="10"
            skin="bh-table-hover bh-table-bordered"
            class="premium-table"
          >
            <template #reference="data">
              <span class="font-medium text-[#6a0d5f] dark:text-purple-400 tracking-tighter uppercase">#{{ data.value.reference }}</span>
            </template>

            <template #client="data">
              <span class="font-medium text-gray-900 dark:text-white uppercase tracking-tighter text-xs">{{ data.value.client }}</span>
            </template>

            <template #montant="data">
              <span class="font-medium text-gray-900 dark:text-white tracking-tighter">{{ data.value.montant.toLocaleString() }} <span class="text-[8px] font-medium">FCFA</span></span>
            </template>

            <template #statut="data">
              <div class="flex items-center gap-2">
                <div v-if="data.value.statut === 'traite'" class="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span class="text-[10px] font-medium uppercase tracking-widest">Traitée</span>
                </div>
                <div v-else class="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
                  <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <span class="text-[10px] font-medium uppercase tracking-widest">En cours</span>
                </div>
              </div>
            </template>

            <template #actions="data">
              <div class="flex items-center gap-2">
                <button
                  @click="openDetails(data.value._raw)"
                  class="p-2.5 rounded-xl text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-all group"
                  title="Détails"
                >
                  <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  v-if="data.value.statut !== 'traite'"
                  @click="traiterCommande(data.value._raw)"
                  class="p-2.5 rounded-xl text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all"
                  title="Marquer comme traitée"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <Modal
      :show="showDetailsModal"
      variant="primary"
      max-width="4xl"
      :title="`Commande #${selectedCommande?.reference}`"
      :description="`Enregistrée le ${selectedCommande?.created_at ? new Date(selectedCommande.created_at).toLocaleDateString('fr-FR') : '...'}`"
      @close="showDetailsModal = false"
    >
      <div v-if="selectedCommande" class="space-y-8">
        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Client Section -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 px-2">
              <svg class="w-4 h-4 text-[#6a0d5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400">Identité Client</h4>
            </div>
            <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 space-y-3">
              <div class="flex justify-between">
                <span class="text-xs text-gray-400 font-bold uppercase">Nom</span>
                <span class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{{ selectedCommande?.user?.nom || 'Client' }} {{ selectedCommande?.user?.prenom || 'Inconnu' }}</span>
              </div>
              <div class="flex justify-between border-t dark:border-white/5 pt-3">
                <span class="text-xs text-gray-400 font-bold uppercase">Email</span>
                <span class="text-sm font-bold text-gray-600 dark:text-gray-300">{{ selectedCommande?.user?.email || 'Non renseigné' }}</span>
              </div>
              <div class="flex justify-between border-t dark:border-white/5 pt-3">
                <span class="text-xs text-gray-400 font-bold uppercase">Téléphone</span>
                <span class="text-sm font-bold text-gray-600 dark:text-gray-300">{{ selectedCommande?.user?.telephone || "Non renseigné" }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 px-2">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400">Règlement</h4>
            </div>
            <div class="p-6 bg-emerald-500/5 rounded-xl border border-emerald-500/10 space-y-4 text-center">
              <div class="flex items-center justify-center gap-3">
                <img 
                  v-if="getMoyenPaiementLogo(selectedCommande.paiements?.[0]?.moyen_paiement)" 
                  :src="getMoyenPaiementLogo(selectedCommande.paiements?.[0]?.moyen_paiement)" 
                  class="h-6 w-auto"
                />
                <span class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                  {{ getMoyenPaiementLabel(selectedCommande.paiements?.[0]?.moyen_paiement) }}
                </span>
              </div>
              <p class="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em] border-t dark:border-white/5 pt-4">ID TRANSACTION</p>
              <p class="text-xs font-black text-emerald-600 font-mono tracking-widest">{{ selectedCommande?.paiements?.[0]?.reference_transaction || "N/A" }}</p>
            </div>
          </div>
        </div>

        <!-- Items Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 px-2">
            <svg class="w-4 h-4 text-[#6a0d5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.832 5.477 4 6.253v13C4.832 18.477 6.416 19 7.5 19s2.668-.523 3.5-1.253V6.253z" />
            </svg>
            <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400">Ouvrages commandés</h4>
          </div>
          <div class="bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-gray-100 dark:bg-white/5">
                <tr>
                  <th class="px-6 py-4 text-[8px] font-black uppercase text-gray-400 tracking-widest">Article</th>
                  <th class="px-6 py-4 text-[8px] font-black uppercase text-gray-400 tracking-widest text-center">Quantité</th>
                  <th class="px-6 py-4 text-[8px] font-black uppercase text-gray-400 tracking-widest text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y dark:divide-white/5">
                <tr v-for="d in selectedCommande.detailcommandes" :key="d.id">
                  <td class="px-6 py-4">
                    <p class="text-xs font-medium text-gray-900 dark:text-white uppercase">{{ d.livre?.titre || 'Ouvrage inconnu' }}</p>
                    <p class="text-[8px] font-medium text-gray-400 uppercase tracking-widest mt-1">{{ d.prix_unitaire?.toLocaleString() }} FCFA / unité</p>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="px-3 py-1 bg-[#6a0d5f]/10 text-[#6a0d5f] rounded-lg text-xs font-medium">{{ d.quantite }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="text-xs font-medium text-gray-900 dark:text-white">{{ (d.prix_unitaire * d.quantite).toLocaleString() }} FCFA</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-gray-100/50 dark:bg-white/5">
                  <td colspan="2" class="px-6 py-6 text-right text-[10px] font-medium uppercase text-gray-500 tracking-widest">Montant Total TTC</td>
                  <td class="px-6 py-6 text-right">
                    <span class="text-2xl font-medium text-[#6a0d5f] dark:text-purple-400 tracking-tighter">{{ selectedCommande?.prix_total?.toLocaleString() }} FCFA</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button @click="showDetailsModal = false" class="px-8 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
          Fermer
        </button>
        <button 
          v-if="selectedCommande.statut !== 'traite'"
          @click="traiterCommande(selectedCommande)" 
          class="px-8 py-3 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          Traiter la commande
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import Swal from "sweetalert2";
import { useCommandeStore } from "~~/stores/commande";
import { useGatewayStore } from "~~/stores/gateway";
import { useToast } from "#imports";

/* =======================
   RESOURCES
======================= */
const OrdersIconPath = "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z";

/* =======================
   STORES
======================= */
const gatewayStore = useGatewayStore();
const commandeStore = useCommandeStore();
const toast = useToast();

/* =======================
   UI STATE
======================= */
const isPageLoading = ref(true);
const isDropdownOpen = ref(false);
const search = ref("");
const showDetailsModal = ref(false);
const selectedCommande = ref(null);

const now = new Date();
const selectedMonth = ref("all");
const selectedYear = ref(String(now.getFullYear()));
const selectedStatus = ref("all");

/* =======================
   STATIC DATA
======================= */
const months = [
  { label: "Janvier", value: "01" }, { label: "Février", value: "02" },
  { label: "Mars", value: "03" }, { label: "Avril", value: "04" },
  { label: "Mai", value: "05" }, { label: "Juin", value: "06" },
  { label: "Juillet", value: "07" }, { label: "Août", value: "08" },
  { label: "Septembre", value: "09" }, { label: "Octobre", value: "10" },
  { label: "Novembre", value: "11" }, { label: "Décembre", value: "12" },
];

/* =======================
   COMPUTED
======================= */
const years = computed(() => {
  const uniqueYears = new Set(commandeStore.commandes.map(c => new Date(c.created_at).getFullYear()));
  return Array.from(uniqueYears).sort((a, b) => b - a).map(y => ({ label: String(y), value: String(y) }));
});

const columns = [
  { field: "reference", title: "Commande", sortable: true },
  { field: "client", title: "Client", sortable: true },
  { field: "date", title: "Date", sortable: true },
  { field: "heure", title: "Heure", sortable: true },
  { field: "montant", title: "Montant", sortable: true },
  { field: "statut", title: "Statut" },
  { field: "actions", title: "Actions" },
];

const rows = computed(() =>
  commandeStore.commandes
    .filter(c => ["termine", "traite"].includes(c.statut))
    .map(c => {
      const d = new Date(c.created_at);
      return {
        reference: c.reference,
        client: `${c.user?.nom ?? ""} ${c.user?.prenom ?? ""}`,
        date: d.toLocaleDateString("fr-FR"),
        heure: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        montant: c.prix_total,
        month: String(d.getMonth() + 1).padStart(2, "0"),
        year: String(d.getFullYear()),
        statut: c.statut,
        _raw: c,
      };
    }),
);

const filteredRows = computed(() =>
  rows.value.filter(r => {
    const monthMatch = selectedMonth.value === "all" || r.month === selectedMonth.value;
    const yearMatch = r.year === selectedYear.value;
    const statusMatch = selectedStatus.value === "all" || r.statut === selectedStatus.value;
    return monthMatch && yearMatch && statusMatch;
  })
);

const searchedRows = computed(() =>
  filteredRows.value.filter(r => r.reference.toLowerCase().includes(search.value.toLowerCase()))
);

const globalRevenue = computed(() =>
  rows.value.reduce((s, r) => s + r.montant, 0)
);

const pendingCount = computed(() =>
  filteredRows.value.filter(r => r.statut === "termine").length
);

const processedCount = computed(() =>
  filteredRows.value.filter(r => r.statut === "traite").length
);

const totalAmount = computed(() =>
  filteredRows.value.reduce((s, r) => s + r.montant, 0).toLocaleString()
);

const currentMonthLabel = computed(() => 
  selectedMonth.value === "all" ? "Toute l'année" : months.find(m => m.value === selectedMonth.value)?.label
);

/* =======================
   ACTIONS
======================= */
const toggleDropdown = () => isDropdownOpen.value = !isDropdownOpen.value;

const openDetails = (commande) => {
  selectedCommande.value = commande;
  showDetailsModal.value = true;
};

const getMoyenPaiementLabel = (moyen) => gatewayStore.gatewayMap[moyen]?.libelle || moyen || "-";
const getMoyenPaiementLogo = (moyen) => gatewayStore.gatewayMap[moyen]?.logo_url || null;

const traiterCommande = async (commande) => {
  const res = await Swal.fire({
    title: "Finaliser Commandes",
    text: `Voulez-vous marquer la commande #${commande.reference} comme traitée ?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#f43f5e",
    confirmButtonText: "Confirmer Traitement",
    cancelButtonText: "Annuler",
    customClass: {
      popup: 'rounded-xl border-none shadow-2xl bg-white dark:bg-gray-900',
      title: 'font-black uppercase tracking-tighter text-gray-800 dark:text-white',
      confirmButton: 'rounded-xl font-bold uppercase tracking-widest',
      cancelButton: 'rounded-xl font-bold uppercase tracking-widest'
    }
  });

  if (res.isConfirmed) {
    try {
      await commandeStore.traiterCommande(commande.id);
      await commandeStore.fetchAllOrders();
      toast.success({ message: "La commande a été marquée comme traitée." });
      showDetailsModal.value = false;
    } catch (e) {
      toast.error({ message: "Erreur lors du traitement." });
    }
  }
};

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  try {
    isPageLoading.value = true;
    await Promise.all([
      commandeStore.fetchAllOrders(),
      gatewayStore.fetchGateways(),
    ]);
  } finally {
    isPageLoading.value = false;
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(106, 13, 95, 0.1);
  border-radius: 10px;
}
</style>
