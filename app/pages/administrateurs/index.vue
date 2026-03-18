<template>
  <div class="min-h-screen space-y-8 pb-12 relative">
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
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Initialisation</span>
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
      { label: 'Administrateurs', to: null },
    ]" title="Administrateurs" description="Gérez les comptes privilégiés et les permissions d'administration." :icon="AdminIconPath" />

    <div class="max-w-[1600px] mx-auto space-y-8 px-4 sm:px-8">
      <!-- Toolbar & Filters -->
      <div 
        v-reveal="{ delay: 200 }"
        class="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/40 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl p-6 shadow-xl relative z-20"
      >
        <div class="flex flex-col md:flex-row items-center gap-4 flex-1">
          <div class="relative flex-1 max-w-md group">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6a0d5f] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              v-model="search"
              type="text"
              placeholder="Rechercher par nom, email..."
              class="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <button
            @click="openAddModal"
            class="px-6 py-3 bg-[#6a0d5f] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
            </svg>
            Nouvel Admin
          </button>

          <button
            @click="openNommerModal"
            class="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Nommer Admin
          </button>

          <div class="relative">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-white/10 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div v-if="isDropdownOpen" class="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                <div class="p-2 space-y-1">
                  <label v-for="col in visibleColumns" :key="col.field" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-[#6a0d5f]/5 dark:hover:bg-[#6a0d5f]/10 rounded-xl cursor-pointer transition-colors group">
                    <input type="checkbox" v-model="col.visible" class="w-4 h-4 rounded-lg border-gray-300 text-[#6a0d5f] focus:ring-[#6a0d5f]" />
                    <span class="font-bold uppercase text-[10px] tracking-widest">{{ col.title }}</span>
                  </label>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div 
        v-reveal="{ delay: 400 }"
        class="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-xl p-8 shadow-2xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <Vue3Datatable
          :rows="adminUsers"
          :columns="columns"
          :pagination="true"
          :page-size="10"
          :sortable="true"
          skin="bh-table-hover"
          class="premium-table"
        >
          <template #nom="data">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#6a0d5f] to-[#8a1a7a] flex items-center justify-center text-white text-xs font-black shadow-lg">
                {{ data.value.prenom?.charAt(0) }}{{ data.value.nom?.charAt(0) }}
              </div>
              <div class="flex flex-col">
                <span class="font-black text-gray-900 dark:text-white uppercase tracking-tighter">{{ data.value.prenom }} {{ data.value.nom }}</span>
                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{{ data.value.email }}</span>
              </div>
            </div>
          </template>

          <template #statut="data">
            <div class="flex items-center gap-2">
              <div 
                v-if="data.value.statut === 'actif'" 
                class="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span class="text-[10px] font-black uppercase tracking-widest">Actif</span>
              </div>
              <div 
                v-else 
                class="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 rounded-full"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span class="text-[10px] font-black uppercase tracking-widest">Bloqué</span>
              </div>
            </div>
          </template>

          <template #actions="data">
            <div class="flex items-center gap-2">
              <button
                @click="openDetailModal(data.value)"
                class="p-2.5 rounded-xl bg-gray-500/10 text-gray-500 hover:bg-[#6a0d5f] hover:text-white transition-all group"
                title="Détails"
              >
                <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                @click="removeAdminRole(data.value)"
                class="p-2.5 rounded-xl bg-[#6a0d5f]/10 text-[#6a0d5f] hover:bg-[#6a0d5f] hover:text-white transition-all"
                title="Retirer rôle admin"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                </svg>
              </button>
              <button
                v-if="data.value.statut === 'actif'"
                @click="blockUser(data.value)"
                class="p-2.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all"
                title="Bloquer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </button>
              <button
                v-else
                @click="unblockUser(data.value)"
                class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                title="Débloquer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </template>
        </Vue3Datatable>
      </div>
    </div>

    <!-- Details Modal -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="isModalOpen" 
        class="fixed inset-0 z-[110] flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm pt-20"
        @click.self="closeDetailModal"
      >
        <div class="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">
          <div class="p-8 bg-gradient-to-r from-[#6a0d5f] to-[#8a1a7a] relative overflow-hidden">
            <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div class="flex justify-between items-start relative z-10">
              <div class="flex items-center gap-4">
                <div class="p-4 bg-white/10 rounded-xl backdrop-blur-md">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7a4 4 0 100 8 4 4 0 000-8zM2 21h12a9 9 0 00-18 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl font-black text-white uppercase tracking-tighter">
                    Profil <span class="text-white/80">Administrateur</span>
                  </h3>
                  <p class="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">
                    Compte créé le {{ selectedUserModal?.date }}
                  </p>
                </div>
              </div>
              <button @click="closeDetailModal" class="p-3 text-white/60 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-8 space-y-8">
            <div class="flex items-center gap-6">
              <div class="w-24 h-24 bg-gradient-to-br from-[#6a0d5f]/10 to-[#8a1a7a]/10 rounded-xl flex items-center justify-center text-[#6a0d5f] dark:text-purple-400 text-3xl font-black border border-[#6a0d5f]/20">
                {{ selectedUserModal?.prenom?.charAt(0) }}{{ selectedUserModal?.nom?.charAt(0) }}
              </div>
              <div class="space-y-1">
                <h4 class="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight">
                  {{ selectedUserModal?.prenom }} {{ selectedUserModal?.nom }}
                </h4>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-[#6a0d5f]/10 text-[#6a0d5f] rounded-lg text-[9px] font-black uppercase tracking-widest">{{ selectedUserModal?.role?.role }}</span>
                  <span :class="selectedUserModal?.statut === 'actif' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    {{ selectedUserModal?.statut === 'actif' ? 'Actif' : 'Bloqué' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 space-y-4">
                <div class="space-y-1">
                  <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest">Adresse E-mail</p>
                  <p class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ selectedUserModal?.email }}</p>
                </div>
                <div class="space-y-1 border-t dark:border-white/5 pt-4">
                  <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest">Numéro de Téléphone</p>
                  <p class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ selectedUserModal?.telephone || "Non renseigné" }}</p>
                </div>
              </div>

              <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 space-y-4">
                <div class="space-y-1">
                  <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest">Dernière activité</p>
                  <p class="text-xs font-black text-[#6a0d5f] dark:text-purple-400 uppercase tracking-tighter">Information non disponible</p>
                </div>
                <div class="space-y-1 border-t dark:border-white/5 pt-4">
                  <p class="text-[8px] font-black uppercase text-gray-400 tracking-widest">Permissions</p>
                  <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Accès Administration complet</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
            <button @click="closeDetailModal" class="px-8 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
              Fermer
            </button>
            <button 
              @click="removeAdminRole(selectedUserModal)" 
              class="px-8 py-3 rounded-xl bg-[#6a0d5f] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/30 hover:scale-105 active:scale-95 transition-all"
            >
              Retirer le rôle admin
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Ajouter Admin -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="modalAddOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" @click.self="closeAddModal">
        <div class="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">
          <div class="p-8 bg-[#6a0d5f] text-white">
            <h3 class="text-2xl font-black uppercase tracking-tighter">Nouvel Administrateur</h3>
            <p class="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">Créez un compte avec accès privilégié.</p>
          </div>
          <form @submit.prevent="saveAdmin" class="p-8 space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                <input v-model="newAdmin.nom" type="text" required class="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                <input v-model="newAdmin.prenom" type="text" required class="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Adresse E-mail</label>
              <input v-model="newAdmin.email" type="email" required class="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Téléphone</label>
              <input v-model="newAdmin.telephone" type="text" class="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm font-bold" />
            </div>
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="closeAddModal" class="px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Annuler</button>
              <button type="submit" :disabled="isSubmitting" class="px-8 py-4 bg-[#6a0d5f] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/30 disabled:opacity-50 flex items-center gap-2">
                <span v-if="isSubmitting" class="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                {{ isSubmitting ? 'Création...' : 'Créer l\'administrateur' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Nommer Admin -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="modalNommerOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" @click.self="closeNommerModal">
        <div class="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">
          <div class="p-8 bg-emerald-600 text-white">
            <h3 class="text-2xl font-black uppercase tracking-tighter">Promouvoir un utilisateur</h3>
            <p class="text-[10px] text-emerald-100 font-bold uppercase tracking-widest mt-1">Élevez un utilisateur au rang d'administrateur.</p>
          </div>
          <div class="p-8 space-y-6">
            <div class="relative group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input v-model="searchNommer" type="text" placeholder="Filtrer les utilisateurs..." class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-sm font-bold" />
            </div>
            
            <div class="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
              <button 
                v-for="user in filteredNommerUsers" 
                :key="user.id" 
                @click="selectedUserId = user.id"
                :class="selectedUserId === user.id ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-transparent border-transparent'"
                class="w-full flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
              >
                <div class="flex items-center gap-3">
                  <div :class="selectedUserId === user.id ? 'bg-emerald-600 scale-110' : 'bg-gray-200 dark:bg-gray-800'" class="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black transition-all">
                    {{ user.prenom?.charAt(0) }}{{ user.nom?.charAt(0) }}
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ user.prenom }} {{ user.nom }}</p>
                    <p class="text-[10px] text-gray-400 font-medium">{{ user.email }}</p>
                  </div>
                </div>
                <div v-if="selectedUserId === user.id" class="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t dark:border-white/5">
              <button type="button" @click="closeNommerModal" class="px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors">Annuler</button>
              <button @click="nommerAdmin" :disabled="!selectedUserId || isNomming" class="px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/30 disabled:opacity-50 flex items-center gap-2">
                <span v-if="isNomming" class="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Nommer Administrateur
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAdminStore } from "~~/stores/admin";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import Swal from "sweetalert2";
import { useToast } from "#imports";

