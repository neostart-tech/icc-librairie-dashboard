import { defineStore } from "pinia";
import { ref } from "vue";

export interface User {
	id: string;
	nom: string;
	prenom: string;
	email: string;
	telephone?: string;
	role_id: number;
	statut: string;
	created_at: string;
	updated_at: string;
	role?: {
		id: number;
		role: string;
	};
}

export const useAdminStore = defineStore("admin", () => {
	/* STATES */
	const users = ref<User[]>([]);
	const selectedUser = ref<User | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const success = ref<string | null>(null);

	/* FETCH ALL USERS */
	const fetchAllUsers = async () => {
		loading.value = true;
		error.value = null;
		try {
			const { $api } = useNuxtApp();
			const res = await $api("/admins/all-users");
			users.value = res.data ?? [];
		} catch (e: any) {
			error.value =
				e.message || "Erreur lors de la récupération des utilisateurs";
		} finally {
			loading.value = false;
		}
	};

	/* FETCH SINGLE USER */
	const fetchUser = async (id: string) => {
		loading.value = true;
		error.value = null;
		try {
			const { $api } = useNuxtApp();
			const res = await $api(`/admins/users/${id}`);
			selectedUser.value = res.data;
		} catch (e: any) {
			error.value =
				e.message || "Erreur lors de la récupération de l'utilisateur";
		} finally {
			loading.value = false;
		}
	};

	/* CREATE ADMIN */
	const createAdmin = async (payload: any) => {
		loading.value = true;
		error.value = null;
		success.value = null;
		try {
			const { $api } = useNuxtApp();
			const res = await $api.post("/admins", payload);
			users.value.unshift(res.data.data);
			success.value = res.data.message;
		} catch (e: any) {
			error.value =
				e.response?.data?.message || e.message || "Erreur lors de la création";
		} finally {
			loading.value = false;
		}
	};

	/* UPDATE USER */
	const updateUser = async (id: string, payload: any) => {
		loading.value = true;
		error.value = null;
		success.value = null;
		try {
			const { $api } = useNuxtApp();
			const res = await $api.put(`/admins/${id}`, payload);
			// Met à jour dans le tableau
			const index = users.value.findIndex((u) => u.id === id);
			if (index !== -1) users.value[index] = res.data.data;
			success.value = res.data.message;
		} catch (e: any) {
			error.value =
				e.response?.data?.message ||
				e.message ||
				"Erreur lors de la mise à jour";
		} finally {
			loading.value = false;
		}
	};

	/* DELETE USER */
	const deleteUser = async (id: string) => {
		loading.value = true;
		error.value = null;
		success.value = null;
		try {
			const { $api } = useNuxtApp();
			const res = await $api.delete(`/admins/${id}`);
			users.value = users.value.filter((u) => u.id !== id);
			success.value = res.data.message;
		} catch (e: any) {
			error.value =
				e.response?.data?.message ||
				e.message ||
				"Erreur lors de la suppression";
		} finally {
			loading.value = false;
		}
	};

	/* PROMOTE / DEMOTE / LOCK / UNLOCK */
	const makeAdmin = async (id: string) => {
		const { $api } = useNuxtApp();
		await $api.put(`/admins/${id}/make-admin`);
		await fetchAllUsers();
	};

	const makeUser = async (id: string) => {
		const { $api } = useNuxtApp();
		await $api.put(`/admins/${id}/make-user`);
		await fetchAllUsers();
	};

	const lockUser = async (id: string) => {
		loading.value = true;
		error.value = null;
		success.value = null;
		try {
			const { $api } = useNuxtApp();
			const res = await $api(`/admins/${id}/lock`, {
				method: "PUT",
			});
			// Mettre à jour localement pour que la UI réagisse immédiatement
			const index = users.value.findIndex((u) => u.id === id);
			if (index !== -1) {
				users.value[index].statut = "inactif"; // met à jour localement
			}
			success.value = res.data.message || "Utilisateur bloqué";
		} catch (e: any) {
			error.value =
				e.response?.data?.message || e.message || "Erreur lors du blocage";
		} finally {
			loading.value = false;
		}
	};

	const unlockUser = async (id: string) => {
		loading.value = true;
		error.value = null;
		success.value = null;
		try {
			const { $api } = useNuxtApp();
			const res = await $api(`/admins/${id}/unlock`, {
				method: "PUT",
			});
			const index = users.value.findIndex((u) => u.id === id);
			if (index !== -1) {
				users.value[index].statut = "actif";
			}
			success.value = res.data.message || "Utilisateur débloqué";
		} catch (e: any) {
			error.value =
				e.response?.data?.message || e.message || "Erreur lors du déblocage";
		} finally {
			loading.value = false;
		}
	};

	return {
		users,
		selectedUser,
		loading,
		error,
		success,
		fetchAllUsers,
		fetchUser,
		createAdmin,
		updateUser,
		deleteUser,
		makeAdmin,
		makeUser,
		lockUser,
		unlockUser,
	};
});
