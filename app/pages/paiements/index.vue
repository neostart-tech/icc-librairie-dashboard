<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Paiements', to: '/paiements' },
			]"
			title="Paiements"
		/>

		<!-- Header actions -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Gestion des paiements
			</p>

			<div class="flex flex-wrap items-center gap-3">
				<!-- Mois -->
				<select
					v-model="selectedMonth"
					class="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 text-sm"
				>
					<option v-for="m in months" :key="m.value" :value="m.value">
						{{ m.label }}
					</option>
				</select>

				<!-- Colonnes -->
				<div class="relative inline-block text-left">
					<button
						@click="toggleDropdown"
						class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm flex items-center gap-1"
					>
						Colonnes
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					<div
						v-if="isDropdownOpen"
						class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
					>
						<label
							v-for="col in allColumns"
							:key="col.field"
							class="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							<input
								type="checkbox"
								v-model="col.visible"
								class="rounded text-[#6a0d5f]"
							/>
							{{ col.title }}
						</label>
					</div>
				</div>

				<!-- Recherche -->
				<input
					v-model="search"
					type="text"
					placeholder="Rechercher un paiement..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 text-sm"
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
				<p class="text-sm text-gray-500 dark:text-gray-400">Montant encaissé</p>
				<p class="text-xl font-bold text-gray-900 dark:text-gray-100">
					{{ totalAmount }} FCFA
				</p>
			</div>

			<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Nombre de paiements
				</p>
				<p class="text-xl font-bold text-gray-900 dark:text-gray-100">
					{{ paymentCount }}
				</p>
			</div>
		</div>

		<!-- Table -->
		<div
			class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md"
		>
			<Vue3Datatable
				:rows="filteredRows"
				:columns="columns"
				:search-text="search"
				:sortable="true"
				:pagination="true"
				:page-size="5"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2 text-gray-700 dark:text-gray-200'"
			>
				<!-- Statut -->
				<template #statut="data">
					<span
						class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
					>
						{{ data.value.statut }}
					</span>
				</template>

				<!-- Actions -->
				<template #actions>
					<button
						class="px-3 py-1 rounded-md text-xs bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
					>
						Détails
					</button>
				</template>
			</Vue3Datatable>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";

	/* Recherche */
	const search = ref("");

	/* Mois */
	const months = [
		{ label: "Janvier", value: "01" },
		{ label: "Février", value: "02" },
	];
	const selectedMonth = ref("02");

	/* Dropdown Colonnes */
	const isDropdownOpen = ref(false);
	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* Colonnes */
	const allColumns = ref([
		{ field: "reference", title: "Référence", sortable: true, visible: true },
		{ field: "client", title: "Client", sortable: true, visible: true },
		{ field: "date", title: "Date", sortable: true, visible: true },
		{ field: "heure", title: "Heure", sortable: true, visible: true },
		{ field: "montant", title: "Montant", sortable: true, visible: true },
		{ field: "methode", title: "Méthode", sortable: true, visible: true },
		{ field: "statut", title: "Statut", sortable: true, visible: true },
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	const columns = computed(() => allColumns.value.filter((c) => c.visible));

	/* Données statiques */
	const rows = [
		{
			reference: "PAY-001",
			client: "Jean Paul",
			date: "02/02/2026",
			heure: "14:35",
			montant: 12000,
			methode: "Mobile Money",
			statut: "Payé",
			month: "02",
		},
		{
			reference: "PAY-002",
			client: "Ana Maria",
			date: "01/02/2026",
			heure: "09:20",
			montant: 9000,
			methode: "Carte bancaire",
			statut: "Payé",
			month: "02",
		},
	];

	const filteredRows = computed(() =>
		rows
			.filter((r) => r.month === selectedMonth.value)
			.map((r) => ({
				...r,
				montant: `${r.montant.toLocaleString()} FCFA`,
			})),
	);

	const totalAmount = computed(() =>
		rows
			.filter((r) => r.month === selectedMonth.value)
			.reduce((sum, r) => sum + r.montant, 0)
			.toLocaleString(),
	);

	const paymentCount = computed(
		() => rows.filter((r) => r.month === selectedMonth.value).length,
	);

	const currentMonthLabel = computed(
		() => months.find((m) => m.value === selectedMonth.value)?.label,
	);

	/* Fermer dropdown clic extérieur */
	onMounted(() => {
		window.addEventListener("click", (e) => {
			if (!e.target.closest(".relative")) closeDropdown();
		});
	});
	onUnmounted(() => window.removeEventListener("click", closeDropdown));
</script>
