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
          <span class="text-[10px] uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Initialisation</span>
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
      :items="[{ label: 'Tableau de Bord', to: '/dashboard' }]"
      title="Tableau de Bord"
      description="Bienvenue sur votre centre de contrôle ICC Librairie."
      :icon="HomeIconPath"
    />

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="(stat, index) in dashboardStats" 
        :key="index"
        v-reveal="{ delay: index * 100 }"
        class="group relative overflow-hidden bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-6 shadow-[0_8px_32px_0_rgba(106,13,95,0.05)] hover:shadow-[0_20px_40px_0_rgba(106,13,95,0.1)] transition-all duration-500 hover:-translate-y-1 cursor-pointer"
        @click="stat.to ? router.push(stat.to) : null"
      >
        <!-- Decorative Glow -->
        <div :class="['absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity', stat.glowColor]"></div>

        <div class="flex items-start justify-between relative z-10">
          <div :class="['w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6', stat.iconBg]">
            <svg v-if="stat.icon === 'wallet'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            <svg v-else-if="stat.icon === 'cart'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <svg v-else-if="stat.icon === 'book'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.832 5.477 4 6.253v13C4.832 18.477 6.416 19 7.5 19s2.668-.523 3.5-1.253V6.253z"/></svg>
            <svg v-else-if="stat.icon === 'users'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[10px] text-gray-400 uppercase tracking-widest">{{ stat.label }}</span>
            <div class="flex items-baseline gap-1">
              <span :class="['text-2xl tracking-tighter', stat.textColor]">{{ stat.value }}</span>
              <span v-if="stat.suffix" class="text-[10px] text-gray-400">{{ stat.suffix }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between relative z-10">
          <div class="flex flex-col">
            <span class="text-[10px] text-gray-500">{{ stat.subtext }}</span>
          </div>
          <div class="w-24 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div :class="['h-full transition-all duration-1000 ease-out', stat.progressColor]" :style="{ width: '70%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Section (Charts & Recent) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Analytics Chart -->
      <div 
        v-reveal="{ delay: 500 }"
        class="lg:col-span-2 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-8 shadow-[0_8px_32px_0_rgba(106,13,95,0.05)]"
      >
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{{ titreGraphique }}</h2>
            <p class="text-[10px] text-[#6a0d5f] uppercase tracking-widest mt-1">Analyse des performances de vente</p>
          </div>
          <div class="px-4 py-2 rounded-xl bg-[#6a0d5f]/5 text-[#6a0d5f] text-xs uppercase tracking-widest">
            Temps Réel
          </div>
        </div>

        <div class="relative h-80">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>

      <!-- Quick Actions / Active Orders -->
      <div 
        v-reveal="{ delay: 700 }"
        class="bg-[#6a0d5f] rounded-xl p-8 text-white relative overflow-hidden shadow-2xl shadow-[#6a0d5f]/20"
      >
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 C30,20 70,20 100,0 L100,100 L0,100 Z" fill="white" />
          </svg>
        </div>

        <div class="relative z-10 h-full flex flex-col">
          <h2 class="text-xl uppercase tracking-tighter leading-tight mb-8">
            Commandes en <br />
            <span class="text-orange-400">Attente</span>
          </h2>

          <div class="flex-1 space-y-4">
            <div v-if="pendingOrders.length === 0" class="flex flex-col items-center justify-center h-48 opacity-60">
              <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-xs uppercase tracking-widest">Tout est à jour</p>
            </div>
            
            <div 
              v-for="order in pendingOrders.slice(0, 4)" 
              :key="order.id"
              class="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-pointer group"
            >
              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-[10px] uppercase tracking-widest opacity-60">Client #{{ order.user?.id || '?' }}</span>
                  <span class="text-xs truncate w-32">{{ order.prix_total.toLocaleString() }} FCFA</span>
                </div>
                <div class="p-2 rounded-xl bg-orange-400 text-white shadow-lg shadow-orange-400/30 group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <button 
            @click="router.push('/commandes')"
            class="mt-8 w-full py-4 rounded-xl bg-white text-[#6a0d5f] text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-gray-50 transition-colors"
          >
            Voir toutes les commandes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, shallowRef } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useCommandeStore } from "~~/stores/commande";
import { useStockStore } from "~~/stores/stock";
import { useAdminStore } from "~~/stores/admin";
import { useLivreStore } from "~~/stores/livre";
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

const router = useRouter();