/* =======================
   RESOURCES
======================= */
const AdminIconPath = "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z";

const adminStore = useAdminStore();
const toast = useToast();

/* =======================
   UI STATE
======================= */
const search = ref("");
const isDropdownOpen = ref(false);
const isPageLoading = ref(true);
const modalAddOpen = ref(false);
const modalNommerOpen = ref(false);
const newAdmin = ref({ nom: "", prenom: "", email: "", telephone: "" });
const selectedUserId = ref<string | null>(null);
const searchNommer = ref("");
const isSubmitting = ref(false);
const isNomming = ref(false);

const toggleDropdown = () => (isDropdownOpen.value = !isDropdownOpen.value);
const closeDropdown = () => (isDropdownOpen.value = false);

/* =======================
   COLUMNS
======================= */
const visibleColumns = ref([
  { field: "nom", title: "Administrateur", sortable: true, visible: true },
  { field: "telephone", title: "Téléphone", sortable: true, visible: true },
  { field: "date", title: "Création", sortable: true, visible: true },
  { field: "statut", title: "Statut", sortable: true, visible: true, isSlot: true },
  { field: "actions", title: "Actions", sortable: false, visible: true, isSlot: true },
]);
const columns = computed(() => visibleColumns.value.filter((c) => c.visible));

/* =======================
   MODAL DETAILS
======================= */
const isModalOpen = ref(false);
const selectedUserModal = ref<any>(null);
const openDetailModal = (user: any) => {
  selectedUserModal.value = user;
  isModalOpen.value = true;
};
const closeDetailModal = () => {
  isModalOpen.value = false;
  selectedUserModal.value = null;
};

