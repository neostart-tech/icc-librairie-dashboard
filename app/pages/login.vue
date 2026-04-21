<template>
  <div class="min-h-screen relative flex items-center justify-center px-4 bg-[#f8f9fa] py-12">
    <!-- Background subtle pattern -->
    <div class="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-[#6a0d5f]/5 to-transparent"></div>
      <div class="w-full h-full" style="background-image: radial-gradient(#6a0d5f 0.5px, transparent 0.5px); background-size: 24px 24px;"></div>
    </div>

    <!-- Login Card -->
    <div v-reveal class="relative z-10 w-full max-w-4xl">
      <div
        class="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
        
        <!-- Côté Gauche: Branding & Image (Desktop only) -->
        <div class="hidden md:flex w-2/5 bg-[#6a0d5f] relative overflow-hidden flex-col justify-between p-12 text-white">
          <!-- Background Decoration -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl -ml-24 -mb-24"></div>
          
          <div class="relative z-10">
            <NuxtLink to="/">
              <img src="/logo/logo_librairie(1).png" class="h-16 w-auto brightness-0 invert" alt="Logo" />
            </NuxtLink>
          </div>

          <div class="relative z-10 space-y-6">
            <h2 class="text-4xl font-bold leading-tight">
              Dashboard <span class="text-orange-400">Admin</span>
            </h2>
            <p class="text-white/70 text-sm leading-relaxed font-medium">
              Gérez votre librairie avec élégance et performance depuis votre espace administrateur.
            </p>
            <div class="flex gap-2">
              <div class="h-1 w-12 bg-white rounded-full"></div>
              <div class="h-1 w-4 bg-white/30 rounded-full"></div>
              <div class="h-1 w-4 bg-white/30 rounded-full"></div>
            </div>
          </div>

          <!-- Abstract curved shape at bottom -->
          <svg class="absolute bottom-0 left-0 w-full h-32 text-orange-400/10 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0,100 C30,80 70,80 100,100 L100,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>

        <!-- Côté Droit: Form -->
        <div class="flex-1 p-8 md:p-14 flex flex-col justify-center">
          <div class="mb-10 text-center md:text-left">
            <h1 class="text-3xl font-bold text-gray-900">Connexion</h1>
            <div class="h-1.5 w-12 bg-orange-400 rounded-full mt-3 mx-auto md:mx-0"></div>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-1">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Administrateur</label>
              <input v-model="email" type="email" placeholder="admin@icc-librairie.com"
                class="w-full bg-gray-50 border-2 border-transparent focus:border-[#6a0d5f] focus:bg-white px-6 py-4 text-gray-900 font-bold outline-none transition-all placeholder:text-gray-300"
                required />
            </div>

            <div class="space-y-1">
              <div class="flex justify-between items-center ml-1">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Mot de passe</label>
                <NuxtLink to="/forgot-password" class="text-[10px] font-black text-[#6a0d5f] uppercase tracking-widest hover:underline">Oublié ?</NuxtLink>
              </div>
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                  class="w-full bg-gray-50 border-2 border-transparent focus:border-[#6a0d5f] focus:bg-white px-6 py-4 text-gray-900 font-bold outline-none transition-all placeholder:text-gray-300"
                  required />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6a0d5f]">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.96 9.96 0 012.219-3.423m1.43-1.1A9.963 9.963 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.481 2.563M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" />
                    <path d="M3 3l18 18" stroke-width="2" />
                  </svg>
                </button>
              </div>
            </div>

            <button :disabled="auth.loading"
              class="w-full bg-[#6a0d5f] text-white py-5 font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-[#6a0d5f]/20 hover:bg-[#851178] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2">
              <svg v-if="auth.loading" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else>Accéder au dashboard</span>
            </button>
          </form>

          <div class="mt-10 pt-6 border-t border-gray-100 text-center">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Accès réservé au personnel autorisé
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~~/stores/auth";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from 'sweetalert2';

const router = useRouter();
const auth = useAuthStore();
const route = useRoute();
const email = ref("");
const password = ref("");
const showPassword = ref(false);

// Redirige si l'utilisateur est déjà connecté
onMounted(() => {
  if (auth.isLogged) {
    navigateTo("/");
  }
});

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value);

    // Toast premium pour le succès
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Accès autorisé !',
      text: 'Heureux de vous revoir.',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'rounded-xl border-l-4 border-green-500 shadow-xl'
      }
    });

    const redirect =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : "/";

    navigateTo(redirect);

  } catch (e: any) {
    Swal.fire({
      title: 'Erreur d\'accès',
      text: e.message || "Identifiants incorrects ou accès non autorisé.",
      icon: 'error',
      confirmButtonColor: '#6a0d5f',
      customClass: {
        popup: 'rounded-xl',
        confirmButton: 'rounded-xl font-black px-8 py-3 uppercase tracking-widest text-sm'
      }
    });
  }
};

definePageMeta({
  layout: false,
});
</script>

<style scoped>
</style>

