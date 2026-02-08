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
					@click="openCreateModal"
					class="px-4 py-2 rounded-lg bg-[#6a0d5f] text-white text-sm font-medium"
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
				:pagination="true"
				:page-size="5"
				:sortable="true"
				:loading="categorieStore.loading"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
			>
				<template #actions="data">
					<div class="flex gap-2">
						<button
							@click="openEditModal(data.value)"
							class="px-3 py-1 rounded-md bg-blue-600 text-white text-xs"
						>
							Modifier
						</button>

						<button
							@click="deleteCategorie(data.value)"
							class="px-3 py-1 rounded-md bg-red-600 text-white text-xs"
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
					{{ isEditing ? "Modifier la catégorie" : "Ajouter une catégorie" }}
				</h3>

				<div>
					<label class="text-sm text-gray-600 dark:text-gray-300">
						Nom de la catégorie
					</label>
					<input
						v-model="form.libelle"
						type="text"
						required
						class="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2"
					/>
				</div>

				<div>
					<label class="text-sm text-gray-600 dark:text-gray-300">
						Description
					</label>
					<textarea
						v-model="form.description"
						rows="3"
						placeholder="Description (optionnelle)"
						class="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100"
					/>
				</div>

				<div class="flex justify-end gap-3 pt-2">
					<button
						@click="showModal = false"
						class="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						Annuler
					</button>
					<button
						@click="saveCategorie"
						class="px-4 py-2 text-sm rounded-lg bg-[#6a0d5f] text-white"
					>
						{{ isEditing ? "Modifier" : "Enregistrer" }}
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
	import { useCategorieStore } from "~~/stores/categorie";
	import Swal from "sweetalert2";
	import { useToast } from "#imports";

	/* =======================
   STORE
======================= */
	const categorieStore = useCategorieStore();

	/* =======================
   UI STATE
======================= */
	const search = ref("");
	const showModal = ref(false);
	const isEditing = ref(false);
	const isDropdownOpen = ref(false);
	const isPageLoading = ref(true);

	/* =======================
   FORM
======================= */
	const form = ref({
		id: null as number | null,
		libelle: "",
		description: null as string | null,
	});

	/* =======================
   TABLE
======================= */
	const visibleColumns = ref([
		{ field: "libelle", title: "Libellé", sortable: true, visible: true },
		{
			field: "description",
			title: "Description",
			sortable: false,
			visible: true,
		},
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	const columns = computed(() => visibleColumns.value.filter((c) => c.visible));

	/* =======================
   FILTRAGE + RECHERCHE
======================= */
	const rows = computed(() => {
		const data = categorieStore.categories;

		return data
			.map((c) => ({
				...c,
				description: c.description || "—",
			}))
			.filter((c) =>
				c.libelle.toLowerCase().includes(search.value.toLowerCase()),
			);
	});

	/* =======================
   ACTIONS
======================= */
	const openCreateModal = () => {
		isEditing.value = false;
		form.value = {
			id: null,
			libelle: "",
			description: null,
		};
		showModal.value = true;
	};

	const openEditModal = (row: any) => {
		isEditing.value = true;
		form.value = {
			id: row.id,
			libelle: row.libelle,
			description: row.description ?? null,
		};
		showModal.value = true;
	};

	const saveCategorie = async () => {
		const toast = useToast();

		try {
			if (isEditing.value && form.value.id) {
				await categorieStore.updateCategorie(
					form.value.id,
					form.value.libelle,
					form.value.description,
				);

				toast.success({ message: "Catégorie modifiée avec succès" });
			} else {
				await categorieStore.createCategorie(
					form.value.libelle,
					form.value.description,
				);

				toast.success({ message: "Catégorie ajoutée avec succès" });
			}

			showModal.value = false;
		} catch (e: any) {
			toast.error({
				message: e?.message || "Erreur lors de l'enregistrement",
			});
		}
	};

	const deleteCategorie = async (row: any) => {
		const result = await Swal.fire({
			title: "Confirmation",
			text: `Supprimer la catégorie "${row.libelle}" ?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#6a0d5f",
			cancelButtonColor: "#d33",
			confirmButtonText: "Oui, supprimer",
			cancelButtonText: "Annuler",
		});

		if (!result.isConfirmed) return;

		try {
			await categorieStore.deleteCategorie(row.id);

			const toast = useToast();
			toast.success({ message: "Catégorie supprimée avec succès" });
		} catch (e) {
			const toast = useToast();
			toast.error({ message: "Erreur lors de la suppression" });
		}
	};

	/* =======================
   DROPDOWN
======================= */
	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* =======================
   LIFECYCLE
======================= */
	onMounted(async () => {
		try {
			isPageLoading.value = true;
			await categorieStore.fetchCategories();

			window.addEventListener("click", (e) => {
				if (!e.target.closest(".relative")) closeDropdown();
			});
		} finally {
			isPageLoading.value = false;
		}
	});

	onUnmounted(() => {
		window.removeEventListener("click", closeDropdown);
	});
</script>
