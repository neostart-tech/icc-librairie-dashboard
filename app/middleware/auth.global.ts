// middleware/auth.global.ts
import { navigateTo } from "#imports";
import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware((to) => {
	// Vérifie que le code s'exécute côté client
	if (!import.meta.client) {
		return;
	}

	const auth = useAuthStore();

	// Chemins autorisés sans connexion
	const publicPaths = ["/login", "/forgot-password", "/reset-password", "/reset-password/"];

	// Si l'utilisateur n'est pas connecté et que la route n'est pas publique
	if (!auth.isLogged && !publicPaths.includes(to.path)) {
		return navigateTo("/login");
	}
});
