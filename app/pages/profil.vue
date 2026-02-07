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
				{ label: 'Profil', to: null },
			]"
			title="Mon profil"
		/>

		<div
			class="mt-6 w-full max-w-full mx-auto bg-white dark:bg-gray-800 shadow rounded-lg px-6 py-6"
		>
			<h2 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">
				Informations personnelles
			</h2>

			<!-- Formulaire infos -->
			<form @submit.prevent="updateProfile" class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Nom</label
						>
						<input
							v-model="form.nom"
							type="text"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Prénom</label
						>
						<input
							v-model="form.prenom"
							type="text"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
						/>
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Email</label
						>
						<input
							v-model="form.email"
							type="email"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300"
							>Téléphone</label
						>
						<input
							v-model="form.telephone"
							type="text"
							class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
						/>
					</div>
				</div>

				<button
					type="submit"
					:disabled="loadingProfile"
					class="bg-[#6a0d5f] hover:bg-[#7a1e70] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
				>
					{{ loadingProfile ? "Mise à jour..." : "Mettre à jour" }}
				</button>
			</form>

			<div class="my-6 border-t border-gray-300 dark:border-gray-600"></div>

			<h2 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">
				Changer le mot de passe
			</h2>

			<form @submit.prevent="updatePassword" class="space-y-4">
				<!-- Mot de passe actuel -->
				<div class="relative">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Mot de passe actuel
					</label>
					<input
						v-model="passwordForm.current_password"
						:type="showCurrentPassword ? 'text' : 'password'"
						class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
					/>
					<button
						type="button"
						@click="showCurrentPassword = !showCurrentPassword"
						class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
					>
						<svg
							v-if="showCurrentPassword"
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mt-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<!-- œil barré -->
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-5s2.221-3.368 5.36-5.22M3 3l18 18"
							/>
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mt-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<!-- œil ouvert -->
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
								d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
							/>
						</svg>
					</button>
				</div>

				<!-- Nouveau mot de passe -->
				<div class="relative">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Nouveau mot de passe
					</label>
					<input
						v-model="passwordForm.new_password"
						:type="showNewPassword ? 'text' : 'password'"
						class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
					/>
					<button
						type="button"
						@click="showNewPassword = !showNewPassword"
						class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
					>
						<svg
							v-if="showNewPassword"
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mt-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-5s2.221-3.368 5.36-5.22M3 3l18 18"
							/>
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mt-5"
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
								d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
							/>
						</svg>
					</button>
				</div>

				<!-- Confirmer le mot de passe -->
				<div class="relative">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Confirmer le nouveau mot de passe
					</label>
					<input
						v-model="passwordForm.confirm_password"
						:type="showConfirmPassword ? 'text' : 'password'"
						class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
					/>
					<button
						type="button"
						@click="showConfirmPassword = !showConfirmPassword"
						class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
					>
						<svg
							v-if="showConfirmPassword"
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mt-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-5s2.221-3.368 5.36-5.22M3 3l18 18"
							/>
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mt-5"
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
								d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
							/>
						</svg>
					</button>
				</div>

				<button
					type="submit"
					:disabled="loadingPassword"
					class="bg-[#6a0d5f] hover:bg-[#7a1e70] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
				>
					{{ loadingPassword ? "Mise à jour..." : "Changer le mot de passe" }}
				</button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { useUserStore } from "~~/stores/user";
	import { useToast } from "#imports";
	import Breadcrumb from "~/components/Breadcrumb.vue";

	const toast = useToast();
	const userStore = useUserStore();

	const form = ref({
		nom: "",
		prenom: "",
		email: "",
		telephone: "",
	});

	const passwordForm = ref({
		current_password: "",
		new_password: "",
		confirm_password: "",
	});

	const showCurrentPassword = ref(false);
	const showNewPassword = ref(false);
	const showConfirmPassword = ref(false);

	const loadingProfile = ref(false);
	const loadingPassword = ref(false);
	const isPageLoading = ref(true);

	onMounted(async () => {
		try {
			isPageLoading.value = true;
			await userStore.fetchProfile();
			if (userStore.user) {
				form.value.nom = userStore.user.nom;
				form.value.prenom = userStore.user.prenom;
				form.value.email = userStore.user.email;
				form.value.telephone = userStore.user.telephone || "";
			}
		} catch (e) {
			toast.error({ message: "Impossible de charger le profil." });
		} finally {
			isPageLoading.value = false;
		}
	});

	const updateProfile = async () => {
		loadingProfile.value = true;
		try {
			await userStore.updateProfile(form.value);
			toast.success({ message: "Profil mis à jour avec succès !" });
		} catch (e: any) {
			toast.error({
				message: e.message || "Erreur lors de la mise à jour du profil.",
			});
		} finally {
			loadingProfile.value = false;
		}
	};

	const updatePassword = async () => {
		if (
			passwordForm.value.new_password !== passwordForm.value.confirm_password
		) {
			toast.error({
				message: "Les nouveaux mots de passe ne correspondent pas !",
			});
			return;
		}

		loadingPassword.value = true;
		try {
			await userStore.updatePassword({
				current_password: passwordForm.value.current_password,
				new_password: passwordForm.value.new_password,
			});
			toast.success({ message: "Mot de passe mis à jour avec succès !" });
			passwordForm.value.current_password = "";
			passwordForm.value.new_password = "";
			passwordForm.value.confirm_password = "";
		} catch (e: any) {
			toast.error({
				message: e.message || "Erreur lors de la mise à jour du mot de passe.",
			});
		} finally {
			loadingPassword.value = false;
		}
	};
</script>

<style scoped>
	input:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(106, 13, 95, 0.5);
	}
</style>