/* =======================
   DATA PROCESSING
======================= */
const adminUsers = computed(() =>
  adminStore.users
    .filter((u) => u.role?.role === "admin")
    .map((u) => ({
      ...u,
      statut: u.statut?.toLowerCase() === "actif" ? "actif" : "inactif",
      date: new Date(u.created_at).toLocaleDateString('fr-FR'),
    }))
    .filter((u) =>
      `${u.nom} ${u.prenom} ${u.email}`
        .toLowerCase()
        .includes(search.value.toLowerCase()),
    ),
);

const filteredNommerUsers = computed(() =>
  adminStore.users
    .filter((u) => u.role?.role === "user")
    .filter((u) =>
      `${u.nom} ${u.prenom} ${u.email}`
        .toLowerCase()
        .includes(searchNommer.value.toLowerCase()),
    ),
);

/* =======================
   MODAL ADD ACTIONS
======================= */
const openAddModal = () => {
  newAdmin.value = { nom: "", prenom: "", email: "", telephone: "" };
  modalAddOpen.value = true;
};
const closeAddModal = () => (modalAddOpen.value = false);

const saveAdmin = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload = { ...newAdmin.value, telephone: newAdmin.value.telephone || null };
    await adminStore.createAdmin(payload);
    toast.success({ message: "Le compte administrateur a été créé." });
    await adminStore.fetchAllUsers();
    closeAddModal();
  } catch (e: any) {
    const msg = e?.data?.message || "Erreur lors de la création";
    toast.error({ message: msg });
  } finally {
    isSubmitting.value = false;
  }
};

