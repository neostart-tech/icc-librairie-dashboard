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
          <img src="/logo/logo_librairie(1).png" class="h-14 w-auto mx-auto mb-6" alt="Logo" />
          <h1 class="text-2xl font-bold text-gray-900">Nouveau Password</h1>
          <div class="h-1.5 w-12 bg-orange-400 rounded-full mt-3 mx-auto"></div>
        </div>

        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <div class="space-y-1 opacity-60">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email</label>
            <input :value="email" type="email" readonly
              class="w-full bg-gray-100 border-2 border-transparent px-6 py-4 text-gray-500 font-bold outline-none cursor-not-allowed" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nouveau mot de
              passe</label>
            <div class="relative">
              <input v-model="password" :type="showPass ? 'text' : 'password'" placeholder="••••••••"
                class="w-full bg-gray-50 border-2 border-transparent focus:border-[#6a0d5f] focus:bg-white px-6 py-4 text-gray-900 font-bold outline-none transition-all placeholder:text-gray-300"
                required />
              <button type="button" @click="showPass = !showPass"
                class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6a0d5f]">
                <UIcon :name="showPass ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirmer mot de
              passe</label>
            <input v-model="password_confirmation" :type="showPass ? 'text' : 'password'" placeholder="••••••••"
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
            <span v-else>Réinitialiser</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const email = ref("");
const token = ref("");
const password = ref("");
const password_confirmation = ref("");
const loading = ref(false);
const showPass = ref(false);

onMounted(() => {
  email.value = route.query.email as string || "";
  token.value = route.query.token as string || "";

  if (!token.value || !email.value) {
    Swal.fire({
      title: 'Lien invalide',
      text: 'Le lien est expiré ou incomplet.',
      icon: 'warning',
      confirmButtonColor: '#6a0d5f',
    }).then(() => {
      router.push('/login');
    });
  }
});

const handleResetPassword = async () => {
  if (password.value !== password_confirmation.value) {
    Swal.fire({ title: 'Attention', text: 'Les mots de passe ne correspondent pas.', icon: 'warning' });
    return;
  }

  loading.value = true;
  try {
    await $fetch(`${config.public.apiBase}/user/reset-password`, {
      method: 'POST',
      body: {
        email: email.value,
        token: token.value,
        password: password.value,
        password_confirmation: password_confirmation.value
      }
    });

    Swal.fire({
      title: 'Succès !',
      text: 'Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.',
      icon: 'success',
      confirmButtonColor: '#6a0d5f',
    }).then(() => {
      router.push('/login');
    });
  } catch (e: any) {
    Swal.fire({
      title: 'Erreur',
      text: e.data?.message || "Le lien est invalide ou expiré.",
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
