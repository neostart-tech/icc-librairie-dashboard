<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Livres', to: '/livres' },
			]"
			title="Livres"
		/>

		<!-- Header actions -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">Gestion des livres</p>

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
						class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
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
					placeholder="Rechercher un livre..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]"
				/>

				<!-- Bouton Ajouter -->
				<NuxtLink
					to="/livres/ajouter"
					class="px-4 py-2 rounded-lg bg-[#6a0d5f] text-white text-sm font-medium hover:opacity-90 transition"
				>
					+ Ajouter un livre
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
				<template #image>
					<img
						src="/livre.jpg"
						alt="Livre"
						class="w-12 h-16 object-cover rounded-md border"
					/>
				</template>

				<!-- Slot Actions -->
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
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";

	/* Recherche */
	const search = ref("");

	/* Tri */
	const sortColumn = ref("titre");
	const sortDirection = ref("asc");

	/* Modal */
	const showModal = ref(false);

	/* Dropdown Colonnes */
	const isDropdownOpen = ref(false);
	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* Colonnes avec visibilité et slots */
	const allColumns = ref([
		{ field: "image", title: "Image", sortable: false, visible: true },
		{ field: "titre", title: "Titre", sortable: true, visible: true },
		{ field: "auteur", title: "Auteur", sortable: true, visible: true },
		{ field: "categorie", title: "Catégorie", sortable: true, visible: true },
		{ field: "prix", title: "Prix", sortable: true, visible: true },
		{ field: "stock", title: "Stock", sortable: true, visible: true },
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	/* Colonnes visibles pour le tableau */
	const columns = computed(() => allColumns.value.filter((col) => col.visible));

	/* Données statiques */
	const rows = [
		{
			id: 1,
			image: "/livre.jpg",
			titre: "L'enfant noir",
			auteur: "Camara Laye",
			categorie: "Romans",
			prix: 3500,
			stock: 12,
		},
		{
			id: 2,
			image: "/livre.jpg",
			titre: "Mathématiques 3e",
			auteur: "Collectif",
			categorie: "Manuels scolaires",
			prix: 2500,
			stock: 0,
		},
		{
			id: 3,
			image: "/livre.jpg",
			titre: "Physique 2e",
			auteur: "Dupont",
			categorie: "Sciences",
			prix: 3000,
			stock: 5,
		},
	];

	/* Ferme dropdown si clic ailleurs */
	onMounted(() => {
		window.addEventListener("click", (e) => {
			if (!e.target.closest(".relative")) closeDropdown();
		});
	});
	onUnmounted(() => window.removeEventListener("click", closeDropdown));
</script>
