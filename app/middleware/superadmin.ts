// middleware/superadmin.ts
import { navigateTo } from "#imports";
import { useUserStore } from "~~/stores/user";

export default defineNuxtRouteMiddleware(async () => {
	if (!import.meta.client) return;

	const userStore = useUserStore();

	// Charger l'utilisateur si pas encore fait
	if (!userStore.loading) {
		await userStore.fetchProfile();
	}

	// Pas connecté
	if (!userStore.user) {
		return navigateTo("/403");
	}

	// Pas superadmin
	if (userStore.user.role?.role !== "superadmin") {
		return navigateTo("/403");
	}
});
