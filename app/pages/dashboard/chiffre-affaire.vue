<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Chiffre d’affaires', to: null },
			]"
			title="Chiffre d'affaires du mois"
		/>

		<!-- Filtres -->
		<div
			class="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between"
		>
			<div class="flex gap-4">
				<div>
					<label class="text-sm text-gray-600 dark:text-gray-300">Mois</label>
					<select
						v-model="selectedMonth"
						class="mt-1 w-40 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
					>
						<option>Janvier</option>
						<option>Février</option>
						<option>Mars</option>
						<option>Avril</option>
						<option>Mai</option>
						<option>Juin</option>
						<option>Juillet</option>
						<option>Août</option>
						<option>Septembre</option>
						<option>Octobre</option>
						<option>Novembre</option>
						<option>Décembre</option>
					</select>
				</div>

				<div>
					<label class="text-sm text-gray-600 dark:text-gray-300">Année</label>
					<select
						v-model="selectedYear"
						class="mt-1 w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
					>
						<option>2025</option>
						<option>2026</option>
						<option>2027</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<div
				class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow"
			>
				<p class="text-sm text-gray-500 dark:text-gray-400">Total du mois</p>
				<p class="text-xl font-bold text-gray-800 dark:text-white mt-1">
					1 397 164 FCFA
				</p>
			</div>

			<div
				class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow"
			>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Nombre de commandes
				</p>
				<p class="text-xl font-bold text-gray-800 dark:text-white mt-1">10</p>
			</div>

			<div
				class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow"
			>
				<p class="text-sm text-gray-500 dark:text-gray-400">Moyenne par jour</p>
				<p class="text-xl font-bold text-gray-800 dark:text-white mt-1">
					49 899 FCFA
				</p>
			</div>

			<div
				class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow"
			>
				<p class="text-sm text-gray-500 dark:text-gray-400">Mois</p>
				<p class="text-xl font-bold text-gray-800 dark:text-white mt-1">
					{{ selectedMonth }} {{ selectedYear }}
				</p>
			</div>
		</div>

		<!-- Graphique -->
		<div
			class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow"
		>
			<h3 class="text-sm font-semibold text-gray-700 dark:text-white mb-4">
				Ventes par jour - {{ selectedMonth }} {{ selectedYear }}
			</h3>

			<div class="h-64 flex items-end gap-2">
				<div
					v-for="day in 28"
					:key="day"
					class="flex-1 bg-purple-600 dark:bg-purple-500 rounded-t-lg transition-all"
					:style="{ height: randomHeight() }"
					:title="`Jour ${day}`"
				></div>
			</div>

			<div
				class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400"
			>
				<span v-for="d in 7" :key="d">{{ d * 4 }}</span>
			</div>
		</div>

		<!-- Tableau commandes -->
		<div
			class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md"
		>
			<!-- Header tableau -->
			<div
				class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4"
			>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Commandes du mois sélectionné
				</p>

				<div class="flex items-center gap-3">
					<!-- Colonnes -->
					<div class="relative inline-block text-left">
						<button
							@click="toggleDropdown"
							class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1"
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
							class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
						>
							<label
								v-for="col in allColumns"
								:key="col.field"
								class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
							>
								<input
									type="checkbox"
									v-model="col.visible"
									class="rounded text-purple-600 focus:ring-purple-600"
								/>
								{{ col.title }}
							</label>
						</div>
					</div>

					<!-- Recherche -->
					<input
						v-model="search"
						type="text"
						placeholder="Rechercher une commande..."
						class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
					/>
				</div>
			</div>

			<Vue3Datatable
				:rows="rows"
				:columns="columns"
				:search-text="search"
				:sortable="true"
				:pagination="true"
				:page-size="5"
				:sort-column="sortColumn"
				:sort-direction="sortDirection"
				@update:sort-column="sortColumn = $event"
				@update:sort-direction="sortDirection = $event"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
			/>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";

	const selectedMonth = ref("Février");
	const selectedYear = ref("2026");

	/* Recherche */
	const search = ref("");

	/* Tri */
	const sortColumn = ref("reference");
	const sortDirection = ref("asc");

	/* Dropdown Colonnes */
	const isDropdownOpen = ref(false);
	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* Colonnes avec visibilité */
	const allColumns = ref([
		{ field: "reference", title: "Commande", sortable: true, visible: true },
		{ field: "client", title: "Client", sortable: true, visible: true },
		{ field: "date", title: "Date", sortable: true, visible: true },
		{ field: "heure", title: "Heure", sortable: true, visible: true },
		{ field: "montant", title: "Montant", sortable: true, visible: true },
		{ field: "statut", title: "Statut", sortable: true, visible: true },
	]);

	/* Colonnes visibles */
	const columns = computed(() => allColumns.value.filter((col) => col.visible));

	/* Fermer dropdown au clic extérieur */
	onMounted(() => {
		window.addEventListener("click", (e) => {
			if (!e.target.closest(".relative")) closeDropdown();
		});
	});
	onUnmounted(() => window.removeEventListener("click", closeDropdown));

	// Données commandes
	const rows = ref([
		{
			reference: "#CMD001",
			client: "Jean Paul",
			date: "02/02/2026",
			heure: "14:30",
			montant: "120 000 FCFA",
			statut: "Validée",
		},
		{
			reference: "#CMD002",
			client: "Anne Marie",
			date: "05/02/2026",
			heure: "09:15",
			montant: "89 500 FCFA",
			statut: "Validée",
		},
	]);

	// Hauteur aléatoire (mock graphique)
	const randomHeight = () => `${Math.floor(Math.random() * 60 + 20)}%`;
</script>
