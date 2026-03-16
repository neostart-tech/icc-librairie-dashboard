<template>
  <aside
    :class="[
      'fixed top-2 left-4 z-40 h-[calc(100vh-1rem)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
      'bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-[0_8px_32px_0_rgba(106,13,95,0.15)] dark:shadow-none rounded-[2.5rem]',
      isSidebarOpen
        ? 'translate-x-0 w-72'
        : '-translate-x-[110%] lg:translate-x-0 lg:w-24',
    ]"
    aria-label="Sidebar"
  >
    <div class="flex flex-col h-full relative overflow-hidden">
      <!-- Decorative Backdrop Glow -->
      <div class="absolute -top-24 -left-24 w-48 h-48 bg-[#6a0d5f]/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header / Logo -->
      <div class="p-8 flex items-center justify-center flex-shrink-0 transition-all duration-300">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="relative">
            <div class="absolute inset-0 bg-[#6a0d5f] blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-xl"></div>
            <img
              src="/logo/logo_librairie(1).png"
              alt="ICC Librairie"
              class="relative h-10 w-10 object-contain brightness-100 transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div v-if="isSidebarOpen" class="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 class="text-lg font-black text-[#6a0d5f] dark:text-purple-400 uppercase tracking-tighter leading-none">ICC Librairie</h1>
            <span class="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mt-1">Dashboard</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar pt-2">
        <div v-for="(item, index) in menuItems" :key="index">
          <!-- Multi-level item -->
          <div v-if="item.children" class="space-y-1">
            <button
              @click="toggleSubmenu(item.key)"
              :class="[
                'w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden',
                activeSubmenu === item.key ? 'text-[#6a0d5f] dark:text-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-[#6a0d5f] dark:hover:text-purple-400 hover:bg-[#6a0d5f]/5 dark:hover:bg-white/5'
              ]"
            >
              <div :class="['p-2 rounded-xl transition-colors duration-300', activeSubmenu === item.key ? 'bg-[#6a0d5f] text-white shadow-lg shadow-[#6a0d5f]/20' : 'bg-gray-100 dark:bg-gray-800/50 group-hover:bg-[#6a0d5f]/10 dark:group-hover:bg-[#6a0d5f]/20']">
                <div v-html="item.icon" class="w-5 h-5 flex items-center justify-center"></div>
              </div>
              <span v-if="isSidebarOpen" class="font-bold text-sm tracking-tight flex-1 text-left">{{ item.title }}</span>
              <svg
                v-if="isSidebarOpen"
                :class="['w-4 h-4 transition-transform duration-300', activeSubmenu === item.key ? 'rotate-180' : '']"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="activeSubmenu === item.key && isSidebarOpen" class="ml-12 space-y-1 overflow-hidden">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.to"
                  :to="child.to"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 group/child text-gray-500 dark:text-gray-400 hover:text-[#6a0d5f] dark:hover:text-purple-400 hover:bg-[#6a0d5f]/5 dark:hover:bg-white/5"
                  active-class="!text-[#6a0d5f] dark:!text-purple-400 bg-[#6a0d5f]/5 dark:bg-purple-500/10 shadow-sm"
                >
                  <div :class="['p-1.5 rounded-lg transition-all duration-300', $route.path === child.to ? 'bg-[#6a0d5f] text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 group-hover/child:bg-[#6a0d5f]/10 group-hover/child:text-[#6a0d5f] dark:group-hover/child:text-purple-400']">
                    <div v-html="child.icon" class="w-3.5 h-3.5 flex items-center justify-center"></div>
                  </div>
                  <span class="truncate">{{ child.title }}</span>
                </NuxtLink>
              </div>
            </transition>
          </div>

          <!-- Single item -->
          <NuxtLink
            v-else
            :to="item.to"
            :class="[
              'flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative',
              $route.path === item.to ? 'text-[#6a0d5f] dark:text-purple-400 bg-[#6a0d5f]/5 dark:bg-purple-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-[#6a0d5f] dark:hover:text-purple-400 hover:bg-[#6a0d5f]/5 dark:hover:bg-white/5'
            ]"
            @click="activeSubmenu = null"
          >
            <div :class="['p-2 rounded-xl transition-colors duration-300', $route.path === item.to ? 'bg-[#6a0d5f] text-white shadow-lg shadow-[#6a0d5f]/30' : 'bg-gray-100 dark:bg-gray-800/50 group-hover:bg-[#6a0d5f]/10 dark:group-hover:bg-[#6a0d5f]/20']">
              <div v-html="item.icon" class="w-5 h-5 flex items-center justify-center"></div>
            </div>
            <span v-if="isSidebarOpen" class="font-bold text-sm tracking-tight">{{ item.title }}</span>
            <div v-if="$route.path === item.to" class="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#6a0d5f] dark:bg-purple-400 animate-pulse"></div>
          </NuxtLink>
        </div>
      </nav>

      <!-- Footer / User Profile -->
      <div class="p-6 mt-auto">
        <div 
          :class="[
            'bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-white/5 rounded-3xl transition-all duration-300 overflow-hidden',
            isSidebarOpen ? 'p-4' : 'p-2'
          ]"
        >
          <div class="flex items-center gap-3">
            <div class="relative flex-shrink-0">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6a0d5f] to-[#8a1a7a] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#6a0d5f]/20 transition-transform duration-500 hover:scale-110">
                {{ userInitial }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div v-if="isSidebarOpen" class="flex flex-col min-w-0">
              <span class="text-xs font-black text-gray-900 dark:text-white truncate">{{ userFullName }}</span>
              <span class="text-[10px] font-bold text-[#6a0d5f] dark:text-purple-400 uppercase tracking-wider truncate">{{ userRole }}</span>
            </div>
          </div>
          
          <button 
            v-if="isSidebarOpen"
            @click="handleLogout"
            class="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </aside>

  <!-- Overlay Mobile -->
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isSidebarOpen && windowWidth < 1024"
      class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
      @click="$emit('toggle-sidebar')"
    ></div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useUserStore } from "~~/stores/user";
import { useAuthStore } from "~~/stores/auth";

// Rich SVG Icons
const Icons = {
  Home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  Category: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
  Book: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
  Stock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  Orders: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  Users: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  // Sub-menu icons
  List: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  Plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  History: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
  Swap: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>'
};

const props = defineProps({ isSidebarOpen: Boolean });
const emit = defineEmits(["toggle-sidebar"]);

const auth = useAuthStore();
const userStore = useUserStore();
const activeSubmenu = ref(null);
const windowWidth = ref(0);

const menuItems = [
  { title: "Tableau de bord", to: "/dashboard", icon: Icons.Home },
  { title: "Catégories", to: "/categorie", icon: Icons.Category },
  { 
    title: "Livres", 
    key: "livres", 
    icon: Icons.Book,
    children: [
      { title: "Catalogue", to: "/livres", icon: Icons.List },
      { title: "Ajouter", to: "/livres/ajouter", icon: Icons.Plus }
    ]
  },
  { 
    title: "Stocks", 
    key: "stocks", 
    icon: Icons.Stock,
    children: [
      { title: "Historique", to: "/stocks", icon: Icons.History },
      { title: "Transactions", to: "/stocks/mouvements", icon: Icons.Swap }
    ]
  },
  { title: "Commandes", to: "/commandes", icon: Icons.Orders },
  { title: "Utilisateurs", to: "/utilisateurs", icon: Icons.Users },
];

const toggleSubmenu = (key) => {
  activeSubmenu.value = activeSubmenu.value === key ? null : key;
};

const handleLogout = () => auth.logout();

const userInitial = computed(() => userStore.user?.nom?.charAt(0)?.toUpperCase() || "A");
const userFullName = computed(() => `${userStore.user?.prenom || ""} ${userStore.user?.nom || "Admin"}`);
const userRole = computed(() => 
  userStore.user?.role?.role === "superadmin" ? "Super Admin" : "Administrateur"
);

const updateWindowWidth = () => { windowWidth.value = window.innerWidth; };

onMounted(async () => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
  await userStore.fetchProfile();
});

onUnmounted(() => { window.removeEventListener("resize", updateWindowWidth); });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(106, 13, 95, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(106, 13, 95, 0.2);
}
</style>
