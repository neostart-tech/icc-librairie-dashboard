<template>
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
					class="bg-[#6a0d5f] hover:bg-[#7a1e70] text-white font-medium py-2 px-4 rounded-lg transition-colors"
				>
					Mettre à jour
				</button>
			</form>

			<div class="my-6 border-t border-gray-300 dark:border-gray-600"></div>

			<h2 class="text-lg font-semibold text-gray-700 dark:text-white mb-4">
				Changer le mot de passe
			</h2>

			<form @submit.prevent="updatePassword" class="space-y-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Mot de passe actuel</label
					>
					<input
						v-model="passwordForm.current_password"
						type="password"
						class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
					/>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Nouveau mot de passe</label
					>
					<input
						v-model="passwordForm.new_password"
						type="password"
						class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
					/>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Confirmer le nouveau mot de passe</label
					>
					<input
						v-model="passwordForm.confirm_password"
						type="password"
						class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/50"
					/>
				</div>

				<button
					type="submit"
					class="bg-[#6a0d5f] hover:bg-[#7a1e70] text-white font-medium py-2 px-4 rounded-lg transition-colors"
				>
					Changer le mot de passe
				</button>
			</form>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { useUserStore } from "~~/stores/user";

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

	onMounted(async () => {
		await userStore.fetchProfile();
		if (userStore.user) {
			form.value.nom = userStore.user.nom;
			form.value.prenom = userStore.user.prenom;
			form.value.email = userStore.user.email;
			form.value.telephone = userStore.user.telephone || "";
		}
	});

	const updateProfile = async () => {
		try {
			await userStore.updateProfile(form.value);
			alert("Profil mis à jour avec succès !");
		} catch (e) {
			alert("Erreur lors de la mise à jour du profil.");
		}
	};

	const updatePassword = async () => {
		if (
			passwordForm.value.new_password !== passwordForm.value.confirm_password
		) {
			alert("Les nouveaux mots de passe ne correspondent pas !");
			return;
		}
		try {
			await userStore.updatePassword(passwordForm.value);
			alert("Mot de passe mis à jour avec succès !");
			passwordForm.value.current_password = "";
			passwordForm.value.new_password = "";
			passwordForm.value.confirm_password = "";
		} catch (e) {
			alert("Erreur lors de la mise à jour du mot de passe.");
		}
	};
</script>

<style scoped>
	/* Pour focus sur input en dark mode */
	input:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(106, 13, 95, 0.5);
	}
</style>
