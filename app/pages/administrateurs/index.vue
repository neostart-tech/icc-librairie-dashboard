<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Administrateurs', to: null },
			]"
			title="Gestion des administrateurs"
		/>

		<!-- Header -->
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
					placeholder="Rechercher un administrateur..."
					class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 text-sm"
				/>

				<!-- Boutons -->
				<button
					@click="openModal()"
					class="bg-[#6a0d5f] hover:bg-[#7a1e70] text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
				>
					+ Nouvel Administrateur
				</button>

				<button
					@click="openNommerModal()"
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
				<!-- Actions -->
				<template #actions="data">
					<div class="flex gap-2 justify-end">
						<button
							@click="editAdmin(data.value)"
							class="px-3 py-1 rounded-md text-xs bg-blue-600 hover:bg-blue-700 text-white"
						>
							Modifier
						</button>

						<button
							@click="removeAdminRole(data.value)"
							class="px-3 py-1 rounded-md text-xs bg-red-500 hover:bg-red-600 text-white"
						>
							Retirer le rôle
						</button>
					</div>
				</template>
			</Vue3Datatable>
		</div>

		<!-- Modal Ajouter/Modifier Admin -->
		<div
			v-if="modalOpen"
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
							required
						/>
					</div>

					<div class="flex justify-end space-x-2">
						<button
							type="button"
							@click="closeModal()"
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

		<!-- Modal Nommer Administrateur -->
		<div
			v-if="nommerModalOpen"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6"
			>
				<h3 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">
					Nommer Administrateur
				</h3>

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
							<option v-for="user in users" :key="user.id" :value="user.id">
								{{ user.nom }} {{ user.prenom }} - {{ user.email }}
							</option>
						</select>
					</div>

					<div class="flex justify-end space-x-2">
						<button
							type="button"
							@click="closeNommerModal()"
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
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";

	// Search + dropdown colonnes
	const search = ref("");
	const isDropdownOpen = ref(false);
	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	// Colonnes du tableau
	const allColumns = ref([
		{ field: "nom", title: "Nom", sortable: true, visible: true },
		{ field: "prenom", title: "Prénom", sortable: true, visible: true },
		{ field: "email", title: "Email", sortable: true, visible: true },
		{ field: "telephone", title: "Téléphone", sortable: true, visible: true },
		{
			field: "date",
			title: "Date d'inscription",
			sortable: true,
			visible: true,
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

	// Données fictives
	const rows = ref([
		{
			id: 1,
			nom: "Jean",
			prenom: "Paul",
			email: "jean@mail.com",
			telephone: "90112233",
			date: "02/02/2026",
		},
		{
			id: 2,
			nom: "Anne",
			prenom: "Marie",
			email: "marie@mail.com",
			telephone: "99887766",
			date: "01/02/2026",
		},
	]);

	// Utilisateurs pouvant être nommés
	const users = ref([
		{ id: 3, nom: "Luc", prenom: "Martin", email: "luc@mail.com" },
		{ id: 4, nom: "Sophie", prenom: "Durand", email: "sophie@mail.com" },
	]);

	// Modal Ajouter/Modifier
	const modalOpen = ref(false);
	const isEditing = ref(false);
	const newAdmin = ref({ nom: "", prenom: "", email: "", telephone: "" });
	const openModal = () => {
		isEditing.value = false;
		newAdmin.value = { nom: "", prenom: "", email: "", telephone: "" };
		modalOpen.value = true;
	};
	const closeModal = () => (modalOpen.value = false);

	// Modal Nommer Administrateur
	const nommerModalOpen = ref(false);
	const selectedUserId = ref(null);
	const openNommerModal = () => {
		selectedUserId.value = null;
		nommerModalOpen.value = true;
	};
	const closeNommerModal = () => (nommerModalOpen.value = false);

	// Ajouter / modifier
	const saveAdmin = () => {
		if (isEditing.value) {
			const index = rows.value.findIndex((a) => a.id === newAdmin.value.id);
			if (index !== -1) rows.value[index] = { ...newAdmin.value };
		} else {
			rows.value.push({
				...newAdmin.value,
				id: Date.now(),
				date: new Date().toLocaleDateString(),
				type: "Créé sur site",
			});
		}
		modalOpen.value = false;
	};

	// Modifier depuis tableau
	const editAdmin = (admin) => {
		isEditing.value = true;
		newAdmin.value = { ...admin };
		modalOpen.value = true;
	};

	// Retirer rôle admin (ici juste supprimer)
	const removeAdminRole = (admin) => {
		if (confirm(`Retirer le rôle admin à ${admin.nom} ${admin.prenom} ?`))
			rows.value = rows.value.filter((a) => a.id !== admin.id);
	};

	// Nommer administrateur
	const nommerAdmin = () => {
		const user = users.value.find((u) => u.id === selectedUserId.value);
		if (user) {
			rows.value.push({
				...user,
				id: Date.now(),
				date: new Date().toLocaleDateString(),
			});
			alert(`${user.nom} ${user.prenom} est maintenant administrateur.`);
		}
		nommerModalOpen.value = false;
	};

	onMounted(() => {
		window.addEventListener("click", (e) => {
			if (!e.target.closest(".relative")) closeDropdown();
		});
	});
	onUnmounted(() => window.removeEventListener("click", closeDropdown));

	definePageMeta({
		middleware: ["superadmin"],
	});
</script>
