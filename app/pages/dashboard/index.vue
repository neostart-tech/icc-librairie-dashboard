<template>
	<!-- LOADING GLOBAL -->
	<div
		v-if="isPageLoading"
		class="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70"
	>
		<div
			class="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
		></div>
	</div>

	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<Breadcrumb
			:items="[{ label: 'Tableau de Bord', to: '/' }]"
			title="Tableau de Bord"
		/>

		<!-- STATS -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
			<!-- CA -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
				<p class="text-sm text-gray-500 uppercase">Chiffre d'affaires</p>
				<p class="mt-2 text-2xl font-bold text-green-600">
					{{ caMois.toLocaleString() }} FCFA
				</p>
				<p class="text-xs text-gray-400">Ce mois</p>
			</div>

			<!-- Commandes -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
				<p class="text-sm text-gray-500 uppercase">Commandes</p>
				<p class="mt-2 text-2xl font-bold dark:text-white">
					{{ commandesMois }}
				</p>
				<p class="text-xs text-gray-400">Ce mois</p>
			</div>

			<!-- En attente -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
				<p class="text-sm text-gray-500 uppercase">En attente</p>
				<p class="mt-2 text-2xl font-bold text-orange-500">
					{{ commandesEnAttente }}
				</p>
				<p class="text-xs text-gray-400">Commandes</p>
			</div>

			<!-- Livres disponibles -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
				<p class="text-sm text-gray-500 uppercase">Disponibles</p>
				<p class="mt-2 text-2xl font-bold dark:text-white">
					{{ livresDisponibles }}
				</p>
				<p class="text-xs text-gray-400">Livres</p>
			</div>

			<!-- Rupture -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
				<p class="text-sm text-gray-500 uppercase">Rupture</p>
				<p class="mt-2 text-2xl font-bold text-red-500">
					{{ livresEnRupture }}
				</p>
				<p class="text-xs text-gray-400">Livres</p>
			</div>

			<!-- Clients -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
				<p class="text-sm text-gray-500 uppercase">Clients</p>
				<p class="mt-2 text-2xl font-bold dark:text-white">
					{{ totalClients }}
				</p>
				<p class="text-xs text-gray-400">Total</p>
			</div>

			<!-- Ventes -->
			<div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow">
				<p class="text-sm text-gray-500 uppercase">Ventes du mois</p>
				<p class="mt-2 text-2xl font-bold text-[#6a0d5f]">
					{{ ventesMois }}
				</p>
				<p class="text-xs text-gray-400">Livres</p>
			</div>
		</div>

		<!-- GRAPH -->
		<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
			<h2 class="text-xl font-bold mb-4 dark:text-white">
				Ventes des 30 derniers jours
			</h2>
			<canvas ref="chartRef" class="w-full h-64"></canvas>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted, ref, watch } from "vue";
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
	} from "chart.js";

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Tooltip,
		Legend,
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

	/* ======================
COMMANDES TERMINÉES DU MOIS
====================== */
	const commandesTermineesMois = computed(() =>
		commandeStore.commandes.filter((c) => {
			const d = new Date(c.created_at);
			return (
				c.statut === "termine" &&
				d.getMonth() === currentMonth &&
				d.getFullYear() === currentYear
			);
		}),
	);

	/* CA */
	const caMois = computed(() =>
		commandesTermineesMois.value.reduce((sum, c) => sum + c.prix_total, 0),
	);

	/* COMMANDES */
	const commandesMois = computed(() => commandesTermineesMois.value.length);

	/* EN ATTENTE */
	const commandesEnAttente = computed(
		() => commandeStore.commandes.filter((c) => c.statut === "termine").length,
	);

	/* VENTES */
	const ventesMois = computed(() =>
		commandesTermineesMois.value.reduce((sum, c) => {
			c.detailcommandes?.forEach((d) => (sum += d.quantite));
			return sum;
		}, 0),
	);

	/* STOCK */
	const livresDisponibles = computed(() =>
		stockStore.stocks.reduce((sum, s) => sum + s.quantite, 0),
	);

	const livresEnRupture = computed(() => {
		return livreStore.livres.filter((livre) => {
			const stock = stockStore.stocks.find((s) => s.livre_id === livre.id);

			return !stock || stock.quantite === 0;
		}).length;
	});

	/* CLIENTS */
	const totalClients = computed(
		() => adminStore.users.filter((u) => u.role?.role === "user").length,
	);

	/* GRAPH DATA */
	const ventesParJour = computed(() => {
		const days = Array(30).fill(0);

		commandesTermineesMois.value.forEach((c) => {
			const d = new Date(c.created_at);
			const index = d.getDate() - 1;
			c.detailcommandes?.forEach((dc) => {
				days[index] += dc.quantite;
			});
		});

		return days;
	});

	/* INIT CHART */
	const initChart = () => {
		if (!chartRef.value) return;

		if (chart) chart.destroy();

		chart = new Chart(chartRef.value, {
			type: "line",
			data: {
				labels: Array.from({ length: 30 }, (_, i) => `J${i + 1}`),
				datasets: [
					{
						label: "Ventes",
						data: ventesParJour.value,
						borderColor: "#6a0d5f",
						backgroundColor: "rgba(106,13,95,0.1)",
						tension: 0.4,
						fill: true,
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					legend: { display: false },
				},
				scales: {
					y: { beginAtZero: true },
				},
			},
		});
	};

	watch(ventesParJour, initChart);

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
