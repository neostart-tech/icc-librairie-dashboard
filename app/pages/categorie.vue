<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Catégories', to: '/categorie' },
			]"
			title="Catégories"
		/>

		<!-- Header actions -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Gestion des catégories de livres
			</p>

			<div class="flex items-center gap-3">
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

					<!-- Menu déroulant -->
					<div
						v-if="isDropdownOpen"
						class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
					>
						<div class="py-1">
							<label
								v-for="col in visibleColumns"
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
					placeholder="Rechercher..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]"
				/>

				<button
					@click="showModal = true"
					class="px-4 py-2 rounded-lg bg-[#6a0d5f] text-white text-sm font-medium hover:opacity-90 transition"
				>
					+ Ajouter
				</button>
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
				:sort-column="sortColumn"
				:sort-direction="sortDirection"
				:sortable="true"
				:pagination="true"
				:page-size="5"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
				@update:sort-column="sortColumn = $event"
				@update:sort-direction="sortDirection = $event"
			>
				<template #actions="{ row }">
					<div class="flex gap-2">
						<button
							class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700"
						>
							Modifier
						</button>
						<button
							class="px-3 py-1 rounded-md bg-red-600 text-white text-xs hover:bg-red-700"
						>
							Supprimer
						</button>
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<!-- Modal -->
		<div
			v-if="showModal"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		>
			<div
				class="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-lg p-6 space-y-4"
			>
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white">
					Ajouter une catégorie
				</h3>

				<div>
					<label class="text-sm text-gray-600 dark:text-gray-300">
						Nom de la catégorie
					</label>
					<input
						type="text"
						class="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]"
					/>
				</div>

				<div>
					<label class="text-sm text-gray-600 dark:text-gray-300">
						Description
					</label>
					<textarea
						rows="3"
						class="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]"
					/>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<button
						@click="showModal = false"
						class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						Annuler
					</button>
					<button class="px-4 py-2 text-sm rounded-lg bg-[#6a0d5f] text-white">
						Enregistrer
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted } from "vue";

	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";

	/* Recherche */
	const search = ref("");

	const sortColumn = ref("name");
	const sortDirection = ref("asc");

	/* Modal */
	const showModal = ref(false);

	/* Colonnes (tri OK) */
	const visibleColumns = ref([
		{ field: "name", title: "Nom", sortable: true, visible: true },
		{
			field: "description",
			title: "Description",
			sortable: true,
			visible: true,
		},
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	const columns = computed(() =>
		visibleColumns.value.filter((col) => col.visible),
	);

	const isDropdownOpen = ref(false);

	const toggleDropdown = () => {
		isDropdownOpen.value = !isDropdownOpen.value;
	};

	// Ferme le dropdown si on clique ailleurs
	const closeDropdown = () => {
		isDropdownOpen.value = false;
	};

	onMounted(() => {
		window.addEventListener("click", (e) => {
			if (!e.target.closest(".relative")) {
				closeDropdown();
			}
		});
	});

	onUnmounted(() => {
		window.removeEventListener("click", closeDropdown);
	});

	/* Données statiques */
	const rows = [
		{
			id: 1,
			name: "Romans",
			description: "Romans africains et internationaux",
		},
		{ id: 2, name: "Manuels scolaires", description: "Livres éducatifs" },
		{ id: 3, name: "Sciences", description: "Ouvrages scientifiques" },
		{ id: 4, name: "Religion", description: "Livres religieux" },
	];
</script>
