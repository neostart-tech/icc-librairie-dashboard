<template>
  <div class="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img src="/images/auth_background.png" class="w-full h-full object-cover scale-110 animate-slow-zoom"
        alt="Background" />
      <div
        class="absolute inset-0 bg-gradient-to-br from-[#6a0d5f]/90 via-[#6a0d5f]/70 to-black/80 backdrop-blur-[2px]">
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-[10%] -left-20 w-80 h-80 bg-[#6a0d5f] rounded-full blur-[120px] opacity-30 animate-pulse">
    </div>
    <div class="absolute bottom-[10%] -right-20 w-80 h-80 bg-orange-500 rounded-full blur-[120px] opacity-20"></div>

    <!-- Login Card -->
    <div v-reveal class="relative z-10 w-full max-w-xl">
      <div
        class="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col md:flex-row">

        <!-- Left Side: Branding (Desktop) -->
        <div
          class="hidden md:flex w-2/5 bg-[#6a0d5f] p-10 flex-col justify-between relative overflow-hidden text-white">
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 C30,20 70,20 100,0 L100,100 L0,100 Z" fill="white" />
            </svg>
          </div>

          <div class="relative z-10">
            <NuxtLink to="/">
              <img src="/logo/logo_librairie(1).png" class="h-16 w-auto brightness-0 invert" alt="Logo" />
            </NuxtLink>
          </div>

          <div class="relative z-10 space-y-4">
            <h2 class="text-3xl font-black italic uppercase tracking-tighter leading-tight">
              Dashboard <br />
              <span class="text-orange-400">Admin</span>
            </h2>
            <p class="text-white/70 text-sm font-medium leading-relaxed">
              Gérez votre librairie avec élégance et performance.
            </p>
          </div>
        </div>

        <!-- Right Side: Form -->
        <div class="flex-1 p-8 md:p-12">
          <div class="mb-10">
            <h1 class="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Connexion</h1>
            <div class="h-1.5 w-12 bg-orange-400 rounded-full mt-2"></div>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-2 group">
              <label
                class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#6a0d5f] transition-colors">Email Administrateur</label>
              <div class="relative">
                <input v-model="email" type="email" placeholder="admin@icc-librairie.com"
                  class="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#6a0d5f] focus:bg-white rounded-2xl px-6 py-4 text-gray-900 font-bold outline-none transition-all placeholder:text-gray-300"
                  required />
                <svg
                  class="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#6a0d5f] transition-colors"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>

            <div class="space-y-2 group">
              <div class="flex justify-between items-end mr-1">
                <label
                  class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#6a0d5f] transition-colors">Mot
                  de passe</label>
                <a href="#"
                  class="text-[10px] font-black text-orange-500 hover:text-orange-600 uppercase tracking-widest transition-colors">Oublié
                  ?</a>
              </div>
              <div class="relative">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                  class="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#6a0d5f] focus:bg-white rounded-2xl px-6 py-4 text-gray-900 font-bold outline-none transition-all placeholder:text-gray-300"
                  required />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6a0d5f] transition-colors">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" />
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      stroke-width="2" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.96 9.96 0 012.219-3.423m1.43-1.1A9.963 9.963 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.481 2.563M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      stroke-width="2" />
                    <path d="M3 3l18 18" stroke-width="2" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3 py-2">
              <input type="checkbox" id="remember"
                class="w-5 h-5 rounded-lg border-2 border-gray-100 text-[#6a0d5f] focus:ring-[#6a0d5f] transition-all cursor-pointer" />
              <label for="remember"
                class="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer select-none">Rester
                connecté</label>
            </div>

            <button :disabled="auth.loading"
              class="w-full relative group bg-[#6a0d5f] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#6a0d5f]/30 hover:bg-[#851178] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 overflow-hidden">
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000">
              </div>
              <span v-if="auth.loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none">
                  </circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Accès en cours...
              </span>
              <span v-else>Se connecter au Dashboard</span>
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-gray-100 text-center">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
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

// Redirige si l'utilisateur est déjà connecté
onMounted(() => {
  if (auth.isLogged) {
    navigateTo("/");
  }
});

const router = useRouter();
const auth = useAuthStore();
const route = useRoute();
const email = ref("");
const password = ref("");
const showPassword = ref(false);

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
        popup: 'rounded-2xl border-l-4 border-[#6a0d5f] shadow-xl'
      }
    });

    const redirect =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : router.options.history.state.back || "/";

    navigateTo(redirect);

  } catch (e: any) {
    Swal.fire({
      title: 'Erreur d\'accès',
      text: e.message || "Identifiants incorrects ou accès non autorisé.",
      icon: 'error',
      confirmButtonColor: '#6a0d5f',
      customClass: {
        popup: 'rounded-[2.5rem]',
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
@keyframes slow-zoom {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}

.animate-slow-zoom {
  animation: slow-zoom 20s linear infinite alternate;
}
</style>
