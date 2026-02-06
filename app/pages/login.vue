<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
		<div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
			<!-- TITRE -->
			<div class="text-center mb-8">
				<h1 class="text-2xl font-semibold text-gray-900">
					Connexion Administrateur
				</h1>
				<p class="text-sm text-gray-500 mt-1">Accède à ton espace personnel</p>
			</div>

			<!-- FORMULAIRE -->
			<form class="space-y-5" @submit.prevent="handleLogin">
				<!-- EMAIL -->
				<div>
					<label class="text-sm text-gray-600">Email</label>
					<input
						v-model="email"
						type="email"
						placeholder="email@example.com"
						class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-[#6a0d5f] focus:border-[#6a0d5f]"
						required
					/>
				</div>

				<!-- MOT DE PASSE -->
				<div>
					<label class="text-sm text-gray-600">Mot de passe</label>
					<div class="relative mt-1">
						<input
							v-model="password"
							:type="showPassword ? 'text' : 'password'"
							placeholder="••••••••"
							class="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-[#6a0d5f] focus:border-[#6a0d5f]"
							required
						/>
						<button
							type="button"
							@click="showPassword = !showPassword"
							class="absolute inset-y-0 right-3 flex items-center text-gray-500"
						>
							<svg
								v-if="!showPassword"
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
							<svg
								v-else
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.96 9.96 0 012.219-3.423m1.43-1.1A9.963 9.963 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.481 2.563M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 3l18 18"
								/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Erreur -->
				<p v-if="error" class="text-sm text-red-600 text-center">
					{{ error }}
				</p>

				<div class="flex justify-between items-center text-sm">
					<label class="flex items-center gap-2 text-gray-600">
						<input type="checkbox" class="rounded border-gray-300" />
						Se souvenir de moi
					</label>
					<a href="#" class="text-[#6a0d5f] hover:underline">
						Mot de passe oublié ?
					</a>
				</div>

				<button
					:disabled="auth.loading"
					class="w-full bg-[#6a0d5f] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-60"
				>
					{{ auth.loading ? "Connexion..." : "Se connecter" }}
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useAuthStore } from "~~/stores/auth";
	import { ref, onMounted } from "vue";
	import { useRoute, useRouter } from "vue-router";

	// Redirige si l'utilisateur est déjà connecté
	onMounted(() => {
		if (auth.isLogged) {
			navigateTo("/");
		}
	});

	const router = useRouter();
	const auth = useAuthStore();
	const route = useRoute();
	const email = ref("");
	const password = ref("");
	const showPassword = ref(false);
	const error = ref("");
	const handleLogin = async () => {
		error.value = "";

		try {
			await auth.login(email.value, password.value);

			const redirect =
				typeof route.query.redirect === "string"
					? route.query.redirect
					: router.options.history.state.back || "/";

			navigateTo(redirect);
			const toast = useToast();
			toast.success({ message: "Heureux de vous revoir !" });
		} catch (e: any) {
			error.value = e.message;
		}
	};

	definePageMeta({
		layout: false,
	});
</script>
