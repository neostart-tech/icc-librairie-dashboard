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
					placeholder="Rechercher un livre..."
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
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
			@click.self="showDetailModal = false"
		>
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
			>
				<!-- HEADER avec couleur principale -->
				<div class="p-4 bg-[#6a0d5f] text-white">
					<div class="flex justify-between items-center">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-white/20 rounded-lg">
								<svg
									class="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
									/>
								</svg>
							</div>
							<h3 class="text-lg font-bold">Détails du mouvement</h3>
						</div>
						<button
							@click="showDetailModal = false"
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
				<div class="p-6">
					<div class="flex flex-col md:flex-row gap-6">
						<!-- COLONNE GAUCHE - Image et infos principales -->
						<div class="md:w-1/3">
							<!-- Image du livre -->
							<div class="mb-4">
								<div class="relative">
									<img
										:src="selectedMouvement.image"
										:alt="selectedMouvement.titre"
										class="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
									/>
									<!-- Badge type -->
									<div class="absolute -top-2 -right-2">
										<span
											:class="
												selectedMouvement.type === 'Entrée'
													? 'bg-green-500'
													: 'bg-red-500'
											"
											class="text-white text-xs font-bold px-3 py-1 rounded-full shadow"
										>
											{{
												selectedMouvement.type === "Entrée"
													? "ENTRÉE"
													: "SORTIE"
											}}
										</span>
									</div>
								</div>
								<!-- Titre du livre -->
								<div class="mt-3">
									<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
										Livre
									</p>
									<p class="font-medium text-gray-900 dark:text-white truncate">
										{{ selectedMouvement.titre }}
									</p>
								</div>
							</div>

							<!-- Carte info quantité -->
							<div
								class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
							>
								<div class="text-center">
									<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
										Quantité
									</p>
									<div class="flex items-center justify-center">
										<div
											:class="
												selectedMouvement.type === 'Entrée'
													? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
													: 'bg-blue-100 text-red-800 dark:bg-blue-900/30 dark:text-red-300'
											"
											class="px-4 py-2 rounded-lg font-bold text-lg"
										>
											{{ selectedMouvement.quantite }}
											<span class="text-sm ml-1">
												{{
													selectedMouvement.quantite > 1 ? "unités" : "unité"
												}}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<!-- COLONNE DROITE - Détails du mouvement -->
						<div class="md:w-2/3">
							<!-- Grille d'informations -->
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<!-- Date -->
								<div class="space-y-2">
									<div
										class="flex items-center text-gray-500 dark:text-gray-400"
									>
										<svg
											class="w-4 h-4 mr-2"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
												clip-rule="evenodd"
											/>
										</svg>
										<span class="text-sm font-medium">Date</span>
									</div>
									<p class="text-gray-900 dark:text-white font-medium">
										{{ selectedMouvement.date }}
									</p>
								</div>

								<!-- Heure -->
								<div class="space-y-2">
									<div
										class="flex items-center text-gray-500 dark:text-gray-400"
									>
										<svg
											class="w-4 h-4 mr-2"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
												clip-rule="evenodd"
											/>
										</svg>
										<span class="text-sm font-medium">Heure</span>
									</div>
									<p class="text-gray-900 dark:text-white font-medium">
										{{ selectedMouvement.heure }}
									</p>
								</div>
							</div>

							<!-- Commentaire -->
							<div v-if="selectedMouvement.commentaire" class="space-y-3">
								<div class="flex items-center text-gray-500 dark:text-gray-400">
									<svg
										class="w-4 h-4 mr-2"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="text-sm font-medium">Commentaire</span>
								</div>
								<div
									class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
								>
									<p
										class="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed"
									>
										{{ selectedMouvement.commentaire }}
									</p>
								</div>
							</div>

							<!-- Pas de commentaire -->
							<div
								v-else
								class="text-center py-8 text-gray-400 dark:text-gray-500"
							>
								<svg
									class="w-12 h-12 mx-auto mb-2 opacity-50"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1"
										d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
									/>
								</svg>
								<p class="text-sm">Aucun commentaire</p>
							</div>
						</div>
					</div>
				</div>

				<!-- FOOTER -->
				<div
					class="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
				>
					<div class="flex justify-end">
						<button
							@click="showDetailModal = false"
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
		try {
			isPageLoading.value = true;
			await stockStore.fetchAllMouvements();
			window.addEventListener("click", handleClickOutside);
		} finally {
			isPageLoading.value = false;
		}
	});

	onUnmounted(() => {
		window.removeEventListener("click", handleClickOutside);
	});
</script>