/* =======================
   MODAL NOMMER ACTIONS
======================= */
const openNommerModal = () => {
  selectedUserId.value = null;
  searchNommer.value = "";
  modalNommerOpen.value = true;
};
const closeNommerModal = () => (modalNommerOpen.value = false);

const nommerAdmin = async () => {
  if (isNomming.value || !selectedUserId.value) return;
  isNomming.value = true;
  try {
    await adminStore.makeAdmin(selectedUserId.value);
    toast.success({ message: "Utilisateur promu au rang d'administrateur." });
    await adminStore.fetchAllUsers();
    closeNommerModal();
  } catch (e: any) {
    toast.error({ message: "Erreur lors de la promotion." });
  } finally {
    isNomming.value = false;
  }
};

/* =======================
   ACTIONS
======================= */
const blockUser = async (user: any) => {
  const result = await Swal.fire({
    title: "Bloquer l'administrateur ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f43f5e",
    confirmButtonText: "Oui, bloquer",
    customClass: {
      popup: 'rounded-xl border-none shadow-2xl bg-white dark:bg-gray-900',
      title: 'font-black uppercase tracking-tighter text-gray-800 dark:text-white',
    }
  });
  if (result.isConfirmed) {
    await adminStore.lockUser(user.id);
    toast.success({ message: `${user.nom} a été bloqué.` });
    await adminStore.fetchAllUsers();
  }
};

const unblockUser = async (user: any) => {
  const result = await Swal.fire({
    title: "Débloquer l'administrateur ?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    confirmButtonText: "Confirmer",
    customClass: {
      popup: 'rounded-xl border-none shadow-2xl bg-white dark:bg-gray-900',
      title: 'font-black uppercase tracking-tighter text-gray-800 dark:text-white',
    }
  });
  if (result.isConfirmed) {
    await adminStore.unlockUser(user.id);
    toast.success({ message: `${user.nom} a été débloqué.` });
    await adminStore.fetchAllUsers();
  }
};

const removeAdminRole = async (user: any) => {
  const result = await Swal.fire({
    title: "Retirer le rôle ?",
    text: `Souhaitez-vous retirer les accès administrateur à ${user.nom} ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a0d5f",
    confirmButtonText: "Confirmer",
    customClass: {
      popup: 'rounded-xl border-none shadow-2xl bg-white dark:bg-gray-900',
      title: 'font-black uppercase tracking-tighter text-gray-800 dark:text-white',
    }
  });
  if (result.isConfirmed) {
    await adminStore.makeUser(user.id);
    toast.success({ message: "Le rôle administrateur a été révoqué." });
    await adminStore.fetchAllUsers();
    if (selectedUserModal.value?.id === user.id) closeDetailModal();
  }
};

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  isPageLoading.value = true;
  try {
    await adminStore.fetchAllUsers();
  } finally {
    isPageLoading.value = false;
  }
  
  const handleGlobalClick = (e: MouseEvent) => {
    if (isDropdownOpen.value && !(e.target as HTMLElement).closest(".relative")) {
      closeDropdown();
    }
  };
  window.addEventListener("click", handleGlobalClick);
  onUnmounted(() => window.removeEventListener("click", handleGlobalClick));
});

definePageMeta({
  middleware: ["superadmin"],
});
</script>

<style>
/* PREMIUM TABLE STYLES - ADMINS */
.premium-table {
  background-color: transparent !important;
  border: none !important;
}
.premium-table .bh-table-responsive {
  border: none !important;
}
.premium-table thead tr th {
  background-color: rgba(106, 13, 95, 0.05) !important;
  color: #9ca3af !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  font-size: 10px !important;
  letter-spacing: 0.1em !important;
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
  border: none !important;
}
.dark .premium-table thead tr th {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
.premium-table tbody tr {
  background-color: transparent !important;
  border-bottom: 1px solid rgba(229, 231, 235, 1) !important;
}
.dark .premium-table tbody tr {
  border-bottom-color: rgba(255, 255, 255, 0.05) !important;
}
.premium-table tbody tr td {
  padding-top: 1.25rem !important;
  padding-bottom: 1.25rem !important;
  font-size: 0.875rem !important;
  font-weight: 700 !important;
}
.premium-table .bh-pagination .bh-page-item.bh-active {
  background-color: #6a0d5f !important;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(106, 13, 95, 0.1);
  border-radius: 10px;
}
</style>
