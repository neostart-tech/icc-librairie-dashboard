<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Utilisateurs', to: '/utilisateurs' },
			]"
			title="Utilisateurs"
		/>

		<!-- Header -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Gestion des utilisateurs
			</p>

			<div class="flex flex-wrap items-center gap-3">
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
						class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
					>
						<label
							v-for="col in allColumns"
							:key="col.field"
							class="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							<input type="checkbox" v-model="col.visible" />
							{{ col.title }}
						</label>
					</div>
				</div>

				<!-- Recherche -->
				<input
					v-model="search"
					type="text"
					placeholder="Rechercher un utilisateur..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 text-sm"
				/>
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
				:pagination="true"
				:page-size="5"
				:sortable="true"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
			>
				<!-- Statut -->
				<template #statut="data">
					<span
						:class="[
							'px-3 py-1 rounded-full text-xs font-semibold',
							data.value.statut === 'Actif'
								? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
								: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
						]"
					>
						{{ data.value.statut }}
					</span>
				</template>

				<!-- Actions -->
				<template #actions="data">
					<div class="flex gap-2">
						<button
							class="px-3 py-1 rounded-md text-xs bg-blue-600 hover:bg-blue-700 text-white"
						>
							Détails
						</button>

						<button
							v-if="data.value.statut === 'Actif'"
							class="px-3 py-1 rounded-md text-xs bg-red-500 hover:bg-red-600 text-white"
						>
							Bloquer
						</button>

						<button
							v-else
							class="px-3 py-1 rounded-md text-xs bg-green-500 hover:bg-green-600 text-white"
						>
							Activer
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

	const search = ref("");
	const isDropdownOpen = ref(false);

	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	const allColumns = ref([
		{ field: "nom", title: "Nom & Prénoms", sortable: true, visible: true },
		{ field: "email", title: "Email", sortable: true, visible: true },
		{ field: "telephone", title: "Téléphone", sortable: true, visible: true },
		{
			field: "date",
			title: "Date d'inscription",
			sortable: true,
			visible: true,
		},
		{
			field: "type",
			title: "Type d'utilisateur",
			sortable: true,
			visible: true,
		},
		{
			field: "statut",
			title: "Statut",
			sortable: true,
			visible: true,
			isSlot: true,
		},
		{
			field: "actions",
			title: "Actions",
			sortable: false,
			visible: true,
			isSlot: true,
		},
	]);

	const columns = computed(() => allColumns.value.filter((c) => c.visible));

	/* Données statiques */
	const rows = [
		{
			nom: "Jean Paul",
			email: "jean@mail.com",
			telephone: "90112233",
			date: "02/02/2026",
			type: "Compte synchronisé à l'app mobile",
			statut: "Actif",
		},
		{
			nom: "Anne Marie",
			email: "marie@mail.com",
			telephone: "99887766",
			date: "01/02/2026",
			type: "Compte créé sur le site de la librairie",
			statut: "Bloqué",
		},
	];

	onMounted(() => {
		window.addEventListener("click", (e) => {
			if (!e.target.closest(".relative")) closeDropdown();
		});
	});
	onUnmounted(() => window.removeEventListener("click", closeDropdown));
</script>
