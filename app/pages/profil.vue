<template>
  <div class="min-h-screen space-y-8 pb-12 relative overflow-hidden">
    <!-- Premium Loading Overlay -->
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-700 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPageLoading"
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl"
      >
        <div class="relative">
          <div class="w-24 h-24 rounded-full border-4 border-[#6a0d5f]/10 border-t-[#6a0d5f] animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <img src="/logo/logo_librairie(1).png" class="w-12 h-12 object-contain" alt="Logo" />
          </div>
        </div>
        <div class="mt-6 flex flex-col items-center">
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Chargement de votre profil</span>
          <div class="flex gap-1 mt-2">
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-1 h-1 rounded-full bg-[#6a0d5f] animate-bounce" style="animation-delay: 0.3s"></div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Header Section -->
    <Breadcrumb :items="[
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Profil', to: null },
    ]" title="Mon Profil" description="Personnalisez vos informations et sécurisez votre compte." :icon="ProfileIconPath" />

    <div class="max-w-[1200px] mx-auto space-y-12 px-4 sm:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Sidebar / Identity Card -->
        <div v-reveal="{ delay: 200 }" class="lg:col-span-1 space-y-6">
          <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
            <div class="absolute -top-12 -right-12 w-48 h-48 bg-[#6a0d5f]/5 rounded-full blur-3xl group-hover:bg-[#6a0d5f]/10 transition-colors duration-700"></div>
            
            <div class="flex flex-col items-center text-center space-y-6">
              <div class="relative group">
                <div class="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[#6a0d5f] to-[#8a1a7a] flex items-center justify-center text-white text-4xl font-black shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                  {{ form.prenom?.charAt(0) }}{{ form.nom?.charAt(0) }}
                </div>
                <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4" />
                  </svg>
                </div>
              </div>

              <div class="space-y-1">
                <h3 class="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight">{{ form.prenom }} {{ form.nom }}</h3>
                <p class="text-[10px] font-black text-[#6a0d5f] dark:text-purple-400 uppercase tracking-widest">{{ userStore.user?.role?.role || 'Administrateur' }}</p>
              </div>

              <div class="w-full pt-6 border-t border-gray-100 dark:border-white/5 grid grid-cols-1 gap-4">
                <div class="flex items-center gap-3 px-4 py-3 bg-gray-50/50 dark:bg-white/5 rounded-2xl">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">{{ form.email }}</span>
                </div>
                <div class="flex items-center gap-3 px-4 py-3 bg-gray-50/50 dark:bg-white/5 rounded-2xl">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ form.telephone || 'Non renseigné' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Forms Column -->
        <div v-reveal="{ delay: 400 }" class="lg:col-span-2 space-y-12">
          <!-- Identity Info Form -->
          <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div class="mb-8">
              <h4 class="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Informations Personnelles</h4>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gérez votre identité sur le tableau de bord.</p>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f] ml-1">Nom de famille</label>
                  <input v-model="form.nom" type="text" class="w-full px-6 py-4 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f] ml-1">Prénom</label>
                  <input v-model="form.prenom" type="text" class="w-full px-6 py-4 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f] ml-1">Adresse E-mail</label>
                  <input v-model="form.email" type="email" class="w-full px-6 py-4 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f] ml-1">N° de téléphone</label>
                  <input v-model="form.telephone" type="text" class="w-full px-6 py-4 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200" />
                </div>
              </div>

              <div class="pt-4">
                <button 
                  type="submit" 
                  :disabled="loadingProfile"
                  class="px-10 py-4 bg-[#6a0d5f] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  <span v-if="loadingProfile" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>

          <!-- Password Security Section -->
          <div class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div class="mb-8">
              <h4 class="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Sécurité et Mot de Passe</h4>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Dernière mise à jour : il y a 3 mois.</p>
            </div>

            <form @submit.prevent="updatePassword" class="space-y-8">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f] ml-1">Mot de passe actuel</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.current_password" 
                    :type="showCurrentPassword ? 'text' : 'password'" 
                    class="w-full px-6 py-4 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200" 
                  />
                  <button type="button" @click="showCurrentPassword = !showCurrentPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6a0d5f] transition-colors p-2">
                    <svg v-if="!showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" /></svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-5s2.221-3.368 5.36-5.22M3 3l18 18" /></svg>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f] ml-1">Nouveau mot de passe</label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.new_password" 
                      :type="showNewPassword ? 'text' : 'password'" 
                      class="w-full px-6 py-4 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200" 
                    />
                    <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6a0d5f] transition-colors p-2">
                      <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" /></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-5s2.221-3.368 5.36-5.22M3 3l18 18" /></svg>
                    </button>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-[#6a0d5f] ml-1">Confirmation</label>
                  <div class="relative">
                    <input 
                      v-model="passwordForm.confirm_password" 
                      :type="showConfirmPassword ? 'text' : 'password'" 
                      class="w-full px-6 py-4 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-2xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200" 
                    />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6a0d5f] transition-colors p-2">
                      <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" /></svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-5s2.221-3.368 5.36-5.22M3 3l18 18" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="pt-4">
                <button 
                  type="submit" 
                  :disabled="loadingPassword"
                  class="px-10 py-4 bg-[#6a0d5f] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  <span v-if="loadingPassword" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Actualiser le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="fixed -bottom-48 -left-48 w-96 h-96 bg-[#6a0d5f]/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
    <div class="fixed -top-48 -right-48 w-96 h-96 bg-purple-400/5 rounded-full blur-[100px] -z-10 animate-pulse" style="animation-delay: 1s"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "~~/stores/user";
import { useToast } from "#imports";
import Breadcrumb from "~/components/Breadcrumb.vue";

/* =======================
   RESOURCES
======================= */
const ProfileIconPath = "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z";

const toast = useToast();
const userStore = useUserStore();

/* =======================
   UI STATE
======================= */
const form = ref({
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
});

const passwordForm = ref({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const loadingProfile = ref(false);
const loadingPassword = ref(false);
const isPageLoading = ref(true);

/* =======================
   LIFECYCLE & DATA
======================= */
onMounted(async () => {
  try {
    isPageLoading.value = true;
    await userStore.fetchProfile();
    if (userStore.user) {
      form.value.nom = userStore.user.nom;
      form.value.prenom = userStore.user.prenom;
      form.value.email = userStore.user.email;
      form.value.telephone = userStore.user.telephone || "";
    }
  } catch (e) {
    toast.error({ message: "Erreur lors du chargement des données." });
  } finally {
    isPageLoading.value = false;
  }
});

/* =======================
   ACTIONS
======================= */
const updateProfile = async () => {
  loadingProfile.value = true;
  try {
    await userStore.updateProfile(form.value);
    toast.success({ message: "Vos modifications ont été enregistrées avec succès." });
  } catch (e: any) {
    toast.error({ message: e.message || "Erreur de mise à jour." });
  } finally {
    loadingProfile.value = false;
  }
};

const updatePassword = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    toast.error({ message: "Les mots de passe saisis sont différents." });
    return;
  }

  loadingPassword.value = true;
  try {
    await userStore.updatePassword({
      current_password: passwordForm.value.current_password,
      new_password: passwordForm.value.new_password,
    });
    toast.success({ message: "Mot de passe actualisé avec succès." });
    passwordForm.value.current_password = "";
    passwordForm.value.new_password = "";
    passwordForm.value.confirm_password = "";
  } catch (e: any) {
    toast.error({ message: e.message || "Une erreur est survenue." });
  } finally {
    loadingPassword.value = false;
  }
};
</script>

<style scoped>
/* No specific styles needed as we use Tailwind with rich configuration */
</style>
