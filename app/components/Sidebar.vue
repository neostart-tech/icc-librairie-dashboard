<template>
	<aside
		:class="[
			'fixed top-0 left-0 z-40 h-screen transition-all duration-300',
			'bg-white dark:bg-gray-900 border-r border-[#6a0d5f]/20',
			isSidebarOpen
				? 'translate-x-0 w-64'
				: '-translate-x-full lg:translate-x-0 lg:w-20',
		]"
		aria-label="Sidebar"
	>
		<div class="flex flex-col h-full">
			<!-- Contenu scrollable -->
			<div
				class="flex-1 px-3 py-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#6a0d5f]/40 scrollbar-track-transparent"
			>
				<!-- Logo -->
				<div class="flex items-center pl-2.5 mb-8">
					<div class="flex items-center justify-center w-full">
						<div class="h-8 w-8 rounded-lg flex items-center justify-center">
							<img
								src="/logo-icc.jpg"
								alt="Logo ICC-LIBRAIRIE"
								class="h-full w-full object-cover rounded-lg"
							/>
						</div>
						<span
							v-if="isSidebarOpen"
							class="self-center text-xl font-semibold text-[#6a0d5f] ml-3"
						>
							ICC-LIBRAIRIE
						</span>
					</div>
				</div>

				<!-- Navigation -->
				<ul class="space-y-2 font-medium">
					<!-- Dashboard -->
					<li>
						<NuxtLink
							to="/dashboard"
							class="flex items-center p-2 rounded-lg group text-gray-700 dark:text-gray-300 hover:bg-[#6a0d5f]/10"
							:class="{
								'bg-[#6a0d5f]/10 text-[#6a0d5f]': $route.path === '/dashboard',
							}"
						>
							<svg
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
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							<span v-if="isSidebarOpen" class="ml-3">Tableau de bord</span>
						</NuxtLink>
					</li>

					<!-- Catégories -->
					<li>
						<NuxtLink
							to="/categorie"
							class="flex items-center p-2 rounded-lg group text-gray-700 dark:text-gray-300 hover:bg-[#6a0d5f]/10"
							:class="{
								'bg-[#6a0d5f]/10 text-[#6a0d5f]': $route.path === '/categorie',
							}"
						>
							<svg
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
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
							<span v-if="isSidebarOpen" class="ml-3">Catégories</span>
						</NuxtLink>
					</li>

					<!-- Livres -->
					<li>
						<button
							@click="toggleLivres"
							class="flex items-center w-full p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-[#6a0d5f]/10"
							:class="{ 'bg-[#6a0d5f]/10 text-[#6a0d5f]': livresOpen }"
						>
							<svg
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
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.832 5.477 4 6.253v13C4.832 18.477 6.416 19 7.5 19s2.668-.523 3.5-1.253V6.253z"
								/>
							</svg>
							<span v-if="isSidebarOpen" class="ml-3 flex-1 text-left"
								>Livres</span
							>
							<svg
								v-if="isSidebarOpen"
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 transition-transform duration-200"
								:class="{ 'rotate-180': livresOpen }"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						<ul v-if="isSidebarOpen && livresOpen" class="ml-6 mt-2 space-y-1">
							<li>
								<NuxtLink
									to="/livres"
									class="flex items-center p-2 rounded hover:bg-[#6a0d5f]/10 dark:text-gray-300"
									:class="{
										'bg-[#6a0d5f]/10 text-[#6a0d5f]': $route.path === '/livres',
									}"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
										/>
									</svg>
									<span class="ml-2">Liste</span>
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/livres/ajouter"
									class="flex items-center p-2 rounded hover:bg-[#6a0d5f]/10 dark:text-gray-300"
									:class="{
										'bg-[#6a0d5f]/10 text-[#6a0d5f]':
											$route.path === '/livres/ajouter',
									}"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 6v6m0 0v6m0-6h6m-6 0H6"
										/>
									</svg>
									<span class="ml-2">Ajouter</span>
								</NuxtLink>
							</li>
						</ul>
					</li>

					<!-- Stocks -->
					<li>
						<button
							@click="toggleStocks"
							class="flex items-center w-full p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-[#6a0d5f]/10"
							:class="{ 'bg-[#6a0d5f]/10 text-[#6a0d5f]': stocksOpen }"
						>
							<svg
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
									d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
								/>
							</svg>
							<span v-if="isSidebarOpen" class="ml-3 flex-1 text-left"
								>Stocks</span
							>
							<svg
								v-if="isSidebarOpen"
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 transition-transform duration-200"
								:class="{ 'rotate-180': stocksOpen }"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						<ul v-if="isSidebarOpen && stocksOpen" class="ml-6 mt-2 space-y-1">
							<li>
								<NuxtLink
									to="/stocks"
									class="flex items-center p-2 rounded hover:bg-[#6a0d5f]/10 dark:text-gray-300"
									:class="{
										'bg-[#6a0d5f]/10 text-[#6a0d5f]': $route.path === '/stocks',
									}"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span class="ml-2">Derniers mouvements</span>
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/stocks/mouvements"
									class="flex items-center p-2 rounded hover:bg-[#6a0d5f]/10 dark:text-gray-300"
									:class="{
										'bg-[#6a0d5f]/10 text-[#6a0d5f]':
											$route.path === '/stocks/mouvements',
									}"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
										/>
									</svg>
									<span class="ml-2">Entrée / Sortie</span>
								</NuxtLink>
							</li>
						</ul>
					</li>

					<!-- Autres liens simples (Commandes, Paiements, Utilisateurs) -->
					<li>
						<NuxtLink
							to="/commandes"
							class="flex items-center p-2 rounded-lg group text-gray-700 dark:text-gray-300 hover:bg-[#6a0d5f]/10"
							:class="{
								'bg-[#6a0d5f]/10 text-[#6a0d5f]': $route.path === '/commandes',
							}"
						>
							<svg
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
									d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							<span v-if="isSidebarOpen" class="ml-3">Commandes</span>
						</NuxtLink>
					</li>

					<li>
						<NuxtLink
							to="/paiements"
							class="flex items-center p-2 rounded-lg group text-gray-700 dark:text-gray-300 hover:bg-[#6a0d5f]/10"
							:class="{
								'bg-[#6a0d5f]/10 text-[#6a0d5f]': $route.path === '/paiements',
							}"
						>
							<svg
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
									d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							<span v-if="isSidebarOpen" class="ml-3">Paiements</span>
						</NuxtLink>
					</li>

					<li>
						<NuxtLink
							to="/utilisateurs"
							class="flex items-center p-2 rounded-lg group text-gray-700 dark:text-gray-300 hover:bg-[#6a0d5f]/10"
							:class="{
								'bg-[#6a0d5f]/10 text-[#6a0d5f]':
									$route.path === '/utilisateurs',
							}"
						>
							<svg
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
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
							<span v-if="isSidebarOpen" class="ml-3">Utilisateurs</span>
						</NuxtLink>
					</li>
				</ul>
			</div>

			<!-- Section Admin fixe en bas -->
			<div class="p-4 border-t border-[#6a0d5f]/20">
				<div class="flex items-center">
					<div
						class="w-8 h-8 rounded-full bg-[#6a0d5f] flex items-center justify-center"
					>
						<span class="text-white font-bold text-sm">{{ userInitial }}</span>
					</div>
					<div v-if="isSidebarOpen" class="ml-3 overflow-hidden">
						<p class="text-sm font-medium truncate dark:text-white">
							{{ userFullName }}
						</p>
						<p class="text-xs text-[#6a0d5f] truncate">{{ userRole }}</p>
					</div>
				</div>
			</div>
		</div>
	</aside>

	<!-- Overlay mobile -->
	<div
		v-if="isSidebarOpen && windowWidth < 1024"
		class="fixed inset-0 z-30 bg-black/50 lg:hidden"
		@click="$emit('toggle-sidebar')"
	/>
