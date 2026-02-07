<template>
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

		<!-- MODAL DETAILS -->
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
					<h3 class="text-lg font-bold">Détails du livre</h3>
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
					<!-- IMAGE -->
					<div class="md:col-span-1 flex justify-center">
						<img
							:src="selectedLivre.image"
							class="w-40 h-56 object-cover rounded-xl border"
						/>
					</div>

					<!-- INFOS -->
					<div class="md:col-span-2 space-y-4 text-sm">
						<div>
							<span class="font-semibold">Titre :</span>
							<p class="text-gray-700 dark:text-gray-300">
								{{ selectedLivre.titre }}
							</p>
						</div>

						<div>
							<span class="font-semibold">Auteur :</span>
							<p>{{ selectedLivre.auteur }}</p>
						</div>

						<div class="grid grid-cols-2 gap-5">
							<div>
								<span class="font-semibold">Catégorie :</span>
								<p>{{ selectedLivre.categorie }}</p>
							</div>
							<div>
								<span class="font-semibold">Prix :</span>
								<p>{{ selectedLivre.prix }} FCFA</p>
							</div>
							<div>
								<span class="font-semibold">Prix Promo :</span>
								<p>{{ selectedLivre.prix_promo }} FCFA</p>
							</div>
							<div>
								<span class="font-semibold">Stock :</span>
								<p>{{ selectedLivre.stock }}</p>
							</div>
						</div>

						<!-- DESCRIPTION -->
						<div>
							<span class="font-semibold">Description :</span>
							<p
								class="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line"
							>
								{{ selectedLivre.description || "Aucune description fournie." }}
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
	import { useLivreStore } from "~~/stores/livre";
	import Swal from "sweetalert2";
	import { useToast } from "#imports";

	const livreStore = useLivreStore();
	const toast = useToast();

	const search = ref("");
	const isDropdownOpen = ref(false);
	const showDetailModal = ref(false);
	const selectedLivre = ref<any>(null);

	const allColumns = ref([
		{ field: "image", title: "Image", sortable: false, visible: true },
		{ field: "titre", title: "Titre", sortable: true, visible: true },
		{ field: "auteur", title: "Auteur", sortable: true, visible: true },
		{ field: "categorie", title: "Catégorie", sortable: true, visible: true },
		{ field: "prix", title: "Prix", sortable: true, visible: true },
		{ field: "stock", title: "Stock", sortable: true, visible: true },
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	const columns = computed(() => allColumns.value.filter((c) => c.visible));

	const rows = computed(() =>
		livreStore.livres.map((l) => ({
			id: l.id,
			image: livreStore.getCoverImage(l),
			titre: l.titre,
			auteur: l.auteur ?? "—",
			categorie: l.categorie?.libelle ?? "—",
			prix: l.prix,
			stock: l.stock?.quantite ?? 0,
			description: l.description,
		})),
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

	onMounted(() => livreStore.fetchLivres());

	onUnmounted(() => {
		window.removeEventListener("click", () => {});
	});
</script>
