<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Stocks', to: '/stocks' },
			]"
			title="Mouvements de stock"
		/>

		<!-- Header actions -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Historique des mouvements de stock
			</p>

			<div class="flex items-center gap-3">
				<!-- Menu Colonnes -->
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
						class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
					>
						<div class="py-1">
							<label
								v-for="col in allColumns"
								:key="col.field"
								class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
							>
								<input
									type="checkbox"
									v-model="col.visible"
									class="rounded text-[#6a0d5f] focus:ring-[#6a0d5f]"
								/>
								{{ col.title }}
							</label>
						</div>
					</div>
				</div>

				<!-- Recherche -->
				<input
					v-model="search"
					type="text"
					placeholder="Rechercher un mouvement..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]"
				/>

				<!-- Bouton Ajouter -->
				<NuxtLink
					to="/stocks/mouvements"
					class="px-4 py-2 rounded-lg bg-[#6a0d5f] text-white text-sm font-medium hover:opacity-90 transition"
				>
					+ Nouveau mouvement
				</NuxtLink>
			</div>
		</div>

		<!-- Table -->
		<div
			class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md"
		>
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
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
			>
				<!-- Livre (image + titre) -->
				<template #livre="row">
					<div class="flex items-center gap-3">
						<img
							:src="row.value.livre.image"
							alt="Livre"
							class="w-10 h-14 object-cover rounded-md border border-gray-300 dark:border-gray-600"
						/>
						<span class="font-medium">
							{{ row.value.livre.titre }}
						</span>
					</div>
				</template>

				<!-- Type mouvement -->
				<template #type="row">
					<span
						:class="[
							'px-3 py-1 rounded-full text-xs font-semibold',
							row.value.type === 'Entrée'
								? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
								: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
						]"
					>
						{{ row.value.type }}
					</span>
				</template>

				<!-- Actions -->
				<template #actions="{ row }">
					<button
						class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700"
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

	/* Tri */
	const sortColumn = ref("date");
	const sortDirection = ref("desc");

	/* Dropdown Colonnes */
	const isDropdownOpen = ref(false);
	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* Colonnes */
	const allColumns = ref([
		{ field: "livre", title: "Livre", sortable: true, visible: true },
		{
			field: "type",
			title: "Type de mouvement",
			sortable: true,
			visible: true,
		},
		{ field: "quantite", title: "Quantité", sortable: true, visible: true },
		{ field: "date", title: "Date", sortable: true, visible: true },
		{ field: "heure", title: "Heure", sortable: true, visible: true },
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	const columns = computed(() => allColumns.value.filter((col) => col.visible));

	/* Données statiques */
	const rows = [
		{
			id: 1,
			livre: {
				titre: "L'enfant noir",
				image: "/livre.jpg",
			},
			type: "Entrée",
			quantite: 10,
			date: "05/02/2026",
			heure: "10:30",
		},
		{
			id: 2,
			livre: {
				titre: "Mathématiques 3e",
				image: "/livre.jpg",
			},
			type: "Sortie",
			quantite: 3,
			date: "04/02/2026",
			heure: "16:45",
		},
		{
			id: 3,
			livre: {
				titre: "Physique 2e",
				image: "/livre.jpg",
			},
			type: "Entrée",
			quantite: 7,
			date: "03/02/2026",
			heure: "09:10",
		},
	];

	/* Ferme dropdown */
	onMounted(() => {
		window.addEventListener("click", (e) => {
			if (!e.target.closest(".relative")) closeDropdown();
		});
	});
	onUnmounted(() => window.removeEventListener("click", closeDropdown));
</script>
