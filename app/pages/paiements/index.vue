<template>
	<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 space-y-6">
		<!-- Breadcrumb -->
		<Breadcrumb
			:items="[
				{ label: 'Tableau de bord', to: '/dashboard' },
				{ label: 'Paiements', to: '/paiements' },
			]"
			title="Paiements"
		/>

    <div class="max-w-[1600px] mx-auto space-y-8 px-4 sm:px-8">
      <!-- Quick Stats -->
      <div 
        v-reveal="{ delay: 200 }"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-[#6a0d5f]/5 rounded-full blur-2xl group-hover:bg-[#6a0d5f]/10 transition-colors"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Période active</p>
          <p class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{{ currentMonthLabel }} 2026</p>
        </div>
        
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Montant Encaissé</p>
          <p class="text-2xl font-black text-emerald-600 uppercase tracking-tighter">{{ totalAmount }} <span class="text-xs">FCFA</span></p>
        </div>

        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div class="absolute -top-6 -right-6 w-24 h-24 bg-[#6a0d5f]/5 rounded-full blur-2xl group-hover:bg-[#6a0d5f]/10 transition-colors"></div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Nombre de Paiements</p>
          <p class="text-2xl font-black text-[#6a0d5f] uppercase tracking-tighter">{{ paymentCount }} <span class="text-xs">Tx.</span></p>
        </div>
      </div>

      <!-- Unified List Container -->
      <div 
        v-reveal="{ delay: 400 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <!-- Integrated Toolbar -->
        <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div class="flex flex-col md:flex-row items-center gap-4 flex-1">
            <div class="relative flex-1 max-w-md group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6a0d5f] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                v-model="search"
                type="text"
                placeholder="Référence paiement..."
                class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
              />
            </div>

            <div class="flex items-center gap-2">
              <select
                v-model="selectedMonth"
                class="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-xs font-bold uppercase tracking-widest text-[#6a0d5f]"
              >
                <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative">
              <button
                @click="toggleDropdown"
                class="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#6a0d5f] transition-all text-gray-600 dark:text-gray-300"
                title="Configurer les colonnes"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <div v-if="isDropdownOpen" class="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <div class="p-2 space-y-1">
                    <label v-for="col in allColumns" :key="col.field" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-[#6a0d5f]/5 dark:hover:bg-[#6a0d5f]/10 rounded-xl cursor-pointer transition-colors group">
                      <input type="checkbox" v-model="col.visible" class="w-4 h-4 rounded-lg border-gray-300 text-[#6a0d5f] focus:ring-[#6a0d5f]" />
                      <span class="font-bold uppercase text-[10px] tracking-widest">{{ col.title }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div class="relative overflow-hidden p-0">
          <Vue3Datatable
            :rows="filteredRows"
            :columns="columns"
            :search-text="search"
            :sortable="true"
            :pagination="true"
            :page-size="10"
            skin="bh-table-hover bh-table-bordered"
            class="premium-table"
          >
            <template #reference="data">
              <span class="font-black text-[#6a0d5f] dark:text-purple-400 tracking-tighter uppercase">#{{ data.value.reference }}</span>
            </template>

            <template #client="data">
              <span class="font-bold text-gray-900 dark:text-white uppercase tracking-tighter text-xs">{{ data.value.client }}</span>
            </template>

            <template #montant="data">
              <span class="font-black text-[#6a0d5f] dark:text-purple-400 tracking-tighter">{{ data.value.montant }}</span>
            </template>

            <template #statut="data">
              <div class="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 w-fit">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span class="text-[10px] font-bold uppercase tracking-widest">Payé</span>
              </div>
            </template>

            <template #actions>
              <div class="flex items-center gap-2">
                <button
                  class="p-2.5 rounded-xl text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-all group"
                  title="Détails"
                >
                  <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
      </div>
    </div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted } from "vue";
	import Breadcrumb from "~/components/Breadcrumb.vue";
	import Vue3Datatable from "@bhplugin/vue3-datatable";

	/* Recherche */
	const search = ref("");

	/* Mois */
	const months = [
		{ label: "Janvier", value: "01" },
		{ label: "Février", value: "02" },
	];
	const selectedMonth = ref("02");

	/* Dropdown Colonnes */
	const isDropdownOpen = ref(false);
	const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
	const closeDropdown = () => (isDropdownOpen.value = false);

	/* Colonnes */
	const allColumns = ref([
		{ field: "reference", title: "Référence", sortable: true, visible: true },
		{ field: "client", title: "Client", sortable: true, visible: true },
		{ field: "date", title: "Date", sortable: true, visible: true },
		{ field: "heure", title: "Heure", sortable: true, visible: true },
		{ field: "montant", title: "Montant", sortable: true, visible: true },
		{ field: "methode", title: "Méthode", sortable: true, visible: true },
		{ field: "statut", title: "Statut", sortable: true, visible: true },
		{ field: "actions", title: "Actions", sortable: false, visible: true },
	]);

	const columns = computed(() => allColumns.value.filter((c) => c.visible));

	/* Données statiques */
	const rows = [
		{
			reference: "PAY-001",
			client: "Jean Paul",
			date: "02/02/2026",
			heure: "14:35",
			montant: 12000,
			methode: "Mobile Money",
			statut: "Payé",
			month: "02",
		},
		{
			reference: "PAY-002",
			client: "Ana Maria",
			date: "01/02/2026",
			heure: "09:20",
			montant: 9000,
			methode: "Carte bancaire",
			statut: "Payé",
			month: "02",
		},
	];

	const filteredRows = computed(() =>
		rows
			.filter((r) => r.month === selectedMonth.value)
			.map((r) => ({
				...r,
				montant: `${r.montant.toLocaleString()} FCFA`,
			})),
	);

	const totalAmount = computed(() =>
		rows
			.filter((r) => r.month === selectedMonth.value)
			.reduce((sum, r) => sum + r.montant, 0)
			.toLocaleString(),
	);

	const paymentCount = computed(
		() => rows.filter((r) => r.month === selectedMonth.value).length,
	);

	const currentMonthLabel = computed(
		() => months.find((m) => m.value === selectedMonth.value)?.label,
	);

	/* Fermer dropdown clic extérieur */
	onMounted(() => {
		window.addEventListener("click", (e) => {
			if (!e.target.closest(".relative")) closeDropdown();
		});
	});
	onUnmounted(() => window.removeEventListener("click", closeDropdown));
</script>

<style scoped>
</style>
