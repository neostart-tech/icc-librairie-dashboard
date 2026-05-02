<template>
  <div class="min-h-screen space-y-8 pb-12">
    <Breadcrumb :items="[
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Configuration', to: null },
    ]" title="Paramètres de paiement et de livraison" description="Gérez les instructions de paiement et les frais de livraison." :icon="SettingsIconPath" />

    <div class="max-w-4xl mx-auto px-4 sm:px-8">
      <div 
        v-reveal
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-[2.5rem] shadow-2xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <div class="p-8 md:p-12 space-y-10">
          <!-- Section Paiement -->
          <section class="space-y-6">
            <div class="flex items-center gap-4 mb-2">
              <div class="w-10 h-10 rounded-xl bg-[#6a0d5f]/10 flex items-center justify-center text-[#6a0d5f]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" /></svg>
              </div>
              <h3 class="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Instructions de Paiement</h3>
            </div>
            <p class="text-xs text-gray-400 font-bold leading-relaxed">Ces instructions seront affichées au client juste après la validation de son panier.</p>
            <textarea
              v-model="form.payment_instructions"
              rows="6"
              placeholder="Ex: Pour régler cette facture, envoyez le montant au +228... via T-Money ou Flooz..."
              class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-2xl p-6 text-sm font-medium outline-none transition-all resize-none dark:text-white"
            ></textarea>
          </section>

          <div class="h-px bg-gray-100 dark:bg-white/5"></div>

          <!-- Section Livraison -->
          <section class="space-y-6">
            <div class="flex items-center gap-4 mb-2">
              <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 18h7l2-4h-7m-4 4h1a2 2 0 100-4h-1m-7 4h1a2 2 0 100-4H7m3-4V7a2 2 0 012-2h6" stroke-width="2" /></svg>
              </div>
              <h3 class="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Frais de Livraison</h3>
            </div>
            <div class="max-w-xs">
              <div class="relative group">
                <input
                  v-model.number="form.delivery_fee"
                  type="number"
                  class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500 rounded-2xl pl-6 pr-16 py-4 text-lg font-black outline-none transition-all dark:text-white"
                />
                <span class="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase tracking-widest">FCFA</span>
              </div>
            </div>
          </section>

          <!-- Submit Button -->
          <div class="pt-6">
            <button
              @click="saveSettings"
              :disabled="loading"
              class="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              <span v-if="loading">Enregistrement en cours...</span>
              <span v-else>Sauvegarder les modifications</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from '#imports';

const SettingsIconPath = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z";

const toast = useToast();
const loading = ref(false);
const form = ref({
  payment_instructions: '',
  delivery_fee: 0
});

const fetchSettings = async () => {
  const { $api } = useNuxtApp();
  try {
    const res = await $api('/settings');
    if (res.data) {
      form.value.payment_instructions = res.data.payment_instructions || '';
      form.value.delivery_fee = res.data.delivery_fee || 0;
    }
  } catch (e) {
    console.error(e);
  }
};

const saveSettings = async () => {
  const { $api } = useNuxtApp();
  loading.value = true;
  try {
    await $api('/settings', {
      method: 'POST',
      body: form.value
    });
    toast.success({ message: 'Configuration mise à jour !' });
  } catch (e) {
    toast.error({ message: 'Erreur lors de la sauvegarde.' });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSettings);
</script>
