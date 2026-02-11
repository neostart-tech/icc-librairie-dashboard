<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Livres', to: '/livres' },
				{ label: 'Ajouter', to: null },
			]"
			title="Ajouter un livre"
		/>

		<!-- Formulaire + Aperçu -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
			<!-- Formulaire -->
			<div class="lg:col-span-2">
				<form @submit.prevent="submitLivre" class="space-y-6">
					<div class="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
						<h2 class="text-xl font-semibold text-[#6a0d5f] mb-4 border-b pb-2">
							Informations du livre
						</h2>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- Titre -->
							<div class="md:col-span-2">
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
									for="titre"
								>
									Titre du livre <span class="text-[#6a0d5f]">*</span>
								</label>
								<input
									id="titre"
									v-model="livre.titre"
									type="text"
									placeholder="Ex: Foi Chrétienne"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
									required
								/>
							</div>

							<!-- Auteur -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
									for="auteur"
								>
									Auteur <span class="text-[#6a0d5f]"></span>
								</label>
								<input
									id="auteur"
									v-model="livre.auteur"
									type="text"
									placeholder="Ex: Jean Dupont"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
								/>
							</div>

							<!-- Catégorie -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
									for="categorie"
								>
									Catégorie <span class="text-[#6a0d5f]">*</span>
								</label>
								<select
									v-model="livre.categorie_id"
									required
									class="w-full border rounded-xl p-2 bg-white dark:bg-gray-800"
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

							<!-- Prix -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
									for="prix"
								>
									Prix (FCFA) <span class="text-[#6a0d5f]">*</span>
								</label>
								<input
									id="prix"
									v-model.number="livre.prix"
									type="number"
									min="0"
									placeholder="0.00"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
									required
								/>
							</div>

							<!-- Stock -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
									for="stock"
								>
									Quantité en stock <span class="text-[#6a0d5f]">*</span>
								</label>
								<input
									id="stock"
									v-model.number="livre.stock"
									type="number"
									min="0"
									placeholder="0"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
									required
								/>
							</div>

							<!-- Prix -->
							<div>
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
									for="prix"
								>
									Prix Promo (FCFA) <span class="text-[#6a0d5f]"></span>
								</label>
								<input
									id="prix"
									v-model.number="livre.prix_promo"
									type="number"
									min="0"
									placeholder="0.00"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
								/>
							</div>

							<!-- Image -->
							<div class="md:col-span-2">
								<label
									class="block mb-2 font-medium text-black dark:text-gray-200"
									>Image du livre</label
								>
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

							<!-- Description -->
							<div class="md:col-span-2">
								<label
									class="block mb-1 font-medium text-black dark:text-gray-200"
									for="description"
								>
									Description (optionnelle)
								</label>
								<textarea
									id="description"
									v-model="livre.description"
									rows="4"
									placeholder="Ajouter une description du livre..."
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
								></textarea>
							</div>
						</div>
					</div>

					<!-- Boutons -->
					<div class="flex gap-4 mt-4">
						<button
							type="submit"
							:disabled="isSubmitting"
							class="flex-1 px-4 py-3 bg-gradient-to-r from-[#6a0d5f] to-[#520a49] text-white font-semibold rounded-xl"
						>
							{{ isSubmitting ? "Ajout en cours..." : "Ajouter le livre" }}
						</button>
						<button
							type="button"
							@click="resetForm"
							class="flex-1 px-4 py-3 border rounded-xl font-semibold dark:border-gray-600 dark:text-gray-200"
						>
							Réinitialiser
						</button>
					</div>
				</form>
			</div>

			<!-- Aperçu -->
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
								alt="Aperçu"
								class="h-full w-full object-cover"
							/>
							<div v-else class="text-gray-400 dark:text-gray-400 text-center">
								Aucune image sélectionnée
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
						</p>
						<p class="text-gray-600 dark:text-gray-300">
							{{ livre.stock }} unités
						</p>
						<p class="text-gray-700 dark:text-gray-300">
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
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import { useLivreStore } from "~~/stores/livre";
	import { useCategorieStore } from "~~/stores/categorie";
	import { useStockStore } from "~~/stores/stock";
	import { useToast } from "#imports";
	import { useRouter } from "vue-router";

	const livre = ref({
		titre: "",
		auteur: "",
		categorie_id: null as number | null,
		prix: 0,
		prix_promo: null as number | null,
		stock: 0, // juste pour l’UI
		description: "",
		image: null as File | null,
	});

	const livreStore = useLivreStore();
	const categorieStore = useCategorieStore();
	const stockStore = useStockStore();
	const router = useRouter();
	const toast = useToast();

	const imagePreview = ref(null);
	const MAX_IMAGE_SIZE = 4096 * 1024;
	const isSubmitting = ref(false);

	const handleFile = (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (!input.files || !input.files.length) return;

		const file = input.files[0];

		// Vérification taille
		if (file.size > 4096 * 1024) {
			toast.error({
				message:
					"L’image dépasse 4 Mo. Veuillez choisir une image plus légère.",
			});

			// Reset input + state
			input.value = "";
			livre.value.image = null;
			imagePreview.value = null;
			return;
		}

		// OK
		livre.value.image = file;

		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview.value = e.target?.result;
		};
		reader.readAsDataURL(file);
	};

	const resetForm = () => {
		livre.value = {
			titre: "",
			auteur: "",
			categorie_id: null,
			prix: 0,
			prix_promo: null,
			stock: 0,
			description: "",
			image: null,
		};
		imagePreview.value = null;
	};

	const submitLivre = async () => {
		try {
			isSubmitting.value = true;

			/* Création du livre */
			const newLivre = await livreStore.createLivre({
				titre: livre.value.titre,
				auteur: livre.value.auteur,
				description: livre.value.description,
				prix: livre.value.prix,
				prix_promo: livre.value.prix_promo ?? undefined,
				categorie_id: livre.value.categorie_id!,
				images: livre.value.image ? [livre.value.image] : [],
			});

			/* Entrée de stock si quantité > 0 */
			if (livre.value.stock > 0) {
				await stockStore.addMouvement({
					livre_id: newLivre.id,
					type: "entree",
					quantite: livre.value.stock,
					commentaire: "Stock initial",
				});
			}

			toast.success({ message: "Livre ajouté avec succès" });
			await router.push("/livres");
		} catch (e: any) {
			toast.error({ message: e?.message || "Erreur lors de l’ajout" });
		} finally {
			isSubmitting.value = false;
		}
	};

	onMounted(async () => {
		await categorieStore.fetchCategories();
	});
</script>
