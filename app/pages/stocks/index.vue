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
				:rows="filteredRows"
				:columns="columns"
				:pagination="true"
				:page-size="5"
				:sortable="true"
				:loading="stockStore.loading"
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
				<template #livre="data">
					<div class="flex items-center gap-3">
						<img
							:src="data.value.image"
							class="w-10 h-14 object-cover rounded-md border"
						/>
						<span class="font-medium">
							{{ data.value.titre }}
						</span>
					</div>
				</template>

				<!-- Type mouvement -->
				<template #type="data">
					<span
						:class="[
							'px-3 py-1 rounded-full text-xs font-semibold',
							data.value.type === 'Entrée'
								? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
								: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
						]"
					>
						{{ data.value.type }}
					</span>
				</template>

				<!-- Actions -->
				<template #actions="data">
					<button
						@click="openDetails(data.value)"
						class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs"
					>
						Détails
					</button>
				</template>
			</Vue3Datatable>
		</div>

		<!-- MODAL DETAILS MOUVEMENT -->
		<div
			v-if="showDetailModal"
			class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl"
			>
				<!-- HEADER -->
				<div
					class="flex justify-between items-center p-5 border-b dark:border-gray-700"
				>
					<h3 class="text-lg font-bold">Détails du mouvement</h3>
					<button
						@click="showDetailModal = false"
						class="text-gray-500 hover:text-red-500 text-xl"
					>
						&times;
					</button>
				</div>

				<!-- BODY -->
				<div
					class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto"
				>
					<!-- IMAGE LIVRE -->
					<div class="md:col-span-1 flex justify-center items-start">
						<img
							:src="selectedMouvement.image"
							:alt="selectedMouvement.titre"
							class="w-40 h-56 object-cover rounded-xl border"
						/>
					</div>

					<!-- INFOS MOUVEMENT -->
					<div class="md:col-span-2 space-y-4 text-sm">
						<div>
							<span class="font-semibold">Livre :</span>
							<p class="text-gray-700 dark:text-gray-300">
								{{ selectedMouvement.titre }}
							</p>
						</div>

						<div>
							<span class="font-semibold">Type :</span>
							<p>{{ selectedMouvement.type }}</p>
						</div>

						<div>
							<span class="font-semibold">Quantité :</span>
							<p>{{ selectedMouvement.quantite }}</p>
						</div>

						<div>
							<span class="font-semibold">Date :</span>
							<p>{{ selectedMouvement.date }}</p>
						</div>

						<div>
							<span class="font-semibold">Heure :</span>
							<p>{{ selectedMouvement.heure }}</p>
						</div>

						<div v-if="selectedMouvement.commentaire">
							<span class="font-semibold">Commentaire :</span>
							<p class="whitespace-pre-line">
								{{ selectedMouvement.commentaire }}
							</p>
						</div>
					</div>
				</div>

				<!-- FOOTER -->
				<div class="p-4 border-t dark:border-gray-700 text-right">
					<button
						@click="showDetailModal = false"
						class="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
					>
						Fermer
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";
	import { useStockStore } from "~~/stores/stock";
	import { useLivreStore } from "~~/stores/livre";
	const livreStore = useLivreStore();

	const stockStore = useStockStore();

	/* UI */
	const search = ref("");
	const isDropdownOpen = ref(false);
	const isPageLoading = ref(true);

	/* Tri */
	const sortColumn = ref("date");
	const sortDirection = ref("ascc");

	/* Colonnes */
	const allColumns = ref([
		{ field: "livre", title: "Livre", sortable: true, visible: true },
		{ field: "type", title: "Type", sortable: true, visible: true },
		{ field: "quantite", title: "Quantité", sortable: true, visible: true },
		{ field: "date", title: "Date", sortable: true, visible: true },
		{ field: "heure", title: "Heure", sortable: true, visible: true },
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	const columns = computed(() => allColumns.value.filter((c) => c.visible));

	/* Rows dynamiques */
	const rows = computed(() =>
		(stockStore.mouvements ?? []).map((m) => ({
			id: m.id,
			titre: m.livre?.titre ?? "—",
			image: m.livre ? livreStore.getCoverImage(m.livre) : "/images/livre.jpg",
			type: m.type === "entree" ? "Entrée" : "Sortie",
			quantite: m.quantite,
			date: new Date(m.created_at).toLocaleDateString(),
			heure: new Date(m.created_at).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			commentaire: m.commentaire,
		})),
	);

	/* Recherche sur titre du livre */
	const filteredRows = computed(() =>
		rows.value.filter((r) =>
			r.titre.toLowerCase().includes(search.value.toLowerCase()),
		),
	);

	/* Actions */
	const selectedMouvement = ref<any>(null);
	const showDetailModal = ref(false);

	const openDetails = (row: any) => {
		selectedMouvement.value = row;
		showDetailModal.value = true;
	};

	/* Dropdown */
	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* Lifecycle */
	const handleClickOutside = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest(".relative")) closeDropdown();
	};

	onMounted(async () => {
		await stockStore.fetchAllMouvements();
		window.addEventListener("click", handleClickOutside);
	});

	onUnmounted(() => {
		window.removeEventListener("click", handleClickOutside);
	});
</script>
