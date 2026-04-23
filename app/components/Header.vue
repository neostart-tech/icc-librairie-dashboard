<template>
  <header
    :class="[ 'fixed top-0 right-0 z-30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]', isSidebarOpen ? 'left-72' : 'left-0 lg:left-24', 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-[0_4px_24px_rgba(106,13,95,0.05)] dark:shadow-none h-20 px-6' ]"
  >
    <div class="h-full flex items-center justify-between">
      <!-- Left Section: Toggle & Context -->
      <div class="flex items-center gap-6">
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2.5 rounded-xl bg-[#6a0d5f]/5 dark:bg-purple-500/10 text-[#6a0d5f] dark:text-purple-400 hover:bg-[#6a0d5f] hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-300 shadow-sm group"
        >
          <svg
            v-if="!isSidebarOpen"
            class="w-6 h-6 transition-transform group-hover:scale-110"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <svg v-else class="w-6 h-6 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="hidden md:flex flex-col">
          <h2 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{{ pageTitle }}</h2>
          <span class="text-[10px] font-bold text-[#6a0d5f] dark:text-purple-400 uppercase tracking-widest mt-1 opacity-60">Gestion Librairie ICC</span>
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="flex items-center gap-3">
        

        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-[#6a0d5f] dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md dark:hover:shadow-none transition-all duration-300"
        >
          <svg v-if="darkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Notifications -->
        <div class="relative" ref="notificationContainer">
          <button
            ref="notificationButton"
            @click="toggleNotifications"
            class="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:text-[#6a0d5f] dark:hover:text-purple-400 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md dark:hover:shadow-none transition-all duration-300 relative group"
          >
            <svg class="w-5 h-5 group-hover:animate-swing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="notificationStore.unreadCount > 0" class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </button>

          <!-- Notification Dropdown -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-4"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-4"
          >
            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 mt-4 w-[380px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden z-50 flex flex-col max-h-[600px] shadow-[#6a0d5f]/10"
              style="right: -140px;"
            >
              <div class="p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">Notifications</h3>
                  <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{{ notificationStore.unreadCount }} non lues</p>
                </div>
                <div class="flex items-center gap-4">
                  <button v-if="notificationStore.notifications.length > 0" 
                    @click="notificationStore.markAllAsRead" 
                    class="text-[9px] font-black text-[#6a0d5f] dark:text-purple-400 uppercase tracking-widest hover:bg-[#6a0d5f]/5 p-2 rounded-lg transition-all"
                    title="Tout marquer comme lu"
                  >
                    Tout lire
                  </button>
                  <button v-if="notificationStore.notifications.length > 0" 
                    @click="notificationStore.deleteAllNotifications" 
                    class="text-[9px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-50/5 p-2 rounded-lg transition-all"
                    title="Tout supprimer"
                  >
                    Vider
                  </button>
                </div>
              </div>
              
              <div class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                <div v-if="notificationStore.notifications.length === 0" class="py-16 text-center flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-200 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Aucune notification</p>
                </div>

                <div 
                  v-for="notif in notificationStore.notifications" 
                  :key="notif.id"
                  class="group relative p-4 rounded-xl transition-all border border-transparent flex gap-4 overflow-hidden"
                  :class="[
                    notif.read_at ? 'bg-white dark:bg-transparent' : 'bg-[#6a0d5f]/5 dark:bg-[#6a0d5f]/10 border-[#6a0d5f]/10'
                  ]"
                >
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      :class="[
                        notif.type.includes('Commande') ? 'bg-blue-500/10 text-blue-600' : 
                        notif.type.includes('Stock') ? 'bg-amber-500/10 text-amber-600' : 'bg-[#6a0d5f]/10 text-[#6a0d5f]'
                      ]"
                    >
                      <svg v-if="notif.type.includes('Commande')" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <svg v-else-if="notif.type.includes('Stock')" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div class="flex-1 min-w-0" @click="notificationStore.markAsRead(notif.id)">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <p class="text-[11px] font-black text-gray-900 dark:text-white truncate pr-6">{{ notif.data.title }}</p>
                      <span class="text-[8px] font-bold text-gray-400 whitespace-nowrap">{{ notificationStore.formatDate(notif.created_at) }}</span>
                    </div>
                    <p class="text-[10px] font-medium text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{{ notif.data.message }}</p>
                  </div>

                  <button 
                    @click.stop="notificationStore.deleteNotification(notif.id)"
                    class="absolute top-2 right-2 p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all "
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="notificationStore.notifications.length > 0" class="p-4 border-t border-gray-100 dark:border-white/5 text-center">
              </div>
            </div>
          </transition>
        </div>

        <div class="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2"></div>

        <!-- User Profile Dropdown -->
        <div class="relative" ref="userMenuContainer">
          <button
            @click="toggleUserMenu"
            class="flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md dark:hover:shadow-none transition-all duration-300 group"
          >
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6a0d5f] to-[#8a1a7a] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#6a0d5f]/20">
              {{ userInitial }}
            </div>
            <div class="hidden sm:flex flex-col text-left">
              <span class="text-xs font-black text-gray-900 dark:text-white leading-none">{{ userFullName }}</span>
              <span class="text-[9px] font-black text-[#6a0d5f] dark:text-purple-400 uppercase tracking-widest mt-1 opacity-60">{{ userRole }}</span>
            </div>
            <svg class="w-4 h-4 text-gray-400 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- User Dropdown Menu -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-4"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-4"
          >
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-4 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden z-50 py-4"
            >
              <div class="px-6 py-4 border-b border-gray-50 dark:border-white/5 mb-2">
                <p class="text-xs font-black text-gray-900 dark:text-white">{{ userFullName }}</p>
                <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 truncate">{{ userEmail }}</p>
              </div>
              
              <ul class="px-2 space-y-1">
                <li>
                  <NuxtLink to="/profil" @click="closeUserMenu" class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#6a0d5f] dark:hover:text-purple-400 hover:bg-[#6a0d5f]/5 dark:hover:bg-white/5 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Mon Profil
                  </NuxtLink>
                </li>
                <li v-if="userStore.user?.role?.role === 'superadmin'">
                  <NuxtLink to="/administrateurs" @click="closeUserMenu" class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#6a0d5f] dark:hover:text-purple-400 hover:bg-[#6a0d5f]/5 dark:hover:bg-white/5 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Gérer les Admins
                  </NuxtLink>
                </li>
                <li class="pt-2 border-t border-gray-50 dark:border-white/5">
                  <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuthStore } from "~~/stores/auth";
import { useUserStore } from "~~/stores/user";
import { useNotificationStore } from "~~/stores/notification";
import { useRoute } from "vue-router";

const props = defineProps({ isSidebarOpen: Boolean });
const emit = defineEmits(["toggle-sidebar"]);

const auth = useAuthStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const route = useRoute();

const isUserMenuOpen = ref(false);
const isNotificationsOpen = ref(false);
const darkMode = ref(false);

const notificationContainer = ref(null);
const userMenuContainer = ref(null);

const pageTitle = computed(() => {
  const path = route.path;
  if (path.includes('dashboard')) return 'Tableau de Bord';
  if (path.includes('categorie')) return 'Catégories';
  if (path.includes('livres')) return 'Livres';
  if (path.includes('stocks')) return 'Stocks';
  if (path.includes('commandes')) return 'Commandes';
  if (path.includes('utilisateurs')) return 'Utilisateurs';
  return 'Dashboard';
});

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) isNotificationsOpen.value = false;
};
const closeUserMenu = () => isUserMenuOpen.value = false;

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
  if (isNotificationsOpen.value) isUserMenuOpen.value = false;
};

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("dark", darkMode.value);
  localStorage.setItem("theme", darkMode.value ? "dark" : "light");
};

const handleClickOutside = (event) => {
  if (notificationContainer.value && !notificationContainer.value.contains(event.target)) {
    isNotificationsOpen.value = false;
  }
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

const handleLogout = () => {
  closeUserMenu();
  auth.logout();
};

const userInitial = computed(() => userStore.user?.nom?.charAt(0)?.toUpperCase() || "A");
const userFullName = computed(() => `${userStore.user?.prenom || ""} ${userStore.user?.nom || "Admin"}`);
const userEmail = computed(() => userStore.user?.email || "");
const userRole = computed(() => 
  userStore.user?.role?.role === "superadmin" ? "Admin Principal" : "Administrateur"
);

onMounted(async () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    darkMode.value = true;
    document.documentElement.classList.add("dark");
  }

  await userStore.fetchProfile();
  await notificationStore.fetchNotifications();

  const interval = setInterval(() => {
    notificationStore.fetchNotifications();
  }, 30000); 

  window.addEventListener("click", handleClickOutside);
  
  onUnmounted(() => {
    clearInterval(interval);
    window.removeEventListener("click", handleClickOutside);
  });
});

defineExpose({ closeUserMenu });
</script>

<style scoped>
@keyframes swing {
  0% { transform: rotate(0); }
  10% { transform: rotate(10deg); }
  30% { transform: rotate(-10deg); }
  50% { transform: rotate(5deg); }
  70% { transform: rotate(-5deg); }
  100% { transform: rotate(0); }
}

.animate-swing {
  animation: swing 1s ease;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(106, 13, 95, 0.1);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.1);
}
</style>
