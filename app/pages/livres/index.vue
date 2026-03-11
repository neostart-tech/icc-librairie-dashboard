<template>
	<!-- LOADING GLOBAL -->
	<div v-if="isPageLoading"
		class="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70">
		<div class="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
	</div>

	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<Breadcrumb :items="[
			{ label: 'Tableau de bord', to: '/dashboard' },
			{ label: 'Livres', to: '/livres' },
		]" title="Livres" />

		<div class="flex flex-col sm:flex-row sm:justify-between gap-3">
			<p class="text-sm text-gray-500">Gestion des livres</p>

			<div class="flex items-center gap-3">
				<div class="relative inline-block text-left">
					<button @click="isDropdownOpen = !isDropdownOpen"
						class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-1">
						Colonnes
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
							stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					<!-- Menu déroulant -->
					<div v-if="isDropdownOpen"
						class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
						<div class="py-1">
							<label v-for="col in allColumns" :key="col.field"
								class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
								<input type="checkbox" v-model="col.visible"
									class="rounded text-[#6a0d5f] focus:ring-[#6a0d5f]" />
								{{ col.title }}
							</label>
						</div>
					</div>
				</div>

				<!-- Recherche -->
				<input v-model="search" type="text" placeholder="Rechercher par titre..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]" />

				<div class="flex gap-3">
					<button @click="triggerExcelImport"
						class="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#6a0d5f] dark:text-purple-300 bg-white dark:bg-gray-800 border-2 border-[#6a0d5f] dark:border-purple-400 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#6a0d5f]/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] focus:ring-offset-2 dark:focus:ring-offset-gray-900">
						<div
							class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
							<div class="relative h-full w-12 bg-[#6a0d5f]/10 dark:bg-purple-400/10"></div>
						</div>
						<svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" fill="none"
							stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" />
						</svg>
						<span>Importer Excel</span>
					</button>

					<NuxtLink to="/livres/ajouter"
						class="group px-5 py-2.5 bg-gradient-to-r from-[#6a0d5f] to-[#9a1b8c] text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-[#6a0d5f]/30 hover:from-[#5a0b50] hover:to-[#8a157c] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-semibold text-sm">
						<svg class="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none"
							stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
						Nouveau Livre
					</NuxtLink>
				</div>
			</div>
		</div>

		<div class="bg-white dark:bg-gray-800 rounded-xl p-4">
			<Vue3Datatable :rows="filteredRows" :columns="columns" :pagination="true" :page-size="5" :sortable="true"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'">
				<template #image="data">
					<pre>{{
						console.log(
							"Détails de data.value:",
							JSON.parse(JSON.stringify(data.value)),
						)
					}}</pre>
					<img v-if="data.value" :src="data.value.image" class="w-12 h-16 object-cover rounded border" />
				</template>

				<template #stock="data">
					<span v-if="data.value.stock === 0"
						class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
						Rupture
					</span>

					<span v-else
						class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
						{{ data.value.stock }}
					</span>
				</template>

				<template #actions="data">
					<div class="flex gap-2">
						<button @click="openDetails(data.value)"
							class="px-2 py-1 bg-gray-600 text-white text-xs rounded">
							Détails
						</button>
						<button @click="openEdit(data.value)" class="px-2 py-1 bg-blue-600 text-white text-xs rounded">
							Modifier
						</button>
						<button @click="deleteLivre(data.value)"
							class="px-2 py-1 bg-red-600 text-white text-xs rounded">
							Supprimer
						</button>
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<!-- MODAL DETAILS LIVRE -->
		<div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
			@click.self="showDetailModal = false">
			<div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
				<!-- HEADER -->
				<div class="p-4 bg-[#6a0d5f] text-white">
					<div class="flex justify-between items-center">
						<div class="flex items-center gap-3">
							<div class="p-2 bg-white/20 rounded-lg">
								<svg fill="#ffffff" width="32px" height="32px" viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
									<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
									<g id="SVGRepo_iconCarrier">
										<path
											d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14H5v-2h6v2zm8-4H5v-2h14v2zm0-4H5V7h14v2z">
										</path>
									</g>
								</svg>
							</div>
							<h3 class="text-lg font-bold">Détails du livre</h3>
						</div>
						<button @click="showDetailModal = false"
							class="p-1 hover:bg-white/20 rounded-full transition-colors">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				<!-- BODY -->
				<div class="p-4 max-h-[70vh] overflow-y-auto">
					<div class="flex flex-col md:flex-row gap-4">
						<!-- Image -->
						<div class="md:w-1/3">
							<div class="relative">
								<img :src="selectedLivre.image" :alt="selectedLivre.titre"
									class="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700" />
								<div v-if="selectedLivre.stock === 0" class="absolute top-2 right-2">
									<span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
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
									<p class="text-2xl font-extrabold text-[#6a0d5f] dark:text-purple-500">
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
										<p class="text-2xl font-extrabold text-[#6a0d5f] dark:text-purple-500">
											{{ formatPrice(selectedLivre.prix_promo) }}
										</p>

										<!-- Badge promo -->
										<span
											class="mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
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
								<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
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
									<p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
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
				<div class="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
					<div class="flex justify-end">
						<button @click="showDetailModal = false"
							class="px-4 py-2 bg-[#6a0d5f] hover:bg-[#5a0b50] dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- MODAL IMPORT EXCEL PROGRESS -->
		<div v-if="showImportModal"
			class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity">
			<div
				class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 dark:border-gray-700">
				<!-- Modal Header with gradient -->
				<div class="relative p-6 bg-gradient-to-r from-[#6a0d5f] to-[#9a1b8c] text-white">
					<div class="absolute top-0 right-0 p-4">
						<button v-if="!isImporting || finishedImport" @click="closeImportModal"
							class="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<div class="flex items-center gap-4">
						<div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-inner">
							<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" />
							</svg>
						</div>
						<div>
							<h3 class="text-xl font-bold tracking-tight">
								Importation Excel
							</h3>
							<p class="text-white/80 text-sm font-medium mt-0.5">
								Ajout de livres en masse
							</p>
						</div>
					</div>
				</div>

				<!-- Modal Body -->
				<div class="p-8">
					<!-- Status icon & message -->
					<div class="flex flex-col items-center justify-center text-center mb-8">
						<div v-if="finishedImport"
							class="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 shadow-sm transform scale-100 animate-[bounce_0.5s_ease-out]">
							<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
									d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div v-else-if="cancelImport"
							class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
							<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
									d="M6 18L18 6M6 6l12 12" />
							</svg>
						</div>
						<div v-else
							class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-[#6a0d5f] dark:text-purple-400 rounded-full flex items-center justify-center mb-4 shadow-sm relative">
							<svg class="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" />
							</svg>
							<!-- Circular spinner -->
							<svg class="absolute inset-0 w-full h-full text-[#6a0d5f]/20 dark:text-purple-400/20 animate-spin"
								viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
									fill="none"></circle>
								<path class="opacity-75" fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
								</path>
							</svg>
						</div>

						<h4 class="text-lg font-bold text-gray-900 dark:text-white">
							{{
								finishedImport
									? "Opération réussie !"
									: cancelImport
										? "Importation annulée"
										: "Traitement en cours..."
							}}
						</h4>
						<p class="text-gray-500 dark:text-gray-400 mt-1.5 text-sm leading-relaxed">
							{{
								finishedImport
									? "Vos livres ont été importés avec succès dans le système."
									: cancelImport
										? "Le processus d'importation a été interrompu par l'utilisateur."
										: "Veuillez ne pas fermer cette fenêtre pendant l'importation des données."
							}}
						</p>
					</div>

					<!-- Progress Bar Section -->
					<div
						class="bg-gray-50 dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 mb-7 shadow-sm">
						<div class="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
							<span class="flex items-center gap-2">
								<span v-if="!finishedImport && !cancelImport" class="relative flex h-2.5 w-2.5">
									<span
										class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6a0d5f] opacity-75"></span>
									<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6a0d5f]"></span>
								</span>
								Progression globale
							</span>
							<span class="text-[#6a0d5f] dark:text-purple-400 text-base">{{ importProgress }}%</span>
						</div>

						<div
							class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
							<div class="h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
								:class="finishedImport
									? 'bg-green-500'
									: cancelImport
										? 'bg-red-500'
										: 'bg-gradient-to-r from-[#6a0d5f] to-[#e43b8a]'
									" :style="{ width: importProgress + '%' }"></div>
						</div>

						<div class="flex justify-between items-center text-xs">
							<span class="text-gray-500 dark:text-gray-400 font-medium">Lignes traitées</span>
							<div
								class="px-2.5 py-1.5 bg-white dark:bg-gray-900 rounded-lg font-bold text-gray-700 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-1.5">
								<span class="text-[#6a0d5f] dark:text-purple-400">{{
									importCurrent
								}}</span>
								<span class="text-gray-400">/</span>
								<span>{{ importTotal }}</span>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex justify-center gap-3">
						<button v-if="isImporting && !finishedImport && !cancelImport" @click="cancelImportProcess"
							class="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 transition-all duration-200 flex justify-center items-center gap-2 shadow-sm">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Annuler l'importation
						</button>
						<button v-if="finishedImport || cancelImport" @click="closeImportModal"
							class="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2">
							<svg v-if="finishedImport" class="w-5 h-5" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M5 13l4 4L19 7" />
							</svg>
							Fermer la fenêtre
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- File Input Hidden pour Excel -->
		<input type="file" accept=".xlsx, .xls" ref="importFileRef" class="hidden" @change="handleFileUpload" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useLivreStore } from "~~/stores/livre";
