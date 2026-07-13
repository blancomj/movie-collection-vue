<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
      <i class="fas fa-bookmark text-primary mr-2"></i>Peliculas Deseadas
    </h1>

    <div v-if="wishlist.loading" class="text-center py-20">
      <div class="inline-block w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-3 text-gray-500">Cargando...</p>
    </div>

    <div v-else-if="wishlist.wantedMovies.length === 0" class="text-center py-20 text-gray-500">
      <i class="fas fa-bookmark text-5xl mb-4 block text-gray-300"></i>
      <p>No tienes peliculas deseadas aun.</p>
    </div>

    <MovieGrid v-else :movies="wishlist.wantedMovies" :grid-cols="ui.gridCols" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useUiStore } from '@/stores/ui'
import MovieGrid from '@/components/movie/MovieGrid.vue'

const wishlist = useWishlistStore()
const ui = useUiStore()

onMounted(() => {
  wishlist.load()
})
</script>