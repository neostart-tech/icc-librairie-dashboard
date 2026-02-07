<template>
	<div
		class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
	>
		<div class="text-center">
			<h1 class="text-5xl font-bold text-[#6a0d5f]">403</h1>
			<p class="mt-4 text-gray-600 dark:text-gray-300">Accès interdit</p>
			<NuxtLink
				to="/dashboard"
				class="inline-block mt-6 px-4 py-2 rounded-lg bg-[#6a0d5f] text-white"
			>
				Retour au dashboard
			</NuxtLink>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({
		layout: false,
	});
</script>
