// middleware/superadmin.ts
import { navigateTo } from "#imports";
import { useUserStore } from "~~/stores/user";

export default defineNuxtRouteMiddleware(() => {
	if (!import.meta.client) return;

	const userStore = useUserStore();

	if (!userStore.user) {
		return navigateTo("/403");
	}

	if (userStore.user.role?.role !== "superadmin") {
		return navigateTo("/403");
	}
});
