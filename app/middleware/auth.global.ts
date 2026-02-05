// middleware/auth.global.ts
import { navigateTo } from "#imports";
import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
	// Vérifie que le code s'exécute côté client
	if (!import.meta.client) {
		return;
	}

	const auth = useAuthStore();

	// Si l'utilisateur n'est pas connecté et qu'il n'est pas déjà sur la page de login
	if (!auth.isLogged && to.path !== "/login") {
		return navigateTo("/login");
	}
});
