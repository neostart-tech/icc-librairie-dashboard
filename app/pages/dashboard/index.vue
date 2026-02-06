<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[{ label: 'Tableau de Bord', to: '/' }]"
			title="Tableau de Bord"
			title-class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-white"
			spacing="mb-4"
		/>

		<!-- Cartes statistiques améliorées -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
			<!-- CA -->
			<a href="/dashboard/chiffre-affaire">
				<div
					class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
				>
					<p
						class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
					>
						Chiffre d'affaires
					</p>
					<p class="mt-3 text-2xl font-bold text-green-600 dark:text-green-400">
						2 450 000 FCFA
					</p>
					<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Ce mois</p>
				</div>
			</a>

			<!-- Commandes -->
			<a href="/commandes">
				<div
					class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
				>
					<p
						class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
					>
						Commandes
					</p>
					<p class="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
						128
					</p>
					<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Ce mois</p>
				</div>
			</a>

			<!-- En attente -->
			<a href="/commandes">
				<div
					class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
				>
					<p
						class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
					>
						En attente
					</p>
					<p
						class="mt-3 text-2xl font-bold text-orange-600 dark:text-orange-400"
					>
						9
					</p>
					<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Commandes</p>
				</div>
			</a>

			<!-- Livres disponibles -->
			<a href="/livres">
				<div
					class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
				>
					<p
						class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
					>
						Disponibles
					</p>
					<p class="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
						1 420
					</p>
					<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Livres</p>
				</div>
			</a>

			<!-- Rupture -->
			<a href="/livres">
				<div
					class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
				>
					<p
						class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
					>
						Rupture
					</p>
					<p class="mt-3 text-2xl font-bold text-red-600 dark:text-red-400">
						17
					</p>
					<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Livres</p>
				</div>
			</a>

			<!-- Clients -->
			<a href="/utilisateurs">
				<div
					class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
				>
					<p
						class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
					>
						Clients
					</p>
					<p class="mt-3 text-2xl font-bold text-gray-800 dark:text-gray-100">
						356
					</p>
					<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Total</p>
				</div>
			</a>

			<!-- Livres vendus -->
			<div
				class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
			>
				<p
					class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
				>
					Ventes du mois
				</p>
				<p class="mt-3 text-2xl font-bold text-[#6a0d5f]">684</p>
				<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Livres</p>
			</div>
		</div>

		<!-- Graphique amélioré -->
		<div
			class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md"
		>
			<!-- En-tête du graphique -->
			<div class="mb-6">
				<h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
					Ventes des 30 derniers jours
				</h2>
				<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
					Nombre de livres vendus par jour
				</p>
			</div>

			<!-- Graphique SVG amélioré -->
			<div class="relative overflow-x-auto">
				<svg viewBox="0 0 620 220" class="w-full h-52">
					<!-- Fond avec grille -->
					<defs>
						<pattern
							id="grid"
							width="40"
							height="40"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M 40 0 L 0 0 0 40"
								fill="none"
								stroke="currentColor"
								stroke-opacity="0.1"
								stroke-width="1"
							/>
						</pattern>
					</defs>
					<rect
						x="50"
						y="10"
						width="560"
						height="160"
						fill="url(#grid)"
						class="text-gray-300 dark:text-gray-700"
					/>

					<!-- Axes avec améliorations -->
					<line
						x1="50"
						y1="10"
						x2="50"
						y2="170"
						stroke="#9ca3af"
						stroke-width="1.5"
					/>
					<line
						x1="50"
						y1="170"
						x2="610"
						y2="170"
						stroke="#9ca3af"
						stroke-width="1.5"
					/>

					<!-- Points de données -->
					<circle cx="50" cy="150" r="4" fill="#6a0d5f" />
					<circle cx="70" cy="140" r="4" fill="#6a0d5f" />
					<circle cx="90" cy="130" r="4" fill="#6a0d5f" />
					<circle cx="110" cy="135" r="4" fill="#6a0d5f" />
					<circle cx="130" cy="120" r="4" fill="#6a0d5f" />
					<circle cx="150" cy="110" r="4" fill="#6a0d5f" />
					<circle cx="170" cy="115" r="4" fill="#6a0d5f" />
					<circle cx="190" cy="100" r="4" fill="#6a0d5f" />
					<circle cx="210" cy="95" r="4" fill="#6a0d5f" />
					<circle cx="230" cy="90" r="4" fill="#6a0d5f" />
					<circle cx="250" cy="100" r="4" fill="#6a0d5f" />
					<circle cx="270" cy="85" r="4" fill="#6a0d5f" />
					<circle cx="290" cy="80" r="4" fill="#6a0d5f" />
					<circle cx="310" cy="75" r="4" fill="#6a0d5f" />
					<circle cx="330" cy="70" r="4" fill="#6a0d5f" />
					<circle cx="350" cy="78" r="4" fill="#6a0d5f" />
					<circle cx="370" cy="65" r="4" fill="#6a0d5f" />
					<circle cx="390" cy="60" r="4" fill="#6a0d5f" />
					<circle cx="410" cy="55" r="4" fill="#6a0d5f" />
					<circle cx="430" cy="58" r="4" fill="#6a0d5f" />
					<circle cx="450" cy="50" r="4" fill="#6a0d5f" />
					<circle cx="470" cy="48" r="4" fill="#6a0d5f" />
					<circle cx="490" cy="45" r="4" fill="#6a0d5f" />
					<circle cx="510" cy="42" r="4" fill="#6a0d5f" />
					<circle cx="530" cy="40" r="4" fill="#6a0d5f" />
					<circle cx="550" cy="38" r="4" fill="#6a0d5f" />
					<circle cx="570" cy="35" r="4" fill="#6a0d5f" />

					<!-- Courbe avec remplissage dégradé -->
					<defs>
						<linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stop-color="#6a0d5f" stop-opacity="0.3" />
							<stop offset="100%" stop-color="#6a0d5f" stop-opacity="0" />
						</linearGradient>
					</defs>

					<!-- Remplissage sous la courbe -->
					<path
						d="
              M 50,150
              L 70,140 90,130 110,135 130,120 150,110
              170,115 190,100 210,95 230,90 250,100
              270,85 290,80 310,75 330,70 350,78
              370,65 390,60 410,55 430,58 450,50
              470,48 490,45 510,42 530,40 550,38 570,35
              L 570,170 50,170 Z
            "
						fill="url(#lineGradient)"
					/>

					<!-- Courbe principale -->
					<polyline
						fill="none"
						stroke="#6a0d5f"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						points="
              50,150 70,140 90,130 110,135 130,120 150,110
              170,115 190,100 210,95 230,90 250,100
              270,85 290,80 310,75 330,70 350,78
              370,65 390,60 410,55 430,58 450,50
              470,48 490,45 510,42 530,40 550,38 570,35
            "
					/>
				</svg>
			</div>

			<!-- Légende -->
			<div class="flex justify-center items-center mt-4">
				<div class="flex items-center space-x-2">
					<div class="w-3 h-3 rounded-full bg-[#6a0d5f]"></div>
					<span class="text-sm text-gray-600 dark:text-gray-300"
						>Livres vendus par jour</span
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import Breadcrumb from "~/components/Breadcrumb.vue";
</script>
