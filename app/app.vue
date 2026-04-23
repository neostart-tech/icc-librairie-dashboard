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

<style>
/* Global Table Font Weight Fix */
.premium-table thead th, 
.premium-table-v2 thead th,
.bh-table-responsive thead th {
  font-weight: 500 !important;
}

.premium-table tbody td,
.premium-table-v2 tbody td,
.bh-table-responsive tbody td {
  font-weight: 400 !important;
}

/* Ensure no bold in specific table templates */
.premium-table span,
.premium-table-v2 span {
  font-weight: inherit;
}
</style>
