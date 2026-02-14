<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Livres', to: '/livres' },
				{ label: 'Modifier', to: null },
			]"
			title="Modifier le livre"
		/>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
			<!-- LOADING GLOBAL -->
			<div
				v-if="isPageLoading"
				class="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-gray-900/70"
			>
				<div
					class="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
				></div>
			</div>

			<!-- FORMULAIRE -->
			<div class="lg:col-span-2">
				<form @submit.prevent="submitLivre" class="space-y-6">
					<div class="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
						<h2 class="text-xl font-semibold text-[#6a0d5f] mb-4 border-b pb-2">
							Informations du livre
						</h2>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- TITRE -->
							<div class="md:col-span-2">
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
								>
									Titre du livre <span class="text-[#6a0d5f]">*</span>
								</label>
								<input
									v-model="livre.titre"
									type="text"
									placeholder="Ex: Foi Chrétienne"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
									required
								/>
							</div>

							<!-- AUTEUR -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
								>
									Auteur <span class="text-[#6a0d5f]"></span>
								</label>
								<input
									v-model="livre.auteur"
									type="text"
									placeholder="Ex: Jean Dupont"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
								/>
							</div>

							<!-- CATEGORIE -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
								>
									Catégorie <span class="text-[#6a0d5f]">*</span>
								</label>
								<select
									v-model="livre.categorie_id"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 appearance-none"
									required
								>
									<option value="" disabled>-- Choisir une catégorie --</option>
									<option
										v-for="cat in categorieStore.categories"
										:key="cat.id"
										:value="cat.id"
									>
										{{ cat.libelle }}
									</option>
								</select>
							</div>

							<!-- PRIX -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
								>
									Prix (FCFA) <span class="text-[#6a0d5f]">*</span>
								</label>
								<input
									v-model.number="livre.prix"
									type="number"
									min="0"
									placeholder="0.00"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
									required
								/>
							</div>

							<!-- PRIX PROMO -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
								>
									Prix promo
								</label>
								<input
									v-model.number="livre.prix_promo"
									type="number"
									min="0"
									placeholder="0.00"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
								/>
							</div>

							<!-- IMAGE -->
							<div class="md:col-span-2">
								<label
									class="block mb-2 font-medium text-black dark:text-gray-200"
								>
									Image du livre
								</label>
								<label
									for="image"
									class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#6a0d5f] to-[#520a49] text-white font-semibold rounded-xl cursor-pointer hover:from-[#520a49] hover:to-[#3f0838] transition"
								>
									Choisir une image
								</label>
								<input
									id="image"
									type="file"
									accept="image/*"
									@change="handleFile"
									class="hidden"
								/>
								<div v-if="imagePreview" class="mt-4">
									<img
										:src="imagePreview"
										alt="Aperçu"
										class="h-40 w-32 object-cover rounded-xl border dark:border-gray-600"
									/>
								</div>
							</div>

							<!-- DESCRIPTION -->
							<div class="md:col-span-2">
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
								>
									Description (optionnelle)
								</label>
								<textarea
									v-model="livre.description"
									rows="4"
									placeholder="Ajouter une description du livre..."
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
								></textarea>
							</div>
						</div>
					</div>

					<!-- BOUTON -->
					<div class="flex gap-4 mt-4">
						<button
							type="submit"
							:disabled="isSubmitting"
							class="flex-1 px-4 py-3 bg-gradient-to-r from-[#6a0d5f] to-[#520a49] text-white font-semibold rounded-xl"
						>
							{{ isSubmitting ? "Mise à jour..." : "Mettre à jour le livre" }}
						</button>
					</div>
				</form>
			</div>

			<!-- APERÇU -->
			<div class="lg:col-span-1">
				<div
					class="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 sticky top-4"
				>
					<h2 class="text-lg font-semibold text-[#6a0d5f] mb-2 border-b pb-1">
						Aperçu du livre
					</h2>
					<div class="space-y-2 mt-2">
						<div
							class="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center"
						>
							<img
								v-if="imagePreview"
								:src="imagePreview"
								class="h-full w-full object-cover"
							/>
							<div v-else class="text-gray-400 dark:text-gray-400 text-center">
								Aucune image
							</div>
						</div>
						<h3 class="font-bold text-gray-900 dark:text-gray-200">
							{{ livre.titre || "Titre du livre" }}
						</h3>
						<p class="text-gray-600 dark:text-gray-300">
							{{ livre.auteur || "Auteur" }}
						</p>
						<p class="text-gray-600 dark:text-gray-300">
							{{
								categorieStore.categories.find(
									(c) => c.id === livre.categorie_id,
								)?.libelle || "Catégorie"
							}}
						</p>

						<p class="font-bold text-gray-900 dark:text-gray-200">
							{{ livre.prix ? `${livre.prix} FCFA` : "0 FCFA" }}
							<span v-if="livre.prix_promo" class="text-red-600"
								>→ {{ livre.prix_promo }} FCFA</span
							>
						</p>
						<p class="text-gray-600 dark:text-gray-300">
							{{ livre.stock?.quantite }} unités
						</p>
						<p class="text-gray-700 dark:text-gray-300 text-sm">
							{{ livre.description || "Pas de description" }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import { useRoute, useRouter } from "vue-router";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import { useLivreStore } from "~~/stores/livre";
	import { useCategorieStore } from "~~/stores/categorie";
	import { useToast } from "#imports";

	const isPageLoading = ref(true);

	const route = useRoute();
	const router = useRouter();
	const toast = useToast();

	const livreStore = useLivreStore();
	const categorieStore = useCategorieStore();
	const MAX_IMAGE_SIZE = 4096 * 1024;

	const livre = ref<any>({
		titre: "",
		auteur: "",
		categorie_id: null,
		prix: 0,
		prix_promo: null,
		stock: 0,
		description: "",
		image: null,
	});

	const imagePreview = ref<string | null>(null);
	const isSubmitting = ref(false);

	// Gestion de l'image
	const handleFile = (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (!input.files || !input.files.length) return;

		const file = input.files[0];

		// Vérification taille
		if (file.size > MAX_IMAGE_SIZE) {
			toast.error({
				message: "L’image dépasse 4 Mo. Veuillez en choisir une autre.",
			});

			// On annule la sélection sans casser l’ancienne image
			input.value = "";
			return;
		}

		// Image valide
		livre.value.image = file;
		imagePreview.value = URL.createObjectURL(file);
	};

	onMounted(async () => {
		try {
			isPageLoading.value = true;

			const id = route.params.id as string;
			const data = await livreStore.fetchLivre(id);
			if (!data) return;

			// Normalisation des données pour le formulaire
			livre.value = {
				titre: data.titre || "",
				auteur: data.auteur || "",
				categorie_id: data.categorie_id || 0,
				prix: data.prix ?? 0,
				prix_promo: data.prix_promo ?? null,
				stock: data.stock ?? 0,
				description: data.description || "",
				image: null,
			};

			await categorieStore.fetchCategories();

			// Aperçu de l'image
			imagePreview.value = livreStore.getCoverImage(data);
		} catch (err) {
			toast.error({ message: "Impossible de charger le livre" });
		} finally {
			isPageLoading.value = false;
		}
	});

	const submitLivre = async () => {
		try {
			isSubmitting.value = true;

			const payload: any = {
				titre: livre.value.titre,
				auteur: livre.value.auteur,
				description: livre.value.description,
				prix: livre.value.prix,
				prix_promo: livre.value.prix_promo,
				categorie_id: livre.value.categorie_id,
			};

			// Images : on envoie seulement si un fichier a été sélectionné
			if (livre.value.image) payload.images = [livre.value.image];

			const id = route.params.id as string;
			await livreStore.updateLivre(id, payload);

			toast.success({ message: "Livre mis à jour avec succès" });
			router.push("/livres");
		} catch (err) {
			console.error(err); // pour déboguer l'erreur exacte
			toast.error({ message: "Erreur lors de la mise à jour" });
		} finally {
			isSubmitting.value = false;
		}
	};
</script>
