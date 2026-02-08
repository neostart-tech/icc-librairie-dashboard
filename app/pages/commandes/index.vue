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
				<template #statut>
					<span
						class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
					>
						En cours
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
							class="px-3 py-1 rounded-md text-xs bg-[#6a0d5f] hover:opacity-90 text-white"
						>
							Traiter
						</button>
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<!-- MODAL DETAILS -->
		<div
			v-if="showDetailsModal"
			class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
		>
			<div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
				<h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
					Commande {{ selectedCommande.reference }}
				</h3>

				<!-- USER -->
				<div class="mb-4">
					<h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">
						Informations client
					</h4>
					<p class="text-sm text-gray-700 dark:text-gray-300">
						Nom :
						<strong>
							{{ selectedCommande.user.prenom }}
							{{ selectedCommande.user.nom }}
						</strong>
					</p>
					<p class="text-sm text-gray-700 dark:text-gray-300">
						Email : {{ selectedCommande.user.email }}
					</p>
					<p class="text-sm text-gray-700 dark:text-gray-300">
						Téléphone : {{ selectedCommande.user.telephone || "-" }}
					</p>
				</div>

				<!-- LIVRES -->
				<div class="mb-4">
					<h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">
						Détails de la commande
					</h4>
					<ul class="space-y-2">
						<li
							v-for="d in selectedCommande.detailcommandes"
							:key="d.id"
							class="flex justify-between text-sm text-gray-700 dark:text-gray-300"
						>
							<span> {{ d.livre.titre }} × {{ d.quantite }} </span>
							<span>
								{{ (d.prix_unitaire * d.quantite).toLocaleString() }} FCFA
							</span>
						</li>
					</ul>

					<p
						class="mt-2 text-sm font-semibold text-right text-gray-900 dark:text-gray-100"
					>
						Total :
						{{ selectedCommande.prix_total.toLocaleString() }} FCFA
					</p>
				</div>

				<!-- PAIEMENT -->
				<div class="mb-4">
					<h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">
						Paiement
					</h4>

					<div class="flex items-center gap-2 mb-1">
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
							class="h-6 w-auto"
						/>
						<p class="text-sm text-gray-700 dark:text-gray-300">
							Méthode :
							<strong>
								{{
									getMoyenPaiementLabel(
										selectedCommande.paiements?.[0]?.moyen_paiement,
									)
								}}
							</strong>
						</p>
					</div>

					<p class="text-sm text-gray-700 dark:text-gray-300">
						Référence :
						{{ selectedCommande.paiements?.[0]?.reference_transaction || "-" }}
					</p>

					<p class="text-sm text-gray-700 dark:text-gray-300">
						Statut :
						{{ selectedCommande.paiements?.[0]?.statut || "-" }}
					</p>
				</div>

				<div class="flex justify-end">
					<button
						@click="showDetailsModal = false"
						class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
					>
						Fermer
					</button>
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
			.filter((c) => c.statut === "termine")
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
					statut: "En cours",
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
