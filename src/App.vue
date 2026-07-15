<template>
  <AppHeader @open-drawer="ui.openDrawer()" />
  <main class="min-h-screen pt-16 pb-20">
    <router-view />
  </main>
  <BottomNav />
  <AppDrawer :open="ui.drawerOpen" @update:open="ui.drawerOpen = $event" />

  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="fixed top-20 right-4 z-[100] space-y-2">
      <div
        v-for="n in ui.notifications"
        :key="n.id"
        class="px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium max-w-sm"
        :class="{
          'bg-green-500': n.type === 'success',
          'bg-red-500': n.type === 'error',
          'bg-blue-500': n.type === 'info'
        }"
      >
        {{ n.message }}
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import AppDrawer from '@/components/layout/AppDrawer.vue'
import { useUiStore } from '@/stores/ui'
import { useWishlistStore } from '@/stores/wishlist'
import { useWatchedStore } from '@/stores/watched'
import { useFavoritesStore } from '@/stores/favorites'

const ui = useUiStore()
const wishlist = useWishlistStore()
const watched = useWatchedStore()
const favorites = useFavoritesStore()

onMounted(() => {
  ui.initTheme()
  wishlist.load()
  watched.load()
  favorites.load()
})
</script>

<style>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100px); }
.toast-leave-to { opacity: 0; transform: translateX(100px); }
</style>