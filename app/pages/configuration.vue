<template>
  <div class="min-h-screen space-y-8 pb-12">
    <Breadcrumb :items="[
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Configuration', to: null },
    ]" title="Paramètres de paiement" description="Gérez les instructions de paiement affichées aux clients." :icon="SettingsIconPath" />

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
              v-model="form.payment_message"
              rows="6"
              placeholder="Ex: Pour régler cette facture, envoyez le montant au +228... via T-Money ou Flooz..."
              class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-2xl p-6 text-sm font-medium outline-none transition-all resize-none dark:text-white"
            ></textarea>
          </section>

          <hr class="border-gray-100 dark:border-white/5">

          <!-- Section Contact -->
          <section class="space-y-6">
            <div class="flex items-center gap-4 mb-2">
              <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <h3 class="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Informations de Contact</h3>
            </div>
            <p class="text-xs text-gray-400 font-bold leading-relaxed">Gérez les numéros de téléphone et l'adresse e-mail affichés sur le site.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Téléphone Principal</label>
                <input 
                  v-model="form.contact_phone_primary" 
                  type="text" 
                  placeholder="+228 00 00 00 00"
                  class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all dark:text-white"
                >
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Email de Contact</label>
                <input 
                  v-model="form.contact_email" 
                  type="email" 
                  placeholder="contact@example.com"
                  class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all dark:text-white"
                >
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Téléphone Secondaire 1</label>
                <input 
                  v-model="form.contact_phone_secondary_1" 
                  type="text" 
                  placeholder="+228 00 00 00 00"
                  class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all dark:text-white"
                >
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Téléphone Secondaire 2</label>
                <input 
                  v-model="form.contact_phone_secondary_2" 
                  type="text" 
                  placeholder="+228 00 00 00 00"
                  class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all dark:text-white"
                >
              </div>
              <div class="space-y-2 md:col-span-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Adresse Physique</label>
                <input 
                  v-model="form.contact_address" 
                  type="text" 
                  placeholder="Lomé, Togo"
                  class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all dark:text-white"
                >
              </div>
            </div>
          </section>

          <hr class="border-gray-100 dark:border-white/5">

          <!-- Section Horaires -->
          <section class="space-y-6">
            <div class="flex items-center gap-4 mb-2">
              <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Horaires d'Ouverture</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Semaine (Lun-Ven)</label>
                <input 
                  v-model="form.opening_hours_weekday" 
                  type="text" 
                  placeholder="Lun-Ven 8h-17h"
                  class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all dark:text-white"
                >
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400">Weekend (Dim)</label>
                <input 
                  v-model="form.opening_hours_sunday" 
                  type="text" 
                  placeholder="Dim 8h-14h"
                  class="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#6a0d5f] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all dark:text-white"
                >
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
  payment_message: '',
  contact_phone_primary: '',
  contact_phone_secondary_1: '',
  contact_phone_secondary_2: '',
  contact_email: '',
  contact_address: '',
  opening_hours_weekday: '',
  opening_hours_sunday: '',
});

const fetchSettings = async () => {
  const { $api } = useNuxtApp();
  try {
    const res = await $api('/settings');
    if (res) {
      form.value = {
        payment_message: res.payment_message || '',
        contact_phone_primary: res.contact_phone_primary || '',
        contact_phone_secondary_1: res.contact_phone_secondary_1 || '',
        contact_phone_secondary_2: res.contact_phone_secondary_2 || '',
        contact_email: res.contact_email || '',
        contact_address: res.contact_address || '',
        opening_hours_weekday: res.opening_hours_weekday || '',
        opening_hours_sunday: res.opening_hours_sunday || '',
      };
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
