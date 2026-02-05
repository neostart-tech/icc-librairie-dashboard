<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup>
	import { useAuthStore } from "~~/stores/auth";

	const auth = useAuthStore();
	auth.init();
	useHead({
		htmlAttrs: {
			class: "scroll-smooth",
		},
		bodyAttrs: {
			class: "antialiased",
		},
	});
</script>
