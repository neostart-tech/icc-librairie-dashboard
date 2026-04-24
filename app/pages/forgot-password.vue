<template>
  <div class="min-h-screen relative flex items-center justify-center px-4 bg-[#f8f9fa] py-12">
    <!-- Background subtle pattern -->
    <div class="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-[#6a0d5f]/5 to-transparent"></div>
      <div class="w-full h-full"
        style="background-image: radial-gradient(#6a0d5f 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>
    </div>

    <!-- Card -->
    <div v-reveal class="relative z-10 w-full max-w-md">
      <div class="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 p-8 md:p-12">

        <div class="mb-10 text-center">
          <NuxtLink to="/login">
            <img src="/logo/logo_librairie(1).png" class="h-14 w-auto mx-auto mb-6" alt="Logo" />
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900">Récupération</h1>
          <div class="h-1.5 w-12 bg-orange-400 rounded-full mt-3 mx-auto"></div>
          <p class="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-4">Reset de mot de passe
            administrateur</p>
        </div>

        <form v-if="!sent" @submit.prevent="handleForgotPassword" class="space-y-6">
          <div class="space-y-1">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email
              Administrateur</label>
            <input v-model="email" type="email" placeholder="admin@icc-librairie.com"
              class="w-full bg-gray-50 border-2 border-transparent focus:border-[#6a0d5f] focus:bg-white px-6 py-4 text-gray-900 font-bold outline-none transition-all placeholder:text-gray-300"
              required />
          </div>

          <button type="submit" :disabled="loading"
            class="w-full bg-[#6a0d5f] text-white py-5 font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-[#6a0d5f]/20 hover:bg-[#851178] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2">
            <svg v-if="loading" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none">
              </circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span v-else>Envoyer le lien</span>
          </button>
        </form>

        <div v-else class="text-center space-y-6 py-4">
          <div
            class="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
            <UIcon name="i-lucide-check" class="w-8 h-8" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-bold text-gray-900">Email Envoyé</h3>
            <p class="text-gray-500 text-xs font-medium leading-relaxed">
              Un lien de réinitialisation a été envoyé à l'adresse <strong>{{ email }}</strong>.
            </p>
          </div>
          <NuxtLink to="/login"
            class="inline-block text-[10px] font-black text-[#6a0d5f] uppercase tracking-widest hover:underline">
            Retour à la connexion
          </NuxtLink>
        </div>

        <div v-if="!sent" class="mt-10 text-center">
          <NuxtLink to="/login"
            class="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#6a0d5f] transition-colors flex items-center justify-center gap-2">
            <UIcon name="i-lucide-arrow-left" class="w-3 h-3" />
            Retour à la connexion
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Swal from 'sweetalert2';

const email = ref("");
const loading = ref(false);
const sent = ref(false);
const config = useRuntimeConfig();

const handleForgotPassword = async () => {
  loading.value = true;
  try {
    await $fetch(`${config.public.apiBase}/user/forgot-password`, {
      method: 'POST',
      body: { email: email.value }
    });

    sent.value = true;

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Lien envoyé avec succès !',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } catch (e: any) {
    Swal.fire({
      title: 'Erreur',
      text: e.data?.message || "Impossible d'envoyer le lien.",
      icon: 'error',
      confirmButtonColor: '#6a0d5f',
    });
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  layout: false,
});
</script>
