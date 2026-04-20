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
        class="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-32 bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl"
      >
        <div class="relative">
          <!-- Outer Rotating Ring -->
          <div class="w-24 h-24 rounded-full border-4 border-[#6a0d5f]/10 border-t-[#6a0d5f] animate-spin"></div>
          <!-- Inner Logo (fixed) -->
          <div class="absolute inset-0 flex items-center justify-center">
            <img src="/logo/logo_librairie(1).png" class="w-12 h-12 object-contain" alt="Logo" />
          </div>
        </div>
        <div class="mt-6 flex flex-col items-center">
          <span class="text-[10px] uppercase tracking-[0.3em] text-[#6a0d5f] animate-pulse">Initialisation</span>
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
      { label: 'Livres', to: '/livres' },
    ]" title="Livres" description="Gérez l'ensemble de vos références littéraires et votre stock." :icon="BookIconPath" />

    <div class="max-w-[1600px] mx-auto px-4 sm:px-8">
      <!-- Unified List Container -->
      <div 
        v-reveal="{ delay: 200 }"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-xl shadow-[#6a0d5f]/5 overflow-hidden"
      >
        <!-- Integrated Toolbar (Header of the Table) -->
        <div class="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div class="flex items-center gap-4 flex-1">
            <div class="relative w-full max-w-md group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6a0d5f] transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                v-model="search"
                type="text"
                placeholder="Rechercher par titre..."
                class="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#6a0d5f] transition-all outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
              />
            </div>

            <!-- Optional Quick Filters -->
            <div class="hidden sm:flex items-center gap-2">
              <span class="text-[10px] uppercase tracking-widest text-gray-400 mr-2">Filtre Rapide:</span>
              <button class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-[#6a0d5f]/5 text-[#6a0d5f] hover:bg-[#6a0d5f] hover:text-white transition-all">Tous</button>
              <button class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">En Stock</button>
              <button class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">Promo</button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <button
                @click="isDropdownOpen = !isDropdownOpen"
                class="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#6a0d5f] transition-all text-gray-600 dark:text-gray-300 shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <!-- Column Dropdown -->
              <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                <div v-if="isDropdownOpen" class="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-30 overflow-hidden">
                  <div class="p-2 space-y-1">
                    <label v-for="col in allColumns" :key="col.field" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-[#6a0d5f]/5 dark:hover:bg-[#6a0d5f]/10 rounded-xl cursor-pointer transition-colors group">
                      <input type="checkbox" v-model="col.visible" class="w-4 h-4 rounded border-gray-300 text-[#6a0d5f] focus:ring-[#6a0d5f]" />
                      <span class="font-bold uppercase text-[10px] tracking-widest">{{ col.title }}</span>
                    </label>
                  </div>
                </div>
              </transition>
            </div>

            <button
              @click="triggerExcelImport"
              class="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-[#6a0d5f] hover:text-[#6a0d5f] transition-all flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" />
              </svg>
              Importer
            </button>

            <NuxtLink
              to="/livres/ajouter"
              class="px-6 py-3 bg-[#6a0d5f] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/20 hover:bg-[#8a1a7a] transition-all flex items-center gap-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter
            </NuxtLink>
          </div>
        </div>

        <!-- Table Content -->
        <div class="relative overflow-hidden p-0">
          <Vue3Datatable
            :rows="filteredRows"
            :columns="columns"
            :pagination="true"
            :page-size="10"
            :sortable="true"
            :loading="livreStore.loading"
            skin="bh-table-hover bh-table-bordered"
            class="premium-table-v2"
          >
            <template #image="data">
              <div class="py-2">
                <img 
                  v-if="data.value.image" 
                  :src="data.value.image" 
                  class="w-12 h-16 object-cover rounded-lg shadow-sm border border-gray-200 dark:border-white/10" 
                />
                <div v-else class="w-12 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700">
                  <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.832 5.477 4 6.253v13C4.832 18.477 6.416 19 7.5 19s2.668-.523 3.5-1.253V6.253z" />
                  </svg>
                </div>
              </div>
            </template>

            <template #stock="data">
              <div class="flex items-center gap-2">
                <div v-if="data.value.stock === 0" class="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-600 rounded-full border border-red-500/20">
                  <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  <span class="text-[10px] font-bold uppercase tracking-widest">Rupture</span>
                </div>
                <div v-else :class="['flex items-center gap-1.5 px-3 py-1 rounded-full border', data.value.stock < 5 ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20']">
                  <div :class="['w-1.5 h-1.5 rounded-full', data.value.stock < 5 ? 'bg-orange-500' : 'bg-emerald-500']"></div>
                  <span class="text-[10px] font-bold uppercase tracking-widest">{{ data.value.stock }}</span>
                </div>
              </div>
            </template>

            <template #actions="data">
              <div class="flex items-center gap-2">
                <button
                  @click="openDetails(data.value)"
                  class="p-2 rounded-xl text-gray-400 hover:text-[#6a0d5f] hover:bg-[#6a0d5f]/5 transition-all"
                  title="Détails"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="openEdit(data.value)"
                  class="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-500/5 transition-all"
                  title="Modifier"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  @click="deleteLivre(data.value)"
                  class="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-500/5 transition-all"
                  title="Supprimer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </template>
          </Vue3Datatable>
        </div>
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
        v-if="showDetailModal" 
        class="fixed inset-0 z-[110] flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm pt-20"
        @click.self="showDetailModal = false"
      >
        <div class="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/5">
          <div class="p-8 bg-[#6a0d5f] relative overflow-hidden">
            <div class="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            
            <div class="flex justify-between items-start relative z-10">
              <div class="flex items-center gap-4">
                <div class="p-4 bg-white/10 rounded-xl backdrop-blur-md">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.832 5.477 4 6.253v13C4.832 18.477 6.416 19 7.5 19s2.668-.523 3.5-1.253V6.253z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-2xl text-white uppercase tracking-tighter">
                    Détails du <span class="text-orange-400">Livre</span>
                  </h3>
                  <p class="text-[10px] text-white/60 uppercase tracking-widest mt-1">
                    Référence: #{{ selectedLivre.id.split('-')[0] }}
                  </p>
                </div>
              </div>
              <button @click="showDetailModal = false" class="p-3 text-white/60 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-8">
            <div class="flex flex-col md:flex-row gap-10">
              <!-- Book Cover Area -->
              <div class="md:w-1/3 shrink-0">
                <div class="relative group">
                  <img :src="selectedLivre.image" :alt="selectedLivre.titre" class="w-full aspect-[3/4.5] object-cover rounded-xl shadow-2xl border border-gray-100 dark:border-white/10" />
                  <div v-if="selectedLivre.stock === 0" class="absolute inset-0 bg-red-600/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                    <span class="px-4 py-2 bg-white text-red-600 text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg">Rupture</span>
                  </div>
                </div>
                
                <div class="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 text-center">
                  <p class="text-[10px] uppercase text-gray-400 tracking-widest mb-1">Prix de vente</p>
                  <div class="flex flex-col items-center">
                    <p v-if="selectedLivre.prix_promo" class="text-sm text-gray-400 line-through mb-1">
                      {{ formatPrice(selectedLivre.prix) }}
                    </p>
                    <p class="text-3xl text-[#6a0d5f] dark:text-purple-400 tracking-tighter">
                      {{ formatPrice(selectedLivre.prix_promo || selectedLivre.prix) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Content Area -->
              <div class="flex-1 space-y-8">
                <div>
                  <h2 class="text-3xl text-gray-900 dark:text-white uppercase tracking-tighter leading-tight mb-2">{{ selectedLivre.titre }}</h2>
                  <div class="flex items-center gap-3">
                    <span class="px-4 py-1.5 bg-[#6a0d5f]/10 text-[#6a0d5f] rounded-xl text-[10px] uppercase tracking-widest">{{ selectedLivre.categorie }}</span>
                    <span class="text-sm text-gray-500">par <span class="text-gray-900 dark:text-white">{{ selectedLivre.auteur }}</span></span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="p-6 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                    <p class="text-[10px] uppercase text-emerald-600 tracking-widest mb-1">Disponibilité</p>
                    <p class="text-xl text-emerald-700 dark:text-emerald-400">{{ selectedLivre.stock }} <span class="text-sm uppercase text-emerald-600/60">unités</span></p>
                  </div>
                  <div class="p-6 bg-orange-500/5 rounded-xl border border-orange-500/10">
                    <p class="text-[10px] uppercase text-orange-600 tracking-widest mb-1">Rentabilité</p>
                    <p class="text-xl text-orange-700 dark:text-orange-400">Standard</p>
                  </div>
                </div>

                <div class="space-y-3">
                  <p class="text-[10px] uppercase tracking-widest text-gray-400 ml-1">À propos de cet ouvrage</p>
                  <div class="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 min-h-[150px]">
                    <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                      {{ selectedLivre.description || "Aucune description détaillée n'a été fournie pour cet ouvrage. Vous pouvez en ajouter une en modifiant la fiche." }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-white/10 flex justify-end gap-3">
            <button @click="showDetailModal = false" class="px-8 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-widest hover:bg-gray-300 transition-colors">
              Fermer
            </button>
            <button @click="openEdit(selectedLivre)" class="px-8 py-3 rounded-xl bg-[#6a0d5f] text-white text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#6a0d5f]/30 hover:scale-105 active:scale-95 transition-all">
              Modifier la fiche
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- MODAL IMPORT EXCEL PROGRESS -->
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-8"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-8"
    >
      <div v-if="showImportModal" class="fixed inset-0 z-[120] flex items-start justify-center p-4 bg-black/60 backdrop-blur-md pt-24" @click.self="!isImporting && closeImportModal()">
        <div class="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 relative">
          <!-- Glassmorphic Background Pattern -->
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#6a0d5f]/10 rounded-full blur-3xl"></div>
          
          <div class="p-8 text-center relative z-10">
            <!-- Icon State -->
            <div class="mb-8 relative inline-block">
              <div :class="[ 'w-24 h-24 rounded-xl flex items-center justify-center mx-auto transition-all duration-700', finishedImport ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40 rotate-12' : 'bg-[#6a0d5f] shadow-lg shadow-[#6a0d5f]/40 animate-pulse' ]">
                <svg v-if="!finishedImport" class="w-10 h-10 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <svg v-else class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 class="text-3xl text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
              {{ finishedImport ? 'Félicitations !' : 'Traitement en cours' }}
            </h3>
            
            <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-8">
              {{ finishedImport ? 'Votre catalogue a été mis à jour avec succès.' : 'Veuillez patienter pendant l\'importation de vos données.' }}
            </p>

            <!-- Progress Bar -->
            <div class="mb-10 space-y-3">
              <div class="flex justify-between items-end px-1">
                <span class="text-[10px] text-[#6a0d5f] dark:text-purple-400 uppercase tracking-widest">{{ Math.round(importProgress) }}%</span>
                <span class="text-[10px] text-gray-400 uppercase tracking-widest">{{ importCurrent }} / {{ importTotal }} références</span>
              </div>
              <div class="w-full bg-gray-100 dark:bg-white/5 rounded-full h-4 overflow-hidden p-1 shadow-inner">
                <div 
                  class="h-full bg-gradient-to-r from-[#6a0d5f] to-orange-400 rounded-full transition-all duration-500 ease-out relative" 
                  :style="{ width: importProgress + '%' }"
                >
                  <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Stats Summary (Visible when finished) -->
            <transition
              enter-active-class="transition duration-500 delay-300 ease-out"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div v-if="finishedImport" class="grid grid-cols-2 gap-4 mb-10">
                <div class="p-6 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <p class="text-[9px] text-emerald-600 uppercase tracking-widest mb-1">Livres ajoutés</p>
                  <p class="text-2xl text-emerald-700 dark:text-emerald-400 tracking-tighter">{{ importTotal - importSkipped }}</p>
                </div>
                <div class="p-6 bg-amber-500/5 rounded-xl border border-amber-500/10">
                  <p class="text-[9px] text-amber-600 uppercase tracking-widest mb-1">Doublons ignorés</p>
                  <p class="text-2xl text-amber-700 dark:text-amber-400 tracking-tighter">{{ importSkipped }}</p>
                </div>
              </div>
            </transition>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-3">
              <button 
                v-if="!finishedImport"
                @click="cancelImport = true"
                class="w-full py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 transition-all active:scale-95"
              >
                Annuler l'importation
              </button>

              <button 
                @click="closeImportModal" 
                :disabled="isImporting && !finishedImport"
                :class="[ 'w-full py-5 rounded-xl text-xs uppercase tracking-[0.3em] transition-all duration-300 shadow-xl active:scale-95', finishedImport ? 'bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-700' : 'hidden' ]"
              >
                Terminer et voir la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <input type="file" accept=".xlsx, .xls" ref="importFileRef" class="hidden" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Breadcrumb from "~/components/Breadcrumb.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useLivreStore } from "~~/stores/livre";
import { useCategorieStore } from "~~/stores/categorie";
import { useStockStore } from "~~/stores/stock";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useToast } from "#imports";

/* =======================
   RESOURCES
======================= */
const BookIconPath = "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.832 5.477 4 6.253v13C4.832 18.477 6.416 19 7.5 19s2.668-.523 3.5-1.253V6.253z";

/* =======================
   STORES
======================= */
const livreStore = useLivreStore();
const categorieStore = useCategorieStore();
const stockStore = useStockStore();
const toast = useToast();

/* =======================
   UI STATE
======================= */
const search = ref("");
const isDropdownOpen = ref(false);
const showDetailModal = ref(false);
const selectedLivre = ref<any>(null);
const isPageLoading = ref(true);

/* =======================
   TABLE CONFIG
======================= */
const allColumns = ref([
  { field: "image", title: "Image", sortable: false, visible: true },
  { field: "titre", title: "Titre", sortable: true, visible: true },
  { field: "auteur", title: "Auteur", sortable: true, visible: true },
  { field: "categorie", title: "Catégorie", sortable: true, visible: true },
  { field: "prix", title: "Prix", sortable: true, visible: true },
  { field: "prix_promo", title: "Prix promo", sortable: true, visible: true },
  { field: "stock", title: "Stock", sortable: true, visible: true },
  { field: "actions", title: "Actions", sortable: false, visible: true },
]);

const columns = computed(() => allColumns.value.filter((c) => c.visible));

/* =======================
   DATA PROCESSING
======================= */
const formatPrice = (value: number | null) => {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("fr-FR") + " FCFA";
};

const rows = computed(() =>
  livreStore.livres.map((l) => {
    const quantite = l.stock?.quantite ?? 0;
    return {
      id: l.id,
      image: livreStore.getCoverImage(l),
      titre: l.titre,
      auteur: l.auteurRel?.nom ?? l.auteur ?? "—",
      categorie: l.categorie?.libelle ?? "—",
      prix: l.prix,
      prix_promo: l.prix_promo,
      stock: quantite,
      description: l.description,
    };
  }),
);

const filteredRows = computed(() =>
  rows.value.filter((r) =>
    r.titre.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

/* =======================
   ACTIONS
======================= */
const openDetails = (row: any) => {
  selectedLivre.value = row;
  showDetailModal.value = true;
};

const openEdit = (row: any) => {
  navigateTo(`/livres/${row.id}/edit`);
};

const deleteLivre = async (row: any) => {
  const result = await Swal.fire({
    title: "Supprimer ?",
    text: `Voulez-vous vraiment supprimer "${row.titre}" ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a0d5f",
    cancelButtonColor: "#f43f5e",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    customClass: {
      popup: 'rounded-xl border-none shadow-2xl bg-white dark:bg-gray-900',
      title: 'uppercase tracking-tighter text-gray-800 dark:text-white',
      confirmButton: 'rounded-xl uppercase tracking-widest',
      cancelButton: 'rounded-xl uppercase tracking-widest'
    }
  });

  if (!result.isConfirmed) return;
  await livreStore.deleteLivre(row.id);
  toast.success({ message: "Livre supprimé avec succès" });
};

/* =======================
   EXCEL IMPORT LOGIC
======================= */
const showImportModal = ref(false);
const isImporting = ref(false);
const importProgress = ref(0);
const importCurrent = ref(0);
const importTotal = ref(0);
const importSkipped = ref(0);
const cancelImport = ref(false);
const finishedImport = ref(false);
const importFileRef = ref<HTMLInputElement | null>(null);

const triggerExcelImport = () => importFileRef.value?.click();

const closeImportModal = () => {
  showImportModal.value = false;
  isImporting.value = false;
  cancelImport.value = false;
  finishedImport.value = false;
  importProgress.value = 0;
  importSkipped.value = 0;
  importCurrent.value = 0;
  importTotal.value = 0;
  if (importFileRef.value) importFileRef.value.value = "";
  livreStore.fetchLivres();
};

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || !target.files.length) return;
  const file = target.files[0];
  const reader = new FileReader();

  reader.onload = async (event: any) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rowsData = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!rowsData.length) {
        toast.error({ message: "Fichier vide ou invalide" });
        return;
      }

      showImportModal.value = true;
      isImporting.value = true;
      importTotal.value = rowsData.length;
      importSkipped.value = 0;
      await categorieStore.fetchCategories();

      for (let i = 0; i < rowsData.length; i++) {
        if (cancelImport.value) break;
        importCurrent.value = i + 1;
        importProgress.value = Math.round(((i + 1) / rowsData.length) * 100);
        
        try {
          const row = rowsData[i];
          const titre = row.ITEM_NAME?.toString().trim();
          if (!titre) {
            importSkipped.value++;
            continue;
          }

          // 1. Catégorie
          let catId = 1;
          if (row.CATEGORY) {
            const catName = row.CATEGORY.toString().trim();
            const existingCat = categorieStore.categories.find(c => c.libelle.toLowerCase() === catName.toLowerCase());
            if (existingCat) catId = existingCat.id;
            else {
              const newCat = await categorieStore.createCategorie(catName, null);
              catId = newCat?.id || 1;
            }
          }

          // 2. Éviter les doublons : Ignorer si le titre existe déjà
          const existingLivre = livreStore.livres.find(l => l.titre.toLowerCase() === titre.toLowerCase());
          
          if (existingLivre) {
            importSkipped.value++;
            continue;
          }

          // Nouveau livre
          const newLivre = await livreStore.createLivre({
            titre: titre,
            description: "",
            prix: Number(row.PRICE) || 0,
            categorie_id: catId,
          });

          if (!newLivre) {
            importSkipped.value++;
            continue;
          }

          // On l'ajoute temporairement à la liste pour les lignes suivantes du même Excel
          livreStore.livres.push(newLivre);

          // 3. Stock pour le NOUVEAU livre uniquement
          const stock = Number(row.STOCK) || 0;
          if (stock > 0) {
            await stockStore.addMouvement({
              livre_id: newLivre.id,
              type: "entree",
              quantite: stock,
              commentaire: "Import Excel (Initial)",
            });
          }
        } catch (err) { 
          console.error(err);
          importSkipped.value++;
        }
      }
      finishedImport.value = true;
    } catch (err) { toast.error({ message: "Erreur de lecture" }); }
  };
 reader.readAsArrayBuffer(file);
};

/* =======================
   LIFECYCLE
======================= */
onMounted(async () => {
  try {
    isPageLoading.value = true;
    await livreStore.fetchLivres();
  } finally {
    isPageLoading.value = false;
  }
});
</script>

<style>
/* PREMIUM TABLE V2 */
.premium-table-v2 {
  background-color: transparent !important;
  border: none !important;
}

/* Headers */
.premium-table-v2 thead tr th {
  background-color: #f8fafc !important;
  color: #64748b !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  font-size: 10px !important;
  letter-spacing: 0.1em !important;
  padding: 1.25rem 1.5rem !important;
  border-bottom: 2px solid #f1f5f9 !important;
}
.dark .premium-table-v2 thead tr th {
  background-color: rgba(255, 255, 255, 0.02) !important;
  color: #94a3b8 !important;
  border-bottom-color: rgba(255, 255, 255, 0.05) !important;
}

/* Rows */
.premium-table-v2 tbody tr {
  background-color: transparent !important;
  border-bottom: 1px solid #f1f5f9 !important;
  transition: all 0.2s;
}
.dark .premium-table-v2 tbody tr {
  border-bottom-color: rgba(255, 255, 255, 0.05) !important;
}
.premium-table-v2 tbody tr:hover {
  background-color: rgba(106, 13, 95, 0.01) !important;
}
.dark .premium-table-v2 tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.01) !important;
}

/* Cells */
.premium-table-v2 tbody tr td {
  padding: 1rem 1.5rem !important;
  font-size: 0.875rem !important;
  color: #334155 !important;
  vertical-align: middle !important;
}
.dark .premium-table-v2 tbody tr td {
  color: #cbd5e1 !important;
}

/* Sorting Icons */
.premium-table-v2 .bh-sort-icon {
  width: 14px !important;
  height: 14px !important;
  margin-left: 6px !important;
  color: #cbd5e1 !important;
}

/* Pagination */
.premium-table-v2 .bh-pagination {
  padding: 1.5rem !important;
  border-top: 1px solid #f1f5f9 !important;
}
.dark .premium-table-v2 .bh-pagination {
  border-top-color: rgba(255, 255, 255, 0.05) !important;
}

.premium-table-v2 .bh-pagination .bh-page-item {
  border-radius: 8px !important;
  border: 1px solid #e2e8f0 !important;
  background-color: #fff !important;
  color: #64748b !important;
  width: 32px !important;
  height: 32px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 2px !important;
  transition: all 0.2s !important;
}
.dark .premium-table-v2 .bh-pagination .bh-page-item {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #94a3b8 !important;
}

.premium-table-v2 .bh-pagination .bh-page-item.bh-active {
  background-color: #6a0d5f !important;
  border-color: #6a0d5f !important;
  color: #fff !important;
}

.premium-table-v2 .bh-pagination .bh-page-item:hover:not(.bh-active) {
  border-color: #6a0d5f !important;
  color: #6a0d5f !important;
}
</style>
