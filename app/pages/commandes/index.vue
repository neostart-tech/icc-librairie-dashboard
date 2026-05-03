<template>
  <div class="min-h-screen space-y-8 pb-12 relative">
    <!-- Premium Loading Overlay -->
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
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Chargement des
            commandes</span>
        </div>
      </div>
    </transition>

    <!-- Header Section -->
    <Breadcrumb :items="[
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Commandes', to: null },
    ]" title="Gestion des Commandes" description="Suivez et validez les transactions et livraisons."
      :icon="OrdersIconPath" />

    <div class="max-w-[1600px] mx-auto space-y-8 px-4 sm:px-8">
      <!-- Filtres de Période -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-end gap-6">
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Mois de la transaction</label>
                <select v-model="selectedMonth" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm font-bold text-[#6a0d5f] outline-none focus:ring-2 focus:ring-[#6a0d5f]">
                    <option :value="null">Tous les mois</option>
                    <option v-for="(name, index) in monthNames" :key="index" :value="index">{{ name }}</option>
                </select>
            </div>
            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Année</label>
                <select v-model="selectedYear" class="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm font-bold text-[#6a0d5f] outline-none focus:ring-2 focus:ring-[#6a0d5f]">
                    <option :value="null">Toutes les années</option>
                    <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
            </div>
        </div>
        <button @click="resetFilters" class="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">Réinitialiser</button>
      </div>

      <!-- Quick Stats -->
      <div v-reveal="{ delay: 200 }" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Chiffre d'Affaires -->
        <div
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Revenus Validés</p>
          </div>
          <p class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{{
            validatedRevenue.toLocaleString() }} <span class="text-[10px] font-bold text-gray-400">FCFA</span></p>
          <p class="text-[8px] text-gray-400 uppercase tracking-widest mt-1">
            {{ selectedMonth !== null ? monthNames[selectedMonth] : 'Tous les mois' }} {{ selectedYear !== null ? selectedYear : 'Toutes les années' }}
          </p>
        </div>

        <!-- A Valider -->
        <div
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">À Valider</p>
          </div>
          <p class="text-2xl font-black text-blue-600 tracking-tighter">{{ pendingValidationCount }} <span
              class="text-[10px] font-bold text-gray-400">CMD</span></p>
          <p class="text-[8px] text-gray-400 uppercase tracking-widest mt-1">
            {{ selectedMonth !== null ? monthNames[selectedMonth] : 'Tous les mois' }} {{ selectedYear !== null ? selectedYear : 'Toutes les années' }}
          </p>
        </div>

        <!-- Terminées -->
        <div
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Terminées</p>
          </div>
          <p class="text-2xl font-black text-gray-600 tracking-tighter">{{ traiteCount }} <span
              class="text-[10px] font-bold text-gray-400">CMD</span></p>
          <p class="text-[8px] text-gray-400 uppercase tracking-widest mt-1">
            {{ selectedMonth !== null ? monthNames[selectedMonth] : 'Tous les mois' }} {{ selectedYear !== null ? selectedYear : 'Toutes les années' }}
          </p>
        </div>
      </div>

      <!-- Unified List Container -->
      <div v-reveal="{ delay: 400 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <!-- Integrated Toolbar -->
        <div
          class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div class="flex flex-col md:flex-row items-center gap-4 flex-1">
            <div class="relative flex-1 max-w-md group">
              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6a0d5f] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input v-model="search" type="text" placeholder="Référence ou client..."
                class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm" />
            </div>

            <div class="flex items-center gap-2">
              <div
                class="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Statut</span>
                <select v-model="selectedStatus"
                  class="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest text-[#6a0d5f] outline-none">
                  <option value="all">Tous les statuts</option>
                  <option value="en_attente_validation">À Valider</option>
                  <option value="valide">Validées</option>
                  <option value="traite">Terminées</option>

                  <option value="paiement_refuse">Refusées</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="relative overflow-hidden p-0">
          <Vue3Datatable :rows="searchedRows" :columns="columns" :sortable="true" :pagination="true" :page-size="10"
            skin="bh-table-hover bh-table-bordered" class="premium-table">
            <template #reference="data">
              <span class="font-bold text-[#6a0d5f] dark:text-purple-400 tracking-tighter uppercase">#{{
                data.value.reference }}</span>
            </template>

            <template #client="data">
              <span class="font-medium text-gray-900 dark:text-white uppercase tracking-tighter text-xs">{{
                data.value.client }}</span>
            </template>

            <template #montant="data">
              <span class="font-bold text-gray-900 dark:text-white tracking-tighter">{{ (data.value.montant +
                data.value.frais_livraison).toLocaleString() }} <span class="text-[8px] font-medium">FCFA</span></span>
            </template>

            <template #statut="data">
              <span :class="getStatusBadgeClasses(data.value.statut)"
                class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border">
                {{ getStatusLabel(data.value.statut) }}
              </span>
            </template>

            <template #actions="data">
              <div class="flex items-center gap-2">
                <button @click="openDetails(data.value._raw)"
                  class="p-2.5 rounded-xl text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-all group"
                  title="Détails & Actions">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
      </div>

      <!-- Evolution Chart Section -->
      <div 
        v-reveal="{ delay: 300 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-8 shadow-xl"
      >
        <div class="flex items-center justify-between mb-8">
            <div>
                <h3 class="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                    Évolution du Chiffre d'Affaires
                </h3>
                <p class="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                    Suivi des revenus sur la période sélectionnée
                </p>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 px-3 py-1 bg-[#6a0d5f]/5 rounded-lg border border-[#6a0d5f]/10">
                    <div class="w-2 h-2 rounded-full bg-[#6a0d5f]"></div>
                    <span class="text-[9px] font-black text-[#6a0d5f] uppercase tracking-widest">Revenus (FCFA)</span>
                </div>
            </div>
        </div>

        <div class="h-64 w-full">
            <canvas ref="chartRef"></canvas>
        </div>
      </div>

      
    </div>

    <!-- Details Modal -->
    <Modal :show="showDetailsModal" variant="primary" max-width="5xl"
      :title="`Commande #${selectedCommande?.reference}`"
      :description="`Enregistrée le ${formatDate(selectedCommande?.created_at)}`" @close="showDetailsModal = false">
      <div v-if="selectedCommande" class="space-y-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Client & Delivery -->
          <div class="lg:col-span-2 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                class="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 space-y-4">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2" />
                  </svg>
                  Client
                </h4>
                <div class="space-y-2">
                  <p class="text-sm font-black text-gray-900 dark:text-white uppercase">{{ selectedCommande?.user?.nom
                    }} {{
                      selectedCommande?.user?.prenom }}</p>
                  <p class="text-xs font-bold text-gray-500">{{ selectedCommande?.user?.email }}</p>
                  <p class="text-xs font-bold text-gray-500">{{ selectedCommande?.user?.telephone || 'Pas de téléphone'
                    }}
                  </p>
                </div>
              </div>

              <div class="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 space-y-4">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13 18h7l2-4h-7m-4 4h1a2 2 0 100-4h-1m-7 4h1a2 2 0 100-4H7m3-4V7a2 2 0 012-2h6"
                      stroke-width="2" />
                  </svg>
                  Mode de Livraison
                </h4>
                <div class="space-y-2">
                  <p class="text-sm font-black text-blue-600 uppercase">{{ selectedCommande.type_livraison ===
                    'livraison' ?
                    'À Domicile' : 'Retrait en Librairie' }}</p>
                  <template v-if="selectedCommande.type_livraison === 'livraison'">
                    <p class="text-xs font-bold text-gray-700 dark:text-gray-300">{{ selectedCommande.adresse_livraison
                      }}</p>
                    <p class="text-xs font-bold text-gray-500">Contact : {{ selectedCommande.numero_livraison }}</p>
                  </template>
                </div>
              </div>
            </div>

            <!-- Proof of Payment if exists -->
            <div v-if="selectedCommande.preuve_paiement || selectedCommande.reference_paiement_client"
              class="p-6 bg-orange-500/5 rounded-2xl border border-orange-500/10 space-y-4">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" />
                </svg>
                Déclaration de Paiement
              </h4>
              <div class="flex flex-col md:flex-row gap-6">
                <div v-if="selectedCommande.preuve_paiement"
                  class="w-full md:w-48 aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden shadow-lg border border-white dark:border-gray-800">
                  <a :href="`${useRuntimeConfig().public.storageBase}/${selectedCommande.preuve_paiement}`"
                    target="_blank" class="block w-full h-full group relative">
                    <img :src="`${useRuntimeConfig().public.storageBase}/${selectedCommande.preuve_paiement}`"
                      class="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div
                      class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase">
                      Voir l'original</div>
                  </a>
                </div>
                <div class="flex-1 space-y-4">
                  <div>
                    <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Référence
                      Transaction Client</span>
                    <p class="text-sm font-bold text-gray-900 dark:text-white font-mono break-all">{{
                      selectedCommande.reference_paiement_client || '---' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Articles -->
            <div class="space-y-4">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.832 5.477 4 6.253v13C4.832 18.477 6.416 19 7.5 19s2.668-.523 3.5-1.253V6.253z"
                    stroke-width="2" />
                </svg>
                Ouvrages
              </h4>
              <div
                class="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                <table class="w-full text-left">
                  <thead class="bg-gray-100 dark:bg-white/5">
                    <tr>
                      <th class="px-6 py-4 text-[8px] font-black uppercase text-gray-400 tracking-widest">Article</th>
                      <th class="px-6 py-4 text-[8px] font-black uppercase text-gray-400 tracking-widest text-center">
                        Quantité</th>
                      <th class="px-6 py-4 text-[8px] font-black uppercase text-gray-400 tracking-widest text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y dark:divide-white/5">
                    <tr v-for="d in selectedCommande.detailcommandes" :key="d.id">
                      <td class="px-6 py-4">
                        <p class="text-xs font-bold text-gray-900 dark:text-white uppercase">{{ d.livre?.titre }}</p>
                        <p class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">{{
                          d.prix_unitaire.toLocaleString() }} FCFA / u</p>
                      </td>
                      <td class="px-6 py-4 text-center">
                        <span class="px-3 py-1 bg-[#6a0d5f]/10 text-[#6a0d5f] rounded-lg text-xs font-bold">{{
                          d.quantite
                          }}</span>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <span class="text-xs font-bold text-gray-900 dark:text-white">{{ (d.prix_unitaire *
                          d.quantite).toLocaleString() }} FCFA</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Total & Actions -->
          <div class="space-y-6">
            <div class="bg-gray-900 rounded-2xl p-8 text-white space-y-6 shadow-2xl">
              <div class="space-y-2">
                <div class="flex justify-between text-white/50 text-[10px] font-black uppercase tracking-widest">
                  <span>Sous-Total</span>
                  <span>{{ selectedCommande.prix_total.toLocaleString() }} FCFA</span>
                </div>
                <div class="flex justify-between text-white/50 text-[10px] font-black uppercase tracking-widest">
                  <span>Livraison</span>
                  <span>{{ selectedCommande.frais_livraison.toLocaleString() }} FCFA</span>
                </div>
              </div>
              <div class="h-px bg-white/10"></div>
              <div class="space-y-1">
                <p class="text-[10px] font-black text-orange-400 uppercase tracking-widest">Montant Total à Percevoir
                </p>
                <p class="text-3xl font-black tracking-tighter">{{ (selectedCommande.prix_total +
                  selectedCommande.frais_livraison).toLocaleString() }} <span class="text-xs font-medium">FCFA</span>
                </p>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div :class="getStatusBadgeClasses(selectedCommande.statut)" class="w-2 h-2 rounded-full"></div>
                <span class="text-[9px] font-black uppercase tracking-[0.2em]">{{
                  getStatusLabel(selectedCommande.statut)
                  }}</span>
              </div>
            </div>

            <!-- Contextual Admin Actions -->
            <div class="space-y-3">
              <!-- If En attente de validation -->
              <template v-if="selectedCommande.statut === 'en_attente_validation'">
                <button @click="validerPaiement(selectedCommande)"
                  class="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all">
                  Valider le Paiement
                </button>
                <button @click="refuserPaiement(selectedCommande)"
                  class="w-full bg-red-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all">
                  Refuser le Paiement
                </button>
              </template>

              <!-- If Valide (paid but not delivered) -->
              <template v-if="selectedCommande.statut === 'valide'">
                <button @click="finaliserCommande(selectedCommande)"
                  class="w-full bg-[#6a0d5f] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95 transition-all">
                  Marquer comme Livrée
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showDetailsModal = false"
          class="px-8 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-white/10 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">Fermer</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import Swal from "sweetalert2";
import { useCommandeStore } from "~~/stores/commande";
import { useToast } from "#imports";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const commandeStore = useCommandeStore();
const toast = useToast();

const isPageLoading = ref(true);
const search = ref("");
const showDetailsModal = ref(false);
const selectedCommande = ref(null);
const selectedStatus = ref("all");
const chartRef = ref(null);
let chartInstance = null;

const now = new Date();
const selectedMonth = ref(null); // Default: Tous les mois
const selectedYear = ref(null); // Changé à null pour tout voir par défaut (évite de cacher les commandes des années passées)

const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const availableYears = computed(() => {
    const years = [];
    for (let y = 2024; y <= new Date().getFullYear() + 1; y++) years.push(y);
    return years;
});

const resetFilters = () => {
    selectedMonth.value = null;
    selectedYear.value = null;
    selectedStatus.value = "all";
    search.value = "";
};

const OrdersIconPath = "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z";

const columns = [
  { field: "reference", title: "Commande", sortable: true },
  { field: "client", title: "Client", sortable: true },
  { field: "date", title: "Date", sortable: true },
  { field: "montant", title: "Total", sortable: true },
  { field: "statut", title: "Statut" },
  { field: "actions", title: "Actions" },
];

const getStatusLabel = (statut) => {
  const labels = {
    'en_cours': 'En attente',
    'en_attente_validation': 'À Valider',
    'valide': 'Validée (Payée)',
    'traite': 'Terminée (Livrée)',
    'termine': 'Terminée',
    'paiement_refuse': 'Refusée'
  };
  return labels[statut] || statut;
};

const getStatusBadgeClasses = (statut) => {
  const classes = {
    'en_cours': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    'en_attente_validation': 'bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-blue-500/10',
    'valide': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'traite': 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    'paiement_refuse': 'bg-red-500/10 text-red-600 border-red-500/20'
  };
  return classes[statut] || 'bg-gray-100 text-gray-400';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const filteredByDate = computed(() => {
    const allCommandes = commandeStore.commandes || [];
    return allCommandes.filter(c => {
        // On n'affiche pas les commandes "en_cours" (non déclarées) pour les admins
        if (c.statut === 'en_cours') return false;

        // Si aucun filtre de date n'est sélectionné, on affiche tout
        if (selectedMonth.value === null && selectedYear.value === null) return true;

        const d = new Date(c.created_at);
        if (isNaN(d.getTime())) return true; // Si la date est invalide, on l'affiche quand même par prudence

        const monthMatch = selectedMonth.value === null || d.getMonth() === selectedMonth.value;
        const yearMatch = selectedYear.value === null || d.getFullYear() === selectedYear.value;
        return monthMatch && yearMatch;
    });
});

const rows = computed(() =>
  filteredByDate.value.map(c => ({
    reference: c.reference,
    client: `${c.user?.nom ?? ""} ${c.user?.prenom ?? ""}`,
    date: new Date(c.created_at).toLocaleDateString("fr-FR"),
    montant: c.prix_total,
    frais_livraison: c.frais_livraison,
    statut: c.statut,
    _raw: c,
  }))
);

const searchedRows = computed(() => {
  return rows.value.filter(r => {
    // Gérer l'équivalence entre 'traite' et 'termine' pour le filtre de statut
    let statusMatch = selectedStatus.value === "all";
    if (!statusMatch) {
        if (selectedStatus.value === 'traite') {
            statusMatch = (r.statut === 'traite' || r.statut === 'termine');
        } else {
            statusMatch = r.statut === selectedStatus.value;
        }
    }

    const textMatch = r.reference.toLowerCase().includes(search.value.toLowerCase()) ||
      r.client.toLowerCase().includes(search.value.toLowerCase());
    return statusMatch && textMatch;
  });
});

const validatedRevenue = computed(() =>
  filteredByDate.value
    .filter(c => ['valide', 'traite', 'termine'].includes(c.statut))
    .reduce((s, c) => s + c.prix_total, 0)
);

const pendingValidationCount = computed(() => filteredByDate.value.filter(c => c.statut === 'en_attente_validation').length);
const traiteCount = computed(() => filteredByDate.value.filter(c => ['traite', 'termine'].includes(c.statut)).length);

const initChart = () => {
    if (!chartRef.value) return;
    if (chartInstance) chartInstance.destroy();

    const ctx = chartRef.value.getContext('2d');
    let labels = [];
    let dailyData = [];

    const validatedCommandes = filteredByDate.value.filter(c => ['valide', 'traite', 'termine'].includes(c.statut));

    if (selectedMonth.value !== null && selectedYear.value !== null) {
        // Daily view
        const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
        labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        dailyData = Array(daysInMonth).fill(0);
        validatedCommandes.forEach(c => {
            const d = new Date(c.created_at).getDate();
            dailyData[d - 1] += c.prix_total;
        });
    } else if (selectedYear.value !== null) {
        // Monthly view
        labels = monthNames;
        dailyData = Array(12).fill(0);
        validatedCommandes.forEach(c => {
            const m = new Date(c.created_at).getMonth();
            dailyData[m] += c.prix_total;
        });
    } else {
        // Yearly view
        const years = availableYears.value;
        labels = years.map(String);
        dailyData = Array(years.length).fill(0);
        validatedCommandes.forEach(c => {
            const y = new Date(c.created_at).getFullYear();
            const idx = years.indexOf(y);
            if (idx !== -1) dailyData[idx] += c.prix_total;
        });
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(106, 13, 95, 0.2)');
    gradient.addColorStop(1, 'rgba(106, 13, 95, 0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenus',
                data: dailyData,
                borderColor: '#6a0d5f',
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6a0d5f',
                pointBorderWidth: 2,
                pointRadius: 3,
                tension: 0.4,
                fill: true,
                backgroundColor: gradient
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#111', padding: 12, cornerRadius: 12 }
            },
            scales: {
                y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });
};

watch([selectedMonth, selectedYear, filteredByDate], () => {
    initChart();
});

const openDetails = (commande) => {
  selectedCommande.value = commande;
  showDetailsModal.value = true;
};

const validerPaiement = async (commande) => {
  const res = await Swal.fire({
    title: "Valider le paiement ?",
    text: "Confirmez-vous avoir reçu les fonds ? Le stock sera alors décrémenté.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    confirmButtonText: "Oui, valider !",
    cancelButtonText: "Annuler",
    customClass: { popup: 'rounded-2xl' }
  });

  if (res.isConfirmed) {
    try {
      await commandeStore.validerPaiement(commande.id);
      toast.success({ message: "Paiement validé avec succès !" });
      showDetailsModal.value = false;
    } catch (e) {
      toast.error({ message: "Erreur lors de la validation." });
    }
  }
};

const refuserPaiement = async (commande) => {
  const { value: motif } = await Swal.fire({
    title: "Refuser le paiement",
    input: "text",
    inputLabel: "Motif du refus",
    inputPlaceholder: "Ex: Capture d'écran illisible, fonds non reçus...",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Refuser",
    customClass: { popup: 'rounded-2xl' }
  });

  if (motif !== undefined) {
    try {
      await commandeStore.refuserPaiement(commande.id, motif);
      toast.success({ message: "Paiement refusé." });
      showDetailsModal.value = false;
    } catch (e) {
      toast.error({ message: "Erreur lors de l'action." });
    }
  }
};

const finaliserCommande = async (commande) => {
  const res = await Swal.fire({
    title: "Clôturer la commande ?",
    text: "Marquer cette commande comme livrée/terminée ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#6a0d5f",
    confirmButtonText: "Oui, terminée",
    customClass: { popup: 'rounded-2xl' }
  });

  if (res.isConfirmed) {
    try {
      await commandeStore.finaliserCommande(commande.id);
      toast.success({ message: "Commande clôturée !" });
      showDetailsModal.value = false;
    } catch (e) {
      toast.error({ message: "Erreur lors de la clôture." });
    }
  }
};

onMounted(async () => {
  try {
    isPageLoading.value = true;
    await commandeStore.fetchAllOrders();
    initChart();
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
