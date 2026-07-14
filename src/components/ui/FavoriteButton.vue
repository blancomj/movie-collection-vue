<template>
  <button
    class="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10"
    :class="isFav
      ? 'bg-red-500/90 text-white shadow-md'
      : 'bg-black/60 text-white hover:bg-black/80'"
    :title="isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    @click.stop="handleToggle"
  >
    <i :class="isFav ? 'fas fa-heart' : 'far fa-heart'" class="text-sm"></i>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  tmdbId: { type: Number, required: true }
})

const favorites = useFavoritesStore()
const { success } = useNotifications()

const isFav = computed(() => favorites.isFavorite(props.tmdbId))

function handleToggle() {
  const newState = favorites.toggle(props.tmdbId)
  success(newState ? 'Agregada a favoritos' : 'Removida de favoritos')
}
</script>