import { useCategorieStore } from "~~/stores/categorie";
import { useStockStore } from "~~/stores/stock";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useToast } from "#imports";

const livreStore = useLivreStore();
const categorieStore = useCategorieStore();
const stockStore = useStockStore();
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

// Variables pour l'import Excel
const showImportModal = ref(false);
const isImporting = ref(false);
const importProgress = ref(0);
const importCurrent = ref(0);
const importTotal = ref(0);
const cancelImport = ref(false);
const finishedImport = ref(false);
const importFileRef = ref<HTMLInputElement | null>(null);

const triggerExcelImport = () => {
	if (importFileRef.value) {
		importFileRef.value.click();
	}
};

const cancelImportProcess = () => {
	cancelImport.value = true;
};

const closeImportModal = () => {
	showImportModal.value = false;
	isImporting.value = false;
	cancelImport.value = false;
	finishedImport.value = false;
	importProgress.value = 0;
	importCurrent.value = 0;
	importTotal.value = 0;
	if (importFileRef.value) {
		importFileRef.value.value = "";
	}
	// Rafraîchir les livres à la fin
	livreStore.fetchLivres();
};

const handleFileUpload = async (e: Event) => {
	const target = e.target as HTMLInputElement;
	if (!target.files || !target.files.length) return;

	const file = target.files[0];
	if (!file) return;

	const reader = new FileReader();

	reader.onload = async (event: any) => {
		try {
			const data = new Uint8Array(event.target.result);
			const workbook = XLSX.read(data, { type: "array" });
			const firstSheetName = workbook.SheetNames[0];

			if (!firstSheetName) {
				toast.error({ message: "Le fichier ne contient aucune feuille" });
				return;
			}

			const worksheet = workbook.Sheets[firstSheetName];
			if (!worksheet) {
				toast.error({ message: "Feuille introuvable" });
				return;
			}

			const rows = XLSX.utils.sheet_to_json(worksheet) as any[];
			if (!rows || !rows.length) {
				toast.error({ message: "Le fichier est vide ou invalide" });
				return;
			}

			showImportModal.value = true;
			isImporting.value = true;
			cancelImport.value = false;
			finishedImport.value = false;
			importTotal.value = rows.length;
			importCurrent.value = 0;
			importProgress.value = 0;

			// Fetch categories to safely check
			await categorieStore.fetchCategories();

			for (let i = 0; i < rows.length; i++) {
				if (cancelImport.value) {
					toast.info({ message: "Importation interrompue par l'utilisateur." });
					break;
				}

				const row = rows[i];
				importCurrent.value = i + 1;
				importProgress.value = Math.round(
					((i + 1) / Math.max(1, rows.length)) * 100,
				);

				try {
					let catId: number | null = null;

					if (row.CATEGORY) {
						const catName = row.CATEGORY.toString().trim();
						// Recherche dynamique
						const existingCat = categorieStore.categories.find(
							(c) => c.libelle.toLowerCase() === catName.toLowerCase(),
						);

						if (existingCat) {
							catId = existingCat.id;
						} else {
							// Création si elle n'existe pas
							try {
								const newCat = await categorieStore.createCategorie(
									catName,
									null,
								);
								catId = newCat?.data?.id || newCat?.id || null;
							} catch (e) {
								console.error("Erreur création catégorie", e);
							}
						}
					}

					// Fallback sur la première catégorie (ou on pourrait omettre mais l'ID est nécessaire)
					if (!catId) catId = categorieStore.categories[0]?.id || 1;

					const itemName = row.ITEM_NAME?.toString() || "Livre " + (i + 1);
					const prix = Number(row.PRICE) || 0;
					let stock = Number(row.STOCK);
					if (isNaN(stock) || stock < 0) stock = 0;

					const newLivre = await livreStore.createLivre({
						titre: itemName,
						description: "", // La description reste nulle / vide
						prix: prix,
						categorie_id: catId,
					});

					if (stock > 0 && newLivre) {
						await stockStore.addMouvement({
							livre_id: newLivre.id,
							type: "entree",
							quantite: stock,
							commentaire: "Stock initial via import Excel",
						});
					}
				} catch (e) {
					console.error(`Erreur à la ligne ${i + 1}`, e);
				}
			}

			if (!cancelImport.value) {
				finishedImport.value = true;
				toast.success({ message: "Importation terminée avec succès" });
			}
		} catch (error) {
			toast.error({ message: "Erreur lors de la lecture du fichier" });
			console.error(error);
		} finally {
			isImporting.value = false;
			if (target) target.value = "";
		}
	};

	reader.readAsArrayBuffer(file);
};

onUnmounted(() => {
	window.removeEventListener("click", () => { });
});
</script>
