<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Stocks', to: '/stocks' },
				{ label: 'Mouvements', to: null },
			]"
			title="Mouvements de stock"
		/>

		<div class="max-w-3xl mx-auto">
			<form @submit.prevent="submitMouvement" class="space-y-6">
				<div class="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
					<h2 class="text-xl font-semibold text-[#6a0d5f] mb-4 border-b pb-2">
						Nouveau mouvement
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Livre -->
						<div class="md:col-span-2">
							<label
								for="livre"
								class="block mb-1 font-medium text-black dark:text-gray-200"
							>
								Livre <span class="text-[#6a0d5f]">*</span>
							</label>
							<select
								id="livre"
								v-model="mouvement.livre"
								required
								class="w-full border rounded-xl p-2 bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6a0d5f]"
							>
								<option value="" disabled>-- Sélectionner un livre --</option>
								<option v-for="l in livres" :key="l.id" :value="l.titre">
									{{ l.titre }}
								</option>
							</select>
						</div>

						<!-- Type -->
						<div>
							<label
								for="type"
								class="block mb-1 font-medium text-black dark:text-gray-200"
							>
								Type de mouvement <span class="text-[#6a0d5f]">*</span>
							</label>
							<select
								id="type"
								v-model="mouvement.type"
								required
								class="w-full border rounded-xl p-2 bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6a0d5f]"
							>
								<option value="" disabled>-- Choisir --</option>
								<option value="entree">Entrée de stock</option>
								<option value="sortie">Sortie de stock</option>
							</select>
						</div>

						<!-- Quantité -->
						<div>
							<label
								for="quantite"
								class="block mb-1 font-medium text-black dark:text-gray-200"
							>
								Quantité <span class="text-[#6a0d5f]">*</span>
							</label>
							<input
								id="quantite"
								v-model.number="mouvement.quantite"
								type="number"
								min="1"
								required
								placeholder="Ex : 10"
								class="w-full border rounded-xl p-2 bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6a0d5f]"
							/>
						</div>

						<!-- Commentaire -->
						<div class="md:col-span-2">
							<label
								for="commentaire"
								class="block mb-1 font-medium text-black dark:text-gray-200"
							>
								Commentaire (optionnel)
							</label>
							<textarea
								id="commentaire"
								v-model="mouvement.commentaire"
								rows="3"
								placeholder="Ex : Réapprovisionnement fournisseur"
								class="w-full border rounded-xl p-2 bg-white dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#6a0d5f]"
							/>
						</div>
					</div>
				</div>

				<!-- Boutons -->
				<div class="flex gap-4">
					<button
						type="submit"
						:disabled="isSubmitting"
						class="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6a0d5f] to-[#520a49]"
					>
						{{ isSubmitting ? "Enregistrement..." : "Valider le mouvement" }}
					</button>

					<button
						type="button"
						@click="resetForm"
						class="flex-1 px-4 py-3 rounded-xl border font-semibold dark:border-gray-600 dark:text-gray-200"
					>
						Réinitialiser
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";

	/* Livres (statique) */
	const livres = [
		{ id: 1, titre: "Foi Chrétienne" },
		{ id: 2, titre: "Vie de Prière" },
		{ id: 3, titre: "Leadership Chrétien" },
	];

	/* Mouvement */
	const mouvement = ref({
		livre: "",
		type: "",
		quantite: null,
		commentaire: "",
	});

	const isSubmitting = ref(false);

	const resetForm = () => {
		mouvement.value = {
			livre: "",
			type: "",
			quantite: null,
			commentaire: "",
		};
	};

	const submitMouvement = async () => {
		isSubmitting.value = true;
		await new Promise((r) => setTimeout(r, 500));
		alert("Mouvement de stock enregistré !");
		resetForm();
		isSubmitting.value = false;
	};
</script>
