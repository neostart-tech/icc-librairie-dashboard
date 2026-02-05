import { useAuthStore } from "~~/stores/auth";

export default defineNuxtPlugin(() => {
	const auth = useAuthStore();

	const token = localStorage.getItem("token");
	const user = localStorage.getItem("user");

	if (token) auth.token = token;
	if (user) auth.user = JSON.parse(user);
});