</template>

<script setup>
	import { ref, onMounted, onUnmounted, computed } from "vue";
	import { useUserStore } from "~~/stores/user";

	defineProps({ isSidebarOpen: Boolean });
	defineEmits(["toggle-sidebar"]);

	const windowWidth = ref(0);
	const livresOpen = ref(false);
	const stocksOpen = ref(false);

	const toggleLivres = () => (livresOpen.value = !livresOpen.value);
	const toggleStocks = () => (stocksOpen.value = !stocksOpen.value);

	const userStore = useUserStore();
	const userFullName = ref("");
	const userRole = ref("");

	const userInitial = computed(() =>
		userStore.user?.nom?.charAt(0)?.toUpperCase(),
	);

	const updateWindowWidth = () => {
		windowWidth.value = window.innerWidth;
	};

	onMounted(async () => {
		updateWindowWidth();
		window.addEventListener("resize", updateWindowWidth);

		await userStore.fetchProfile();
		if (userStore.user) {
			userFullName.value = `${userStore.user.nom} ${userStore.user.prenom}`;
			userRole.value =
				userStore.user.role?.role === "superadmin"
					? "Admin Principal"
					: "Administrateur";
		}
	});

	onUnmounted(() => {
		window.removeEventListener("resize", updateWindowWidth);
	});
</script>

<style scoped>
	.sidebar-transition {
		transition-property: transform, width;
		transition-duration: 300ms;
	}

	/* Scrollbar moderne */
	.scrollbar-thin {
		scrollbar-width: thin;
	}

	.scrollbar-thin::-webkit-scrollbar {
		width: 6px;
	}

	.scrollbar-thin::-webkit-scrollbar-thumb {
		background-color: rgba(106, 13, 95, 0.4);
		border-radius: 9999px;
	}
</style>
