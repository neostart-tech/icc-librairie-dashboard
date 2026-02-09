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
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Livres', to: '/livres' },
			]"
			title="Livres"
		/>

		<div class="flex flex-col sm:flex-row sm:justify-between gap-3">
			<p class="text-sm text-gray-500">Gestion des livres</p>

			<div class="flex items-center gap-3">
				<div class="relative inline-block text-left">
					<button
						@click="isDropdownOpen = !isDropdownOpen"
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
					placeholder="Rechercher par titre..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]"
				/>

				<NuxtLink
					to="/livres/ajouter"
					class="px-4 py-2 bg-[#6a0d5f] text-white rounded"
				>
					+ Ajouter
				</NuxtLink>
			</div>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-xl p-4">
			<Vue3Datatable
				:rows="filteredRows"
				:columns="columns"
				:pagination="true"
				:page-size="5"
				:sortable="true"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
			>
				<template #image="data">
					<pre>{{
						console.log(
							"Détails de data.value:",
							JSON.parse(JSON.stringify(data.value)),
						)
					}}</pre>
					<img
						v-if="data.value"
						:src="data.value.image"
						class="w-12 h-16 object-cover rounded border"
					/>
				</template>

				<template #stock="data">
					<span
						v-if="data.value.stock === 0"
						class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
					>
						Rupture
					</span>

					<span
						v-else
						class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
					>
						{{ data.value.stock }}
					</span>
				</template>

				<template #actions="data">
					<div class="flex gap-2">
						<button
							@click="openDetails(data.value)"
							class="px-2 py-1 bg-gray-600 text-white text-xs rounded"
						>
							Détails
						</button>
						<button
							@click="openEdit(data.value)"
							class="px-2 py-1 bg-blue-600 text-white text-xs rounded"
						>
							Modifier
						</button>
						<button
							@click="deleteLivre(data.value)"
							class="px-2 py-1 bg-red-600 text-white text-xs rounded"
						>
							Supprimer
						</button>
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<!-- MODAL DETAILS LIVRE -->
		<!-- MODAL DETAILS LIVRE - Version simple -->
		<div
			v-if="showDetailModal"
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
			@click.self="showDetailModal = false"
		>
			<div
				class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
			>
				<!-- HEADER -->
				<div
					class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800"
				>
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						Détails du livre
					</h3>
					<button
						@click="showDetailModal = false"
						class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
					>
						×
					</button>
				</div>

				<!-- BODY -->
				<div class="p-4 max-h-[70vh] overflow-y-auto">
					<div class="flex flex-col md:flex-row gap-4">
						<!-- Image -->
						<div class="md:w-1/3">
							<div class="relative">
								<img
									:src="selectedLivre.image"
									:alt="selectedLivre.titre"
									class="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
								/>
								<div
									v-if="selectedLivre.stock === 0"
									class="absolute top-2 right-2"
								>
									<span
										class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
									>
										RUPTURE
									</span>
								</div>
							</div>

							<!-- PRIX -->
							<div class="mt-4 text-center">
								<!-- Sans promotion -->
								<div v-if="!selectedLivre.prix_promo">
									<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
										Prix
									</p>
									<p
										class="text-2xl font-extrabold text-[#6a0d5f] dark:text-purple-500"
									>
										{{ formatPrice(selectedLivre.prix) }}
									</p>
								</div>

								<!-- Avec promotion -->
								<div v-else>
									<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
										Prix promotionnel
									</p>

									<div class="flex flex-col items-center gap-1">
										<!-- Ancien prix -->
										<p class="text-sm text-gray-400 line-through">
											{{ formatPrice(selectedLivre.prix) }}
										</p>

										<!-- Prix promo -->
										<p
											class="text-2xl font-extrabold text-[#6a0d5f] dark:text-purple-500"
										>
											{{ formatPrice(selectedLivre.prix_promo) }}
										</p>

										<!-- Badge promo -->
										<span
											class="mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
										>
											Promotion
										</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Informations -->
						<div class="md:w-2/3 space-y-4">
							<!-- Titre et Auteur -->
							<div>
								<h2
									class="text-xl font-bold text-gray-900 dark:text-white mb-1"
								>
									{{ selectedLivre.titre }}
								</h2>
								<p class="text-gray-600 dark:text-gray-300">
									<span class="font-medium">Auteur :</span>
									{{ selectedLivre.auteur || "—" }}
								</p>
							</div>

							<!-- Infos rapides -->
							<div class="grid grid-cols-2 gap-3">
								<div>
									<p class="text-sm text-gray-500 dark:text-gray-400">
										Catégorie
									</p>
									<p class="text-gray-900 dark:text-white font-medium">
										{{ selectedLivre.categorie || "—" }}
									</p>
								</div>

								<div>
									<p class="text-sm text-gray-500 dark:text-gray-400">Stock</p>
									<div v-if="selectedLivre.stock === 0">
										<p class="text-red-600 dark:text-red-400 font-medium">
											Épuisé
										</p>
									</div>
									<div v-else>
										<p class="text-gray-900 dark:text-white font-medium">
											{{ selectedLivre.stock }} exemplaire(s)
										</p>
									</div>
								</div>
							</div>

							<!-- Description -->
							<div>
								<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
									Description
								</p>
								<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
									<p
										class="text-gray-700 dark:text-gray-300 whitespace-pre-line"
									>
										{{
											selectedLivre.description ||
											"Aucune description disponible."
										}}
									</p>
								</div>
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
							class="px-4 py-2 bg-[#6a0d5f] hover:bg-[#5a0b50] dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
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
	import { useLivreStore } from "~~/stores/livre";
	import Swal from "sweetalert2";
	import { useToast } from "#imports";

	const livreStore = useLivreStore();
	const toast = useToast();

	const search = ref("");
	const isDropdownOpen = ref(false);
	const showDetailModal = ref(false);
	const selectedLivre = ref<any>(null);
	const formatPrice = (value: number | null) => {
		if (value === null || value === undefined) return "—";
		return value.toLocaleString("fr-FR") + " FCFA";
	};

	const isPageLoading = ref(true);

	const allColumns = ref([
		{ field: "image", title: "Image", sortable: false, visible: true },
		{ field: "titre", title: "Titre", sortable: true, visible: true },
		{ field: "auteur", title: "Auteur", sortable: true, visible: true },
		{ field: "categorie", title: "Catégorie", sortable: true, visible: true },
		{ field: "prix", title: "Prix", sortable: true, visible: true },
		{ field: "prix_promo", title: "Prix promo", sortable: true, visible: true },
		{ field: "stock", title: "Stock", sortable: true, visible: true },
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	const columns = computed(() => allColumns.value.filter((c) => c.visible));

	const rows = computed(() =>
		livreStore.livres.map((l) => {
			const quantite = l.stock?.quantite ?? 0;

			return {
				id: l.id,
				image: livreStore.getCoverImage(l),
				titre: l.titre,
				auteur: l.auteur ?? "—",
				categorie: l.categorie?.libelle ?? "—",
				prix: l.prix,
				prix_promo: l.prix_promo,
				stock: quantite,
				enRupture: quantite === 0,
				description: l.description,
			};
		}),
	);

	const filteredRows = computed(() =>
		rows.value.filter((r) =>
			r.titre.toLowerCase().includes(search.value.toLowerCase()),
		),
	);

	const openDetails = (row: any) => {
		selectedLivre.value = row;
		showDetailModal.value = true;
	};

	const openEdit = (row: any) => {
		navigateTo(`/livres/${row.id}/edit`);
	};

	const deleteLivre = async (row: any) => {
		const res = await Swal.fire({
			title: "Supprimer ?",
			text: row.titre,
			icon: "warning",
			showCancelButton: true,
		});
		if (!res.isConfirmed) return;

		await livreStore.deleteLivre(row.id);
		toast.success({ message: "Livre supprimé" });
	};

	onMounted(async () => {
		try {
			isPageLoading.value = true;
			await livreStore.fetchLivres();
		} finally {
			isPageLoading.value = false;
		}
	});

	onUnmounted(() => {
		window.removeEventListener("click", () => {});
	});
</script>