// Navigation Icon Path
const HomeIconPath = "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

const commandeStore = useCommandeStore();
const stockStore = useStockStore();
const adminStore = useAdminStore();
const livreStore = useLivreStore();
const isPageLoading = ref(true);

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const titreGraphique = computed(() => {
  const mois = now.toLocaleDateString("fr-FR", { month: "long" });
  return `Ventes de ${mois}`;
});

// Computed Data
const caMois = computed(() => {
  return commandeStore.commandes
    .filter(c => {
      const d = new Date(c.created_at);
      return ["termine", "traite"].includes(c.statut) && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, c) => sum + c.prix_total, 0);
});

const commandesMois = computed(() => {
  return commandeStore.commandes.filter(c => {
    const d = new Date(c.created_at);
    return c.statut === "traite" && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;
});

const pendingOrders = computed(() => commandeStore.commandes.filter(c => c.statut === "termine"));

const livresDisponibles = computed(() => stockStore.stocks.reduce((sum, s) => sum + (s.quantite || 0), 0));
const totalClients = computed(() => adminStore.users.filter(u => u.role?.role === "user").length);

const dashboardStats = computed(() => [
  { 
    label: "Chiffre d'Affaires", 
    value: caMois.value.toLocaleString(), 
    suffix: "FCFA",
    subtext: "Ce mois",
    icon: 'wallet',
    iconBg: "bg-emerald-500",
    glowColor: "bg-emerald-400",
    textColor: "text-emerald-600",
    progressColor: "bg-emerald-500",
    to: "/commandes"
  },
  { 
    label: "Commandes Traitées", 
    value: commandesMois.value, 
    subtext: "Ce mois",
    icon: 'cart',
    iconBg: "bg-[#6a0d5f]",
    glowColor: "bg-[#6a0d5f]",
    textColor: "text-[#6a0d5f]",
    progressColor: "bg-[#6a0d5f]",
    to: "/commandes"
  },
  { 
    label: "Stock Total", 
    value: livresDisponibles.value, 
    suffix: "Ex.",
    subtext: "Volume global",
    icon: 'book',
    iconBg: "bg-blue-500",
    glowColor: "bg-blue-400",
    textColor: "text-blue-600",
    progressColor: "bg-blue-500",
    to: "/livres"
  },
  { 
    label: "Clients Actifs", 
    value: totalClients.value, 
    subtext: "Total inscrits",
    icon: 'users',
    iconBg: "bg-orange-500",
    glowColor: "bg-orange-400",
    textColor: "text-orange-600",
    progressColor: "bg-orange-500",
    to: "/utilisateurs"
  },
]);

// GRAPH LOGIC
const ventesParJour = computed(() => {
  const days = Array(30).fill(0);
  commandeStore.commandes.forEach((c) => {
    if (["termine", "traite"].includes(c.statut)) {
      const d = new Date(c.created_at);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const index = d.getDate() - 1;
        if (index >= 0 && index < 30) {
          c.detailcommandes?.forEach((dc) => {
            days[index] += dc.quantite;
          });
        }
      }
    }
  });
  return days;
});

const initChart = () => {
  if (!chartRef.value) return;
  if (chart) chart.destroy();

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(106, 13, 95, 0.2)');
  gradient.addColorStop(1, 'rgba(106, 13, 95, 0)');

  chart = new Chart(chartRef.value, {
    type: "line",
    data: {
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      datasets: [
        {
          label: "Ventes",
          data: ventesParJour.value,
          borderColor: "#6a0d5f",
          borderWidth: 4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#6a0d5f",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          backgroundColor: gradient,
          tension: 0.45,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111',
          titleFont: { size: 12, weight: 'normal' },
          bodyFont: { size: 10 },
          padding: 12,
          cornerRadius: 12,
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { display: false },
          ticks: { font: { size: 10, weight: 'normal' } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10, weight: 'normal' } }
        }
      }
    },
  });
};

watch(ventesParJour, () => {
  initChart();
});

onMounted(async () => {
  try {
    isPageLoading.value = true;
    await Promise.all([
      commandeStore.fetchAllOrders(),
      stockStore.fetchStocks(),
      adminStore.fetchAllUsers(),
      livreStore.fetchLivres(),
    ]);
    initChart();
  } finally {
    isPageLoading.value = false;
  }
});
</script>

<style scoped>
canvas {
  filter: drop-shadow(0 10px 10px rgba(106, 13, 95, 0.05));
}
</style>
