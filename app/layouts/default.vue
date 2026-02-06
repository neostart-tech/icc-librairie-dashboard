<template>
	<div
		class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
	>
		<!-- Sidebar -->
		<Sidebar :is-sidebar-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

		<!-- Header -->
		<Header :is-sidebar-open="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

		<!-- Contenu principal -->
		<main
			:class="[
				'pt-6 transition-all duration-300',
				isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20',
			]"
			class="px-4 py-6"
		>
			<div class="max-w-7xl mx-auto">
				<!-- Zone de contenu -->
				<slot />
			</div>
		</main>
	</div>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from "vue";

	const isSidebarOpen = ref(true); // Par défaut ouvert sur desktop

	const toggleSidebar = () => {
		isSidebarOpen.value = !isSidebarOpen.value;
	};

	// Gérer le responsive
	const handleResize = () => {
		if (window.innerWidth >= 1024) {
			// Sur desktop, on garde la sidebar ouverte par défaut
			isSidebarOpen.value = true;
		} else {
			// Sur mobile, on la ferme par défaut
			isSidebarOpen.value = false;
		}
	};

	onMounted(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
	});

	onUnmounted(() => {
		window.removeEventListener("resize", handleResize);
	});
</script>
