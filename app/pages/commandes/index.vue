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
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Commandes', to: '/commandes' },
			]"
			title="Commandes"
		/>

		<!-- Header -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Gestion des commandes terminées
			</p>

			<div class="flex flex-wrap gap-3 items-center">
				<!-- Mois -->
				<select
					v-model="selectedMonth"
					class="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100"
				>
					<option v-for="m in months" :key="m.value" :value="m.value">
						{{ m.label }}
					</option>
				</select>

				<!-- Année -->
				<select
					v-model="selectedYear"
					class="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100"
				>
					<option v-for="y in years" :key="y.value" :value="y.value">
						{{ y.label }}
					</option>
				</select>

				<!-- Recherche -->
				<input
					v-model="search"
					type="text"
					placeholder="Référence commande..."
					class="w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100"
				/>
			</div>
		</div>

		<!-- Résumé -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
				<p class="text-sm text-gray-500 dark:text-gray-400">Mois</p>
				<p class="text-xl font-bold text-gray-900 dark:text-gray-100">
					{{ currentMonthLabel }}
				</p>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
				<p class="text-sm text-gray-500 dark:text-gray-400">Montant total</p>
				<p class="text-xl font-bold text-gray-900 dark:text-gray-100">
					{{ totalAmount }} FCFA
				</p>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
				<p class="text-sm text-gray-500 dark:text-gray-400">Commandes</p>
				<p class="text-xl font-bold text-gray-900 dark:text-gray-100">
					{{ searchedRows.length }}
				</p>
			</div>
		</div>

		<!-- Table -->
		<div
			class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md"
		>
			<Vue3Datatable
				:rows="searchedRows"
				:columns="columns"
				:sortable="true"
				:pagination="true"
				:page-size="5"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
			>
				<template #statut="data">
					<span
						class="px-3 py-1 rounded-full text-xs font-semibold"
						:class="
							data.value.statut === 'traite'
								? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
								: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
						"
					>
						{{ data.value.statut === "traite" ? "Traitée" : "En cours" }}
					</span>
				</template>

				<template #actions="data">
					<div class="flex gap-2">
						<button
							@click="openDetails(data.value._raw)"
							class="px-3 py-1 rounded-md text-xs bg-blue-600 hover:bg-blue-700 text-white"
						>
							Détails
						</button>

						<button
							@click="traiterCommande(data.value._raw)"
							:disabled="data.value.statut === 'traite'"
							class="px-3 py-1 rounded text-white text-sm"
							:class="
								data.value.statut === 'traite'
									? 'bg-[#6a0d5f] cursor-not-allowed'
									: 'bg-[#6a0d5f] hover:bg-[#4e0746]'
							"
						>
							{{ data.value.statut === "traite" ? "Déjà traitée" : "Traiter" }}
						</button>
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<div
			v-if="showDetailsModal"
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
			@click.self="showDetailsModal = false"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
			>
				<!-- HEADER avec couleur principale -->
				<div
					class="p-4 bg-gradient-to-r from-[#6a0d5f] to-[#8a1a7a] text-white"
				>
					<div class="flex justify-between items-center">
						<div>
							<svg
								fill="#ffffff"
								width="32px"
								height="32px"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
								<g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								></g>
								<g id="SVGRepo_iconCarrier">
									<path
										d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14H5v-2h6v2zm8-4H5v-2h14v2zm0-4H5V7h14v2z"
									></path>
								</g>
							</svg>
						</div>
						<div>
							<h3 class="text-lg font-bold">
								Commande #{{ selectedCommande.reference }}
							</h3>
							<p class="text-sm text-white/80 mt-1">Détails complets</p>
						</div>
						<button
							@click="showDetailsModal = false"
							class="p-1 hover:bg-white/20 rounded-full transition-colors"
						>
							<svg
								class="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- BODY -->
				<div class="p-6 max-h-[70vh] overflow-y-auto space-y-6">
					<!-- SECTION CLIENT -->
					<div>
						<div class="flex items-center mb-3">
							<div class="p-2 bg-[#6a0d5f]/10 rounded-lg mr-3">
								<svg
									class="w-5 h-5 text-[#6a0d5f] dark:text-purple-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<h4 class="font-bold text-gray-900 dark:text-white">
								Informations client
							</h4>
						</div>

						<div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-500 dark:text-gray-400"
									>Nom complet</span
								>
								<span class="font-medium text-gray-900 dark:text-white">
									{{ selectedCommande.user.prenom }}
									{{ selectedCommande.user.nom }}
								</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-500 dark:text-gray-400"
									>Email</span
								>
								<span class="font-medium text-gray-900 dark:text-white">
									{{ selectedCommande.user.email }}
								</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm text-gray-500 dark:text-gray-400"
									>Téléphone</span
								>
								<span class="font-medium text-gray-900 dark:text-white">
									{{ selectedCommande.user.telephone || "—" }}
								</span>
							</div>
						</div>
					</div>

					<!-- SECTION COMMANDE -->
					<div>
						<div class="flex items-center mb-3">
							<div class="p-2 bg-[#6a0d5f]/10 rounded-lg mr-3">
								<svg
									class="w-5 h-5 text-[#6a0d5f] dark:text-purple-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<h4 class="font-bold text-gray-900 dark:text-white">
								Détails de la commande
							</h4>
						</div>

						<div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
							<!-- Liste des livres -->
							<div class="space-y-3 mb-4">
								<div
									v-for="d in selectedCommande.detailcommandes"
									:key="d.id"
									class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
								>
									<div class="flex-1">
										<p class="font-medium text-gray-900 dark:text-white">
											{{ d.livre.titre }}
										</p>
										<p class="text-sm text-gray-500 dark:text-gray-400">
											{{ d.quantite }} ×
											{{ d.prix_unitaire.toLocaleString() }} FCFA
										</p>
									</div>
									<span class="font-bold text-gray-900 dark:text-white">
										{{ (d.prix_unitaire * d.quantite).toLocaleString() }} FCFA
									</span>
								</div>
							</div>

							<!-- Total -->
							<div class="pt-3 border-t border-gray-300 dark:border-gray-600">
								<div class="flex justify-between items-center">
									<span class="text-lg font-bold text-gray-900 dark:text-white"
										>Total</span
									>
									<span
										class="text-xl font-bold text-[#6a0d5f] dark:text-purple-400"
									>
										{{ selectedCommande.prix_total.toLocaleString() }} FCFA
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- SECTION PAIEMENT -->
					<div>
						<div class="flex items-center mb-3">
							<div class="p-2 bg-[#6a0d5f]/10 rounded-lg mr-3">
								<svg
									class="w-5 h-5 text-[#6a0d5f] dark:text-purple-400"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fill-rule="evenodd"
										d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2a1 1 0 10-2 0v1H4V6a1 1 0 011-1h1a1 1 0 100 2h8z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<h4 class="font-bold text-gray-900 dark:text-white">Paiement</h4>
						</div>

						<div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
							<!-- Méthode de paiement -->
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-500 dark:text-gray-400"
									>Méthode</span
								>
								<div class="flex items-center gap-2">
									<img
										v-if="
											getMoyenPaiementLogo(
												selectedCommande.paiements?.[0]?.moyen_paiement,
											)
										"
										:src="
											getMoyenPaiementLogo(
												selectedCommande.paiements?.[0]?.moyen_paiement,
											)
										"
										alt="Logo PSP"
										class="h-5 w-auto"
									/>
									<span class="font-medium text-gray-900 dark:text-white">
										{{
											getMoyenPaiementLabel(
												selectedCommande.paiements?.[0]?.moyen_paiement,
											)
										}}
									</span>
								</div>
							</div>

							<!-- Référence transaction -->
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-500 dark:text-gray-400"
									>Référence</span
								>
								<span class="font-medium text-gray-900 dark:text-white">
									{{
										selectedCommande.paiements?.[0]?.reference_transaction ||
										"—"
									}}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- FOOTER -->
				<div
					class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
				>
					<div class="flex justify-end">
						<button
							@click="showDetailsModal = false"
							class="px-5 py-2.5 bg-[#6a0d5f] hover:bg-[#5a0b50] dark:bg-[#6a0d5f] dark:hover:bg-[#7a1f6a] text-white rounded-lg font-medium transition-colors"
						>
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";
	import Swal from "sweetalert2";
	import { useCommandeStore } from "~~/stores/commande";
	import { useGatewayStore } from "~~/stores/gateway";

	const gatewayStore = useGatewayStore();
	const isPageLoading = ref(true);

	/* STORE */
	const commandeStore = useCommandeStore();

	/* DATE COURANTE */
	const now = new Date();
	const selectedMonth = ref(String(now.getMonth() + 1).padStart(2, "0"));
	const selectedYear = ref(String(now.getFullYear()));
	const search = ref("");

	/* MOIS */
	const months = [
		{ label: "Janvier", value: "01" },
		{ label: "Février", value: "02" },
		{ label: "Mars", value: "03" },
		{ label: "Avril", value: "04" },
		{ label: "Mai", value: "05" },
		{ label: "Juin", value: "06" },
		{ label: "Juillet", value: "07" },
		{ label: "Août", value: "08" },
		{ label: "Septembre", value: "09" },
		{ label: "Octobre", value: "10" },
		{ label: "Novembre", value: "11" },
		{ label: "Décembre", value: "12" },
	];

	/* ANNÉES DYNAMIQUES */
	const years = computed(() => {
		const uniqueYears = new Set(
			commandeStore.commandes.map((c) => new Date(c.created_at).getFullYear()),
		);

		return Array.from(uniqueYears)
			.sort((a, b) => b - a)
			.map((y) => ({
				label: String(y),
				value: String(y),
			}));
	});

	/* COLONNES */
	const columns = [
		{ field: "reference", title: "Commande", sortable: true },
		{ field: "client", title: "Client", sortable: true },
		{ field: "date", title: "Date", sortable: true },
		{ field: "heure", title: "Heure", sortable: true },
		{ field: "montant", title: "Montant", sortable: true },
		{ field: "statut", title: "Statut" },
		{ field: "actions", title: "Actions" },
	];

	/* ROWS */
	const rows = computed(() =>
		commandeStore.commandes
			.filter((c) => ["termine", "traite"].includes(c.statut))
			.map((c) => {
				const d = new Date(c.created_at);

				return {
					reference: c.reference,
					client: `${c.user?.prenom ?? ""} ${c.user?.nom ?? ""}`,
					date: d.toLocaleDateString("fr-FR"),
					heure: d.toLocaleTimeString("fr-FR", {
						hour: "2-digit",
						minute: "2-digit",
					}),
					montant: c.prix_total,
					month: String(d.getMonth() + 1).padStart(2, "0"),
					year: String(d.getFullYear()),
					statut: c.statut,
					_raw: c,
				};
			}),
	);

	const getMoyenPaiementLabel = (moyen) => {
		if (!moyen) return "-";

		const gateway = gatewayStore.gatewayMap[moyen];
		if (!gateway) return moyen;

		return gateway.libelle;
	};

	const getMoyenPaiementLogo = (moyen) => {
		const gateway = gatewayStore.gatewayMap[moyen];
		return gateway?.logo_url ?? null;
	};

	/* FILTRES */
	const filteredRows = computed(() =>
		rows.value.filter(
			(r) => r.month === selectedMonth.value && r.year === selectedYear.value,
		),
	);

	const searchedRows = computed(() =>
		filteredRows.value.filter((r) =>
			r.reference.toLowerCase().includes(search.value.toLowerCase()),
		),
	);

	const totalAmount = computed(() =>
		filteredRows.value.reduce((s, r) => s + r.montant, 0).toLocaleString(),
	);

	const currentMonthLabel = computed(
		() => months.find((m) => m.value === selectedMonth.value)?.label,
	);

	/* MODAL */
	const showDetailsModal = ref(false);
	const selectedCommande = ref(null);

	const openDetails = (commande) => {
		selectedCommande.value = commande;
		showDetailsModal.value = true;
	};

	/* TRAITER */
	const traiterCommande = async (commande) => {
		const res = await Swal.fire({
			title: "Confirmation",
			text: `Traiter définitivement la commande ${commande.reference} ?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Oui, traiter",
			cancelButtonText: "Annuler",
		});

		if (res.isConfirmed) {
			await commandeStore.traiterCommande(commande.id);
			await commandeStore.fetchAllOrders();
			Swal.fire("Succès", "Commande traitée avec succès", "success");
		}
	};

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
