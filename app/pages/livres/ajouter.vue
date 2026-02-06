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
									Auteur <span class="text-[#6a0d5f]">*</span>
								</label>
								<input
									id="auteur"
									v-model="livre.auteur"
									type="text"
									placeholder="Ex: Jean Dupont"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
									required
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
									id="categorie"
									v-model="livre.categorie"
									class="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f] bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 appearance-none"
									required
								>
									<option value="" disabled>-- Choisir une catégorie --</option>
									<option value="Vie Chrétienne et Spiritualité">
										Vie Chrétienne et Spiritualité
									</option>
									<option value="Mission et Évangélisation">
										Mission et Évangélisation
									</option>
									<option value="Famille et Education">
										Famille et Education
									</option>
									<option value="Théologie et Doctrine">
										Théologie et Doctrine
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
							{{ livre.categorie || "Catégorie" }}
						</p>
						<p class="font-bold text-gray-900 dark:text-gray-200">
							{{ livre.prix ? `${livre.prix} FCFA` : "0 FCFA" }}
						</p>
						<p class="text-gray-600 dark:text-gray-300">
							{{ livre.stock !== null ? livre.stock + " unités" : "0" }}
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

<script setup>
	import { ref } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";

	const livre = ref({
		titre: "",
		auteur: "",
		categorie: "",
		prix: null,
		stock: null,
		image: null,
		description: "",
	});

	const imagePreview = ref(null);
	const isSubmitting = ref(false);

	const handleFile = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		livre.value.image = file;
		const reader = new FileReader();
		reader.onload = (e) => (imagePreview.value = e.target.result);
		reader.readAsDataURL(file);
	};

	const resetForm = () => {
		livre.value = {
			titre: "",
			auteur: "",
			categorie: "",
			prix: null,
			stock: null,
			image: null,
			description: "",
		};
		imagePreview.value = null;
	};

	const submitLivre = async () => {
		isSubmitting.value = true;
		await new Promise((r) => setTimeout(r, 500));
		alert("Livre ajouté !");
		resetForm();
		isSubmitting.value = false;
	};
</script>
