<!-- components/Breadcrumb.vue -->
<template>
	<div class="w-full">
		<!-- Container principal -->
		<div class="mb-6">
			<!-- Zone du titre et fil d'Ariane -->
			<div class="flex flex-col space-y-3">
				<!-- Breadcrumb minimaliste -->
				<nav class="w-full" aria-label="Fil d'Ariane">
					<div class="flex items-center">
						<!-- Bouton retour (optionnel) -->
						<button
							v-if="showBackButton && items.length > 1"
							@click="handleBack"
							class="flex items-center space-x-1 mr-4 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
						>
							<svg
								class="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							<span>Retour</span>
						</button>

						<!-- Breadcrumb élégant -->
						<ol class="flex items-center space-x-1">
							<li
								v-for="(item, index) in items"
								:key="index"
								class="flex items-center"
							>
								<!-- Élément de navigation -->
								<component
									:is="item.to ? NuxtLink : 'span'"
									:to="item.to"
									class="inline-flex items-center px-2.5 py-1 text-sm font-medium rounded transition-colors"
									:class="[
										index === items.length - 1
											? [
													'text-gray-900 dark:text-white',
													'bg-gray-100 dark:bg-gray-800',
													activeColor,
												]
											: [
													'text-gray-500 dark:text-gray-400',
													'hover:text-gray-700 dark:hover:text-gray-300',
													'hover:bg-gray-50 dark:hover:bg-gray-800/50',
													linkColor,
												],
										item.to ? 'cursor-pointer' : 'cursor-default',
									]"
								>
									<!-- Icône optionnelle -->
									<svg
										v-if="item.icon"
										class="w-3.5 h-3.5 mr-1.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											:d="item.icon"
										/>
									</svg>

									<!-- Label -->
									<span class="whitespace-nowrap">
										{{ item.label }}
									</span>

									<!-- Badge optionnel (discrètement) -->
									<span
										v-if="item.badge"
										class="ml-1.5 px-1.5 py-0.5 text-xs font-medium rounded"
										:class="
											item.badgeClass ||
											'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
										"
									>
										{{ item.badge }}
									</span>
								</component>

								<!-- Séparateur élégant -->
								<span
									v-if="index < items.length - 1"
									class="mx-2 text-gray-300 dark:text-gray-700"
									aria-hidden="true"
								>
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</span>
							</li>
						</ol>
					</div>
				</nav>
				<!-- Titre principal -->
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-3">
						<!-- Icone du titre (optionnel) -->
						<div
							v-if="icon"
							class="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
						>
							<svg
								class="w-4 h-4 text-gray-600 dark:text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									:d="icon"
								/>
							</svg>
						</div>

						<!-- Titre -->
						<div>
							<h1
								v-if="title"
								class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white"
							>
								{{ title }}
							</h1>
							<slot v-else name="title" />

							<!-- Description (optionnelle) -->
							<p
								v-if="description"
								class="mt-1 text-sm text-gray-500 dark:text-gray-400"
							>
								{{ description }}
							</p>
						</div>
					</div>

					<!-- Actions (slot) -->
					<div class="flex items-center space-x-2">
						<slot name="actions" />
					</div>
				</div>
			</div>

			<!-- Stats minimalistes (optionnel) -->
			<div v-if="stats && stats.length > 0" class="mt-4 flex flex-wrap gap-3">
				<div
					v-for="(stat, statIndex) in stats"
					:key="statIndex"
					class="flex items-center space-x-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
				>
					<div class="text-sm text-gray-500 dark:text-gray-400">
						{{ stat.label }}:
					</div>
					<div class="text-sm font-medium text-gray-900 dark:text-white">
						{{ stat.value }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { NuxtLink } from "#components";
	// Props du composant
	const props = defineProps({
		// Tableau des items du breadcrumb
		items: {
			type: Array,
			required: true,
			validator: (items) => {
				return items.every(
					(item) =>
						typeof item === "object" &&
						item.label &&
						typeof item.label === "string",
				);
			},
		},

		// Titre de la page
		title: {
			type: String,
			default: null,
		},

		// Description sous le titre
		description: {
			type: String,
			default: null,
		},

		// Icône du titre (chemin SVG)
		icon: {
			type: String,
			default: null,
		},

		// Couleur des liens
		linkColor: {
			type: String,
			default: "",
		},

		// Couleur du lien actif
		activeColor: {
			type: String,
			default: "",
		},

		// Afficher le bouton retour
		showBackButton: {
			type: Boolean,
			default: false,
		},

		// Stats à afficher
		stats: {
			type: Array,
			default: () => [],
		},
	});

	// Émettre un événement pour le bouton retour
	const emit = defineEmits(["back"]);

	// Gestion du clic sur le bouton retour
	const handleBack = () => {
		emit("back");

		// Navigation si un lien est disponible
		if (props.items.length > 1) {
			const prevItem = props.items[props.items.length - 2];
			if (prevItem.to) {
				navigateTo(prevItem.to);
			}
		}
	};
</script>

<style scoped>
	/* Styles spécifiques pour une meilleure accessibilité */
	nav[aria-label="Fil d'Ariane"] {
		font-family:
			-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
			Arial, sans-serif;
	}

	/* Effet de focus pour l'accessibilité */
	:deep(a:focus-visible) {
		outline: 2px solid #4f46e5;
		outline-offset: 2px;
		border-radius: 6px;
	}

	/* Transition douce pour les hover */
	.breadcrumb-link {
		transition-property: color, background-color, border-color;
		transition-duration: 150ms;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
