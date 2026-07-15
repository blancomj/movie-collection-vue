<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/60"
        @click="$emit('update:open', false)"
      ></div>
    </Transition>

    <Transition name="slide-right">
      <div
        v-if="open"
        class="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white dark:bg-[#1e1e2f] shadow-drawer flex flex-col"
      >
        <div class="bg-gradient-to-r from-primary to-purple-700 p-5 flex items-center gap-3">
          <i class="fas fa-film text-white text-xl"></i>
          <h2 class="text-white font-bold text-lg">Movie Collection</h2>
        </div>

        <nav class="flex-1 overflow-y-auto py-2">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
            active-class="bg-primary/10 text-primary font-medium"
            @click="$emit('update:open', false)"
          >
            <i :class="item.icon" class="w-5"></i>
            {{ item.label }}
            <span v-if="item.badge" class="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {{ item.badge }}
            </span>
          </router-link>

          <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          <div class="px-5 py-2">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vista</span>
          </div>
          <div class="px-5 py-2 flex gap-2">
            <button
              class="flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors"
              :class="gridCols === 2
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary'"
              @click="setGridCols(2)"
            >
              <i class="fas fa-th"></i> 2 cols
            </button>
            <button
              class="flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-colors"
              :class="gridCols === 1
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary'"
              @click="setGridCols(1)"
            >
              <i class="fas fa-list"></i> 1 col
            </button>
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          <router-link
            to="/configuracion"
            class="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors"
            active-class="bg-primary/10 text-primary font-medium"
            @click="$emit('update:open', false)"
          >
            <i class="fas fa-cog w-5"></i>
            Configuracion
          </router-link>

          <button
            class="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors w-full text-left"
            @click="ui.toggleTheme(); $emit('update:open', false)"
          >
            <i :class="ui.isDark ? 'fas fa-sun' : 'fas fa-moon'" class="w-5"></i>
            {{ ui.isDark ? 'Modo claro' : 'Modo oscuro' }}
          </button>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useFavoritesStore } from '@/stores/favorites'
import { useWatchedStore } from '@/stores/watched'

defineProps({
  open: Boolean
})
defineEmits(['update:open'])

const ui = useUiStore()
const favorites = useFavoritesStore()
const watched = useWatchedStore()

const gridCols = computed(() => ui.gridCols)

function setGridCols(cols) {
  ui.setGridCols(cols)
}

const navItems = computed(() => [
  { to: '/', icon: 'fas fa-home', label: 'Inicio' },
  { to: '/favoritos', icon: 'fas fa-heart', label: 'Favoritos', badge: favorites.count || null },
  { to: '/deseadas', icon: 'fas fa-bookmark', label: 'Deseadas' },
  { to: '/vistas', icon: 'fas fa-eye', label: 'Vistas', badge: watched.count || null },
  { to: '/estadisticas', icon: 'fas fa-chart-bar', label: 'Estadisticas' }
])
</script>

<style scoped>
.slide-right-enter-active {
  transition: transform 0.3s ease;
}
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>