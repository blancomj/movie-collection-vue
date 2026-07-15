<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
      <i class="fas fa-heart text-red-500 mr-2"></i>Mis Favoritos
    </h1>

    <LoadingSpinner v-if="favorites.loading" message="Cargando favoritos..." />

    <div v-else-if="favorites.favoriteMovies.length === 0" class="text-center py-20 text-gray-500">
      <i class="fas fa-heart-broken text-5xl mb-4 block text-gray-300"></i>
      <p>No tienes peliculas favoritas aun.</p>
    </div>

    <MovieGrid v-else :movies="favorites.favoriteMovies" :grid-cols="ui.gridCols" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useUiStore } from '@/stores/ui'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import MovieGrid from '@/components/movie/MovieGrid.vue'

const favorites = useFavoritesStore()
const ui = useUiStore()

onMounted(async () => {
  await favorites.load()
})
</script>
