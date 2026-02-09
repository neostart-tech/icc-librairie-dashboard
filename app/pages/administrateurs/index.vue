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
				{ label: 'Administrateurs', to: null },
			]"
			title="Gestion des administrateurs"
		/>

		<!-- Header actions -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Gestion des administrateurs
			</p>

			<div class="flex flex-wrap items-center gap-3">
				<!-- Colonnes -->
				<div class="relative inline-block text-left">
					<button
						@click="toggleDropdown"
						class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-gray-600"
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
						<div class="py-1">
							<label
								v-for="col in visibleColumns"
								:key="col.field"
								class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
							>
								<input type="checkbox" v-model="col.visible" class="rounded" />
								{{ col.title }}
							</label>
						</div>
					</div>
				</div>

				<!-- Recherche -->
				<input
					v-model="search"
					type="text"
					placeholder="Rechercher un administrateur..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]"
				/>

				<!-- Boutons -->
				<button
					@click="openAddModal"
					class="bg-[#6a0d5f] hover:bg-[#7a1e70] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
				>
					+ Nouvel Administrateur
				</button>

				<button
					@click="openNommerModal"
					class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
				>
					Nommer Administrateur
				</button>
			</div>
		</div>

		<!-- Table -->
		<div
			class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md"
		>
			<Vue3Datatable
				:rows="adminUsers"
				:columns="columns"
				:pagination="true"
				:page-size="5"
				:sortable="true"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
			>
				<template #nom="row">
					{{ row.value.nom }} {{ row.value.prenom }}
				</template>

				<template #telephone="row">
					{{ row.value.telephone ?? "--" }}
				</template>

				<!-- Statut -->
				<template #statut="row">
					<span
						:class="[
							'px-3 py-1 rounded-full text-xs font-semibold',
							row.value.statut === 'actif'
								? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
								: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
						]"
					>
						{{ row.value.statut === "actif" ? "Actif" : "Bloqué" }}
					</span>
				</template>

				<!-- Actions -->
				<template #actions="row">
					<div class="flex gap-2">
						<button
							class="px-3 py-1 rounded-md text-xs bg-blue-600 hover:bg-blue-700 text-white"
							@click="openDetailModal(row.value)"
						>
							Détails
						</button>

						<button
							v-if="row.value.statut === 'actif'"
							class="px-3 py-1 rounded-md text-xs bg-red-500 hover:bg-red-600 text-white"
							@click="blockUser(row.value)"
						>
							Bloquer
						</button>

						<button
							v-else
							class="px-3 py-1 rounded-md text-xs bg-green-600 hover:bg-green-700 text-white"
							@click="unblockUser(row.value)"
						>
							Débloquer
						</button>

						<button
							class="px-3 py-1 rounded-md text-xs bg-[#6a0d5f] hover:bg-[#7a1e70] text-white"
							@click="removeAdminRole(row.value)"
						>
							Retirer rôle
						</button>
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<!-- Modal Ajouter / Modifier Admin -->
		<div
			v-if="modalAddOpen"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6"
			>
				<h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">
					{{ isEditing ? "Modifier Administrateur" : "Nouvel Administrateur" }}
				</h3>

				<form @submit.prevent="saveAdmin" class="space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Nom</label
						>
						<input
							v-model="newAdmin.nom"
							type="text"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2"
							required
						/>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Prénom</label
						>
						<input
							v-model="newAdmin.prenom"
							type="text"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2"
							required
						/>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Email</label
						>
						<input
							v-model="newAdmin.email"
							type="email"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2"
							required
						/>
					</div>

					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Téléphone</label
						>
						<input
							v-model="newAdmin.telephone"
							type="text"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2"
						/>
					</div>

					<div class="flex justify-end space-x-2">
						<button
							type="button"
							@click="closeAddModal"
							class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
						>
							Annuler
						</button>
						<button
							type="submit"
							class="bg-[#6a0d5f] hover:bg-[#7a1e70] text-white py-2 px-4 rounded-lg"
						>
							{{ isEditing ? "Modifier" : "Ajouter" }}
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Modal Nommer Admin -->
		<div
			v-if="modalNommerOpen"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6"
			>
				<h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">
					Nommer Administrateur
				</h3>

				<input
					v-model="searchNommer"
					placeholder="Rechercher un utilisateur..."
					type="text"
					class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 mb-3 text-sm text-gray-800 dark:text-gray-100"
				/>

				<form @submit.prevent="nommerAdmin" class="space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Sélectionner un utilisateur</label
						>
						<select
							v-model="selectedUserId"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2"
							required
						>
							<option
								v-for="user in filteredNommerUsers"
								:key="user.id"
								:value="user.id"
							>
								{{ user.nom }} {{ user.prenom }} - {{ user.email }}
							</option>
						</select>
					</div>

					<div class="flex justify-end space-x-2">
						<button
							type="button"
							@click="closeNommerModal"
							class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
						>
							Annuler
						</button>
						<button
							type="submit"
							class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
						>
							Nommer Administrateur
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Modal Détails Administrateur -->
		<div
			v-if="isModalOpen"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6"
			>
				<h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">
					Détails Administrateur
				</h3>

				<div class="space-y-2 text-gray-700 dark:text-gray-200">
					<p>
						<strong>Nom & Prénoms :</strong> {{ selectedUserModal.nom }}
						{{ selectedUserModal.prenom }}
					</p>
					<p><strong>Email :</strong> {{ selectedUserModal.email }}</p>
					<p>
						<strong>Téléphone :</strong>
						{{ selectedUserModal.telephone || "-" }}
					</p>
					<p>
						<strong>Statut :</strong>
						<span
							:class="
								selectedUserModal.statut === 'actif'
									? 'text-green-600'
									: 'text-red-600'
							"
						>
							{{ selectedUserModal.statut === "actif" ? "Actif" : "Bloqué" }}
						</span>
					</p>
					<p>
						<strong>Date d'inscription :</strong>
						{{ new Date(selectedUserModal.created_at).toLocaleDateString() }}
					</p>
				</div>

				<div class="flex justify-end mt-4">
					<button
						@click="closeDetailModal"
						class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
					>
						Fermer
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from "vue";
	import { useAdminStore } from "~~/stores/admin";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";
	import Swal from "sweetalert2";
	import { useToast } from "#imports";

	const adminStore = useAdminStore();
	const toast = useToast();

	/* STATES */
	const search = ref("");
	const isDropdownOpen = ref(false);
	const isPageLoading = ref(true);
	const modalAddOpen = ref(false);
	const modalNommerOpen = ref(false);
	const isEditing = ref(false);
	const newAdmin = ref({ nom: "", prenom: "", email: "", telephone: "" });
	const selectedUserId = ref<string | null>(null);
	const searchNommer = ref("");

	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* COLUMNS */
	const visibleColumns = ref([
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
	const columns = computed(() => visibleColumns.value.filter((c) => c.visible));

	/* USERS */
	const adminUsers = computed(() =>
		adminStore.users
			.filter((u) => u.role?.role === "admin")
			.map((u) => ({
				...u,
				statut: u.statut?.toLowerCase() === "actif" ? "actif" : "inactif",
				date: new Date(u.created_at).toLocaleDateString(),
			}))
			.filter((u) =>
				`${u.nom} ${u.prenom}`
					.toLowerCase()
					.includes(search.value.toLowerCase()),
			),
	);

	/* Modal Ajouter / Modifier */
	const openAddModal = () => {
		isEditing.value = false;
		newAdmin.value = { nom: "", prenom: "", email: "", telephone: "" };
		modalAddOpen.value = true;
	};
	const closeAddModal = () => (modalAddOpen.value = false);
	const saveAdmin = async () => {
		try {
			if (isEditing.value) {
				// update existing
			} else {
				await adminStore.createAdmin(newAdmin.value);
				toast.success({ message: "Administrateur créé avec succès" });
			}
		} catch (e: any) {
			toast.error({ message: e.message || "Erreur" });
		} finally {
			modalAddOpen.value = false;
		}
	};

	/* Modal Nommer Admin */
	const openNommerModal = () => {
		selectedUserId.value = null;
		searchNommer.value = "";
		modalNommerOpen.value = true;
	};
	const closeNommerModal = () => (modalNommerOpen.value = false);

	const filteredNommerUsers = computed(() =>
		adminStore.users
			.filter((u) => u.role?.role === "user")
			.filter((u) =>
				`${u.nom} ${u.prenom}`
					.toLowerCase()
					.includes(searchNommer.value.toLowerCase()),
			),
	);

	const nommerAdmin = async () => {
		if (!selectedUserId.value) return;
		await adminStore.makeAdmin(selectedUserId.value);
		toast.success({ message: "Utilisateur nommé administrateur" });
		closeNommerModal();
	};

	/* ACTIONS */
	const openDetailModal = (user: any) => {
		selectedUserModal.value = user;
		isModalOpen.value = true;
	};
	const isModalOpen = ref(false);
	const selectedUserModal = ref<any>(null);
	const closeDetailModal = () => {
		isModalOpen.value = false;
		selectedUserModal.value = null;
	};

	const blockUser = async (user: any) => {
		const result = await Swal.fire({
			title: `Bloquer ${user.nom} ?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Oui",
			cancelButtonText: "Annuler",
		});
		if (result.isConfirmed) {
			await adminStore.lockUser(user.id);
			toast.success({ message: `${user.nom} bloqué` });
		}
	};

	const unblockUser = async (user: any) => {
		const result = await Swal.fire({
			title: `Débloquer ${user.nom} ?`,
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Oui",
			cancelButtonText: "Annuler",
		});
		if (result.isConfirmed) {
			await adminStore.unlockUser(user.id);
			toast.success({ message: `${user.nom} débloqué` });
		}
	};

	const removeAdminRole = async (user: any) => {
		const result = await Swal.fire({
			title: `Retirer rôle admin à ${user.nom}?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Oui",
			cancelButtonText: "Annuler",
		});
		if (result.isConfirmed) {
			await adminStore.makeUser(user.id);
			Swal.fire("Succès", "Utilisateur n'est plus admin", "success");
		}
	};

	/* LIFECYCLE */
	onMounted(async () => {
		isPageLoading.value = true;
		try {
			await adminStore.fetchAllUsers();
			window.addEventListener("click", (e) => {
				if (!e.target.closest(".relative")) closeDropdown();
			});
		} finally {
			isPageLoading.value = false;
		}
	});
</script>
