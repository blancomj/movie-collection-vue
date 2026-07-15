<template>
  <header class="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary to-purple-700 shadow-md">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <i class="fas fa-film text-white text-lg"></i>
        <h1 class="text-white font-bold text-lg hidden sm:block">Movie Collection</h1>
        <h1 class="text-white font-bold text-lg sm:hidden">Movies</h1>
      </router-link>

      <nav class="hidden md:flex items-center gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
          active-class="bg-white/20 text-white"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
          <span v-if="item.badge" class="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
            {{ item.badge }}
          </span>
        </router-link>

        <button
          class="flex items-center justify-center w-9 h-9 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors ml-1"
          :title="ui.isDark ? 'Modo claro' : 'Modo oscuro'"
          @click="ui.toggleTheme()"
        >
          <i :class="ui.isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
      </nav>

      <button
        class="md:hidden absolute right-4 top-1/2 -translate-y-1/2 text-white text-xl p-2 hover:bg-white/10 rounded-lg transition-colors"
        @click="ui.openDrawer()"
        aria-label="Menu"
      >
        <i class="fas fa-bars"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useWishlistStore } from '@/stores/wishlist'
import { useFavoritesStore } from '@/stores/favorites'
import { useWatchedStore } from '@/stores/watched'

const ui = useUiStore()
const wishlist = useWishlistStore()
const favorites = useFavoritesStore()
const watched = useWatchedStore()

const navItems = computed(() => [
  { to: '/', icon: 'fas fa-home', label: 'Inicio' },
  { to: '/lista', icon: 'fas fa-list', label: 'Lista' },
  { to: '/favoritos', icon: 'fas fa-heart', label: 'Favoritos', badge: favorites.count || null },
  { to: '/deseadas', icon: 'fas fa-bookmark', label: 'Deseadas', badge: wishlist.count || null },
  { to: '/vistas', icon: 'fas fa-eye', label: 'Vistas', badge: watched.count || null },
  { to: '/estadisticas', icon: 'fas fa-chart-bar', label: 'Estadisticas' },
  { to: '/configuracion', icon: 'fas fa-cog', label: 'Configuracion' }
])
</script>