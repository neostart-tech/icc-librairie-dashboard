<template>
	<header
		:class="[
			'sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-[#6a0d5f]/20 transition-all duration-300 h-16',
			isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20',
		]"
	>
		<div class="h-full px-4">
			<div class="h-full flex items-center justify-between">
				<!-- Gauche du header -->
				<div class="flex items-center">
					<button
						@click="$emit('toggle-sidebar')"
						type="button"
						class="inline-flex items-center p-2 rounded-lg text-[#6a0d5f] hover:bg-[#6a0d5f]/10 focus:outline-none focus:ring-2 focus:ring-[#6a0d5f]/40 dark:text-white"
					>
						<span class="sr-only">Ouvrir/fermer le menu</span>

						<svg
							v-if="!isSidebarOpen"
							class="w-6 h-6"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clip-rule="evenodd"
							/>
						</svg>

						<svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<!-- Logo mobile -->
					<div class="lg:hidden flex items-center ml-3">
						<div class="h-8 w-8 rounded-lg flex items-center justify-center">
							<img
								src="/logo-icc.jpg"
								alt="Logo ICC-LIBRAIRIE"
								class="h-full w-full object-cover rounded-lg"
							/>
						</div>
						<span class="ml-2 text-lg font-semibold text-[#6a0d5f]">
							ICC-LIBRAIRIE
						</span>
					</div>
				</div>

				<!-- Droite du header -->
				<div class="flex items-center space-x-4">
					<!-- Dark mode -->
					<button
						@click="toggleDarkMode"
						type="button"
						class="rounded-lg p-2.5 text-[#6a0d5f] hover:bg-[#6a0d5f]/10 focus:outline-none focus:ring-4 focus:ring-[#6a0d5f]/30 dark:text-white"
					>
						<svg
							v-if="darkMode"
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
						<svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
							/>
						</svg>
					</button>

					<!-- Avatar -->
					<div class="relative">
						<button
							ref="userMenuButton"
							@click="toggleUserMenu"
							type="button"
							class="flex items-center focus:outline-none"
						>
							<div
								class="w-10 h-10 rounded-full bg-[#6a0d5f] flex items-center justify-center"
							>
								<span class="text-white font-bold">{{ userInitial }}</span>
							</div>

							<div class="hidden md:block ml-3 text-left">
								<div class="text-sm font-medium text-gray-900 dark:text-white">
									{{ userFullName }}
								</div>
								<div class="text-xs text-[#6a0d5f]">
									{{ userRole }}
								</div>
							</div>

							<svg
								class="w-4 h-4 ml-2 text-[#6a0d5f]"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>

						<!-- Menu utilisateur -->
						<transition
							enter-active-class="transition duration-100 ease-out"
							enter-from-class="transform scale-95 opacity-0"
							enter-to-class="transform scale-100 opacity-100"
							leave-active-class="transition duration-75 ease-in"
							leave-from-class="transform scale-100 opacity-100"
							leave-to-class="transform scale-95 opacity-0"
						>
							<div
								v-if="isUserMenuOpen"
								ref="userMenu"
								class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700 z-40"
							>
								<div
									class="px-4 py-3 border-b border-gray-200 dark:border-gray-700"
								>
									<div class="flex items-center">
										<div
											class="w-12 h-12 rounded-full bg-[#6a0d5f] flex items-center justify-center"
										>
											<span class="text-white font-bold text-lg">
												{{ userInitial }}
											</span>
										</div>
										<div class="ml-3">
											<div class="text-sm font-semibold dark:text-white">
												{{ userFullName }}
											</div>
											<div class="text-xs text-[#6a0d5f]">
												{{ userRole }}
											</div>
											<div class="text-xs text-gray-500 mt-1">
												{{ userEmail }}
											</div>
										</div>
									</div>
								</div>

								<!-- Options du menu -->
								<ul class="py-2">
									<li>
										<a
											href="/profil"
											class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
											@click="closeUserMenu"
										>
											<svg
												class="w-4 h-4 mr-3"
												fill="currentColor"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fill-rule="evenodd"
													d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
													clip-rule="evenodd"
												></path>
											</svg>
											Mon Profil
										</a>
									</li>
									<li>
										<a
											href="/administrateurs"
											class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
											@click="closeUserMenu"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5 mr-3"
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
											Gérer les Administrateurs
										</a>
									</li>
									<li
										class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2"
									>
										<a
											href="#"
											class="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
											@click.prevent="handleLogout"
										>
											<svg
												class="w-4 h-4 mr-3"
												fill="currentColor"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fill-rule="evenodd"
													d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
													clip-rule="evenodd"
												></path>
											</svg>
											Déconnexion
										</a>
									</li>
								</ul>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</div>
	</header>

	<transition>
		<div
			v-if="isUserMenuOpen"
			class="fixed inset-0 z-20"
			@click="closeUserMenu"
		></div>
	</transition>
</template>

<script setup>
	import { ref, onMounted, onUnmounted, computed } from "vue";
	import { useAuthStore } from "~~/stores/auth";
	import { useUserStore } from "~~/stores/user";

	const isUserMenuOpen = ref(false);
	const darkMode = ref(false);
	const userMenuButton = ref(null);
	const userMenu = ref(null);

	const auth = useAuthStore();
	const userStore = useUserStore();

	const props = defineProps({
		isSidebarOpen: Boolean,
	});

	const toggleUserMenu = () => (isUserMenuOpen.value = !isUserMenuOpen.value);
	const closeUserMenu = () => (isUserMenuOpen.value = false);

	const toggleDarkMode = () => {
		darkMode.value = !darkMode.value;
		document.documentElement.classList.toggle("dark", darkMode.value);
		localStorage.setItem("theme", darkMode.value ? "dark" : "light");
	};

	const handleLogout = () => {
		closeUserMenu();
		auth.logout();
	};

	const userInitial = computed(() =>
		userStore.user?.nom?.charAt(0)?.toUpperCase(),
	);

	const userFullName = ref("");
	const userRole = ref("");
	const userEmail = ref("");

	onMounted(async () => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme === "dark") {
			darkMode.value = true;
			document.documentElement.classList.add("dark");
		}

		document.addEventListener("click", handleClickOutside);

		await userStore.fetchProfile();
		if (userStore.user) {
			userFullName.value = `${userStore.user.nom} ${userStore.user.prenom}`;
			userRole.value =
				userStore.user.role?.role === "superadmin"
					? "Admin Principal"
					: "Administrateur";
			userEmail.value = userStore.user.email;
		}
	});

	onUnmounted(() => {
		document.removeEventListener("click", handleClickOutside);
	});

	const handleClickOutside = (e) => {
		if (
			isUserMenuOpen.value &&
			!userMenuButton.value?.contains(e.target) &&
			!userMenu.value?.contains(e.target)
		) {
			closeUserMenu();
		}
	};

	defineEmits(["toggle-sidebar"]);
</script>
