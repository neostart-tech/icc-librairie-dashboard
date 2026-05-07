<template>
  <div class="min-h-screen space-y-8 pb-12 relative">
    <!-- Header -->
    <Breadcrumb
      :items="[
        { label: 'Tableau de bord', to: '/dashboard' },
        { label: 'Demandes de devis', to: null },
      ]"
      title="Demandes de Devis"
      description="Gérez les demandes de devis envoyées par les clients."
      icon="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
    />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <!-- Stats Bar -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-5 text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
          <p class="text-2xl font-black text-gray-900 dark:text-white">{{ devisStore.devis.length }}</p>
        </div>
        <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-5 text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Nouveaux</p>
          <p class="text-2xl font-black text-amber-500">{{ devisStore.devis.filter(d => d.statut === 'nouveau').length }}</p>
        </div>
        <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-5 text-center">
          <p class="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Traités</p>
          <p class="text-2xl font-black text-emerald-500">{{ devisStore.devis.filter(d => d.statut === 'traite').length }}</p>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b dark:border-white/5">
          <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Liste des demandes</h3>
          <button
            @click="devisStore.fetchDevis()"
            class="p-2 rounded-xl bg-[#6a0d5f]/10 text-[#6a0d5f] hover:bg-[#6a0d5f]/20 transition-colors"
            title="Rafraîchir"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div v-if="devisStore.loading" class="flex items-center justify-center py-20">
          <div class="w-10 h-10 rounded-full border-4 border-[#6a0d5f]/10 border-t-[#6a0d5f] animate-spin"></div>
        </div>

        <div v-else-if="devisStore.devis.length === 0" class="text-center py-20">
          <svg class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Aucune demande de devis</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left border-b dark:border-white/5">
                <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Client</th>
                <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Livre</th>
                <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Exemplaires</th>
                <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Statut</th>
                <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th class="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="d in devisStore.devis"
                :key="d.id"
                class="border-b dark:border-white/5 hover:bg-[#6a0d5f]/5 dark:hover:bg-white/5 transition-colors"
              >
                <td class="px-6 py-4">
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ d.nom_complet }}</p>
                  <p class="text-xs text-gray-400 font-medium">{{ d.telephone }}</p>
                  <p v-if="d.email" class="text-xs text-gray-400">{{ d.email }}</p>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm font-bold text-gray-700 dark:text-gray-300 line-clamp-2 max-w-[200px]">
                    {{ d.livre?.titre || '—' }}
                  </p>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-black text-gray-900 dark:text-white">{{ d.nombre_exemplaires }}</span>
                </td>
                <td class="px-6 py-4">
                  <span :class="statutClass(d.statut)" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {{ statutLabel(d.statut) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <p class="text-xs text-gray-500 font-medium">{{ formatDate(d.created_at) }}</p>
                </td>
                <td class="px-6 py-4">
                  <button
                    @click="openDetail(d)"
                    class="p-2 rounded-xl bg-[#6a0d5f]/10 text-[#6a0d5f] hover:bg-[#6a0d5f] hover:text-white transition-all"
                    title="Voir le détail"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="selectedDevis" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="selectedDevis = null">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="flex items-center justify-between p-6 border-b dark:border-white/10">
            <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Détail de la demande</h3>
            <button @click="selectedDevis = null" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-5">
            <!-- Livre -->
            <div class="p-4 bg-[#6a0d5f]/5 rounded-xl border border-[#6a0d5f]/10">
              <p class="text-[9px] font-black uppercase tracking-widest text-[#6a0d5f] mb-1">Livre concerné</p>
              <p class="text-base font-black text-gray-900 dark:text-white">{{ selectedDevis.livre?.titre || 'Livre sur commande' }}</p>
            </div>

            <!-- Client info -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Nom complet</p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ selectedDevis.nom_complet }}</p>
              </div>
              <div>
                <p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Téléphone</p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ selectedDevis.telephone }}</p>
              </div>
              <div v-if="selectedDevis.email">
                <p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ selectedDevis.email }}</p>
              </div>
              <div>
                <p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Exemplaires</p>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ selectedDevis.nombre_exemplaires }}</p>
              </div>
            </div>

            <!-- Message -->
            <div v-if="selectedDevis.message">
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Message</p>
              <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 rounded-xl p-4">{{ selectedDevis.message }}</p>
            </div>

            <!-- Statut update -->
            <div>
              <p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Mettre à jour le statut</p>
              <div class="flex gap-3">
                <button
                  v-for="s in statuts"
                  :key="s.value"
                  @click="changeStatut(s.value)"
                  :disabled="selectedDevis.statut === s.value || updatingStatut"
                  :class="[
                    'flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all',
                    selectedDevis.statut === s.value
                      ? s.activeClass
                      : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'
                  ]"
                >
                  {{ s.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import { useDevisStore } from "~~/stores/devis";
import type { Devis } from "~~/stores/devis";
import { useToast } from "#imports";

const devisStore = useDevisStore();
const toast = useToast();

const selectedDevis = ref<Devis | null>(null);
const updatingStatut = ref(false);

const statuts = [
  { value: "nouveau", label: "Nouveau", activeClass: "bg-amber-100 dark:bg-amber-500/20 text-amber-600" },
  { value: "traite", label: "Traité", activeClass: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600" },
  { value: "refuse", label: "Refusé", activeClass: "bg-red-100 dark:bg-red-500/20 text-red-500" },
] as const;

const statutClass = (statut: string) => {
  if (statut === "nouveau") return "bg-amber-100 dark:bg-amber-500/20 text-amber-600";
  if (statut === "traite") return "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600";
  return "bg-red-100 dark:bg-red-500/20 text-red-500";
};

const statutLabel = (statut: string) => {
  if (statut === "nouveau") return "Nouveau";
  if (statut === "traite") return "Traité";
  return "Refusé";
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const openDetail = (d: Devis) => {
  selectedDevis.value = { ...d };
};

const changeStatut = async (statut: "nouveau" | "traite" | "refuse") => {
  if (!selectedDevis.value) return;
  updatingStatut.value = true;
  try {
    const updated = await devisStore.updateStatut(selectedDevis.value.id, statut);
    selectedDevis.value = updated;
    toast.success({ message: "Statut mis à jour" });
  } catch {
    toast.error({ message: "Erreur lors de la mise à jour" });
  } finally {
    updatingStatut.value = false;
  }
};

onMounted(() => devisStore.fetchDevis());
</script>
