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
				{ label: 'Utilisateurs', to: '/utilisateurs' },
			]"
			title="Utilisateurs"
		/>

		<!-- Header actions -->
		<div
			class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
		>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Gestion des utilisateurs
			</p>

			<div class="flex items-center gap-3">
				<!-- Dropdown colonnes -->
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
					placeholder="Rechercher un utilisateur..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]"
				/>
			</div>
		</div>

		<!-- Table -->
		<div
			class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md"
		>
			<Vue3Datatable
				:rows="filteredUsers"
				:columns="columns"
				:pagination="true"
				:page-size="5"
				:sortable="true"
				class="!bg-transparent"
				:header-class="'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs uppercase cursor-pointer'"
				:row-class="'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200'"
				:cell-class="'px-4 py-2'"
			>
				<!-- Type d'utilisateur -->
				<template #type="row">
					{{
						row.value.appmobile
							? "Compte synchronisé à l'app mobile"
							: "Compte créé sur le site de la librairie"
					}}
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
							@click="openModal(row.value)"
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
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<!-- Modal Détails -->
		<div
			v-if="isModalOpen"
			class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 relative"
			>
				<button
					@click="closeModal"
					class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
				>
					✕
				</button>

				<h3 class="text-lg font-semibold mb-4">Détails de l'utilisateur</h3>

				<div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
					<p><strong>Nom :</strong> {{ selectedUserModal?.nom }}</p>
					<p><strong>Prénom :</strong> {{ selectedUserModal?.prenom }}</p>
					<p><strong>Email :</strong> {{ selectedUserModal?.email }}</p>
					<p>
						<strong>Téléphone :</strong>
						{{ selectedUserModal?.telephone || "-" }}
					</p>
					<p><strong>Rôle :</strong> {{ selectedUserModal?.role?.role }}</p>
					<p>
						<strong>Type :</strong>
						{{
							selectedUserModal?.appmobile
								? "Compte synchronisé à l'app mobile"
								: "Compte créé sur le site de la librairie"
						}}
					</p>
					<p>
						<strong>Statut :</strong>
						{{ selectedUserModal?.statut === "actif" ? "Actif" : "Bloqué" }}
					</p>
					<p>
						<strong>Date création :</strong> {{ selectedUserModal?.created_at }}
					</p>
				</div>

				<div class="flex justify-end">
					<button
						@click="isModalOpen = false"
						class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
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
	import { useAdminStore } from "~~/stores/admin";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";
	import Swal from "sweetalert2";
	import "sweetalert2/dist/sweetalert2.min.css";
	import { useToast } from "#imports";
	const toast = useToast();

	const adminStore = useAdminStore();

	/* =======================
UI STATE
======================= */
	const search = ref("");
	const isDropdownOpen = ref(false);
	const isPageLoading = ref(true);
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
			field: "type",
			title: "Type d'utilisateur",
			sortable: true,
			visible: true,
			isSlot: true,
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

	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* =======================
Modal
======================= */
	const isModalOpen = ref(false);
	const selectedUserModal = ref<any>(null);
	const openModal = (user: any) => {
		selectedUserModal.value = user;
		isModalOpen.value = true;
	};
	const closeModal = () => {
		selectedUserModal.value = null;
		isModalOpen.value = false;
	};

	/* =======================
Filtrage users
======================= */
	const filteredUsers = computed(() =>
		adminStore.users
			.filter((u) => u.role?.role === "user")
			.map((u) => ({
				...u,
				appmobile: !!u.appmobile,
				statut: u.statut?.toLowerCase() === "actif" ? "actif" : "inactif",
				date: new Date(u.created_at).toLocaleDateString(),
			}))
			.filter((u) =>
				`${u.nom} ${u.prenom}`
					.toLowerCase()
					.includes(search.value.toLowerCase()),
			),
	);

	/* =======================
Actions Utilisateurs
======================= */
	const blockUser = async (user: any) => {
		const result = await Swal.fire({
			title: `Bloquer ${user.nom} ${user.prenom} ?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Oui, bloquer",
			cancelButtonText: "Annuler",
		});
		if (result.isConfirmed) {
			await adminStore.lockUser(user.id);
			toast.success({ message: `${user.nom} a été bloqué.` });
		}
	};

	const unblockUser = async (user: any) => {
		const result = await Swal.fire({
			title: `Débloquer ${user.nom} ${user.prenom} ?`,
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Oui, débloquer",
			cancelButtonText: "Annuler",
		});
		if (result.isConfirmed) {
			await adminStore.unlockUser(user.id);
			toast.success({ message: `${user.nom} a été débloqué.` });
		}
	};

	const removeAdminRole = async (user: any) => {
		const result = await Swal.fire({
			title: `Retirer le rôle admin à ${user.nom} ${user.prenom} ?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Oui",
			cancelButtonText: "Annuler",
		});
		if (result.isConfirmed) {
			await adminStore.makeUser(user.id);
			Swal.fire("Succès!", `${user.nom} n'est plus admin.`, "success");
		}
	};

	/* =======================
Lifecycle
======================= */
	onMounted(async () => {
		try {
			isPageLoading.value = true;
			await adminStore.fetchAllUsers();

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
