<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="bg-white rounded-card shadow-sm p-6 mb-6">
      <SearchBar v-model="moviesStore.search" @search="onSearch" />

      <FilterControls
        :genre="moviesStore.genre"
        :year="moviesStore.year"
        :sort="moviesStore.sort"
        :min-rating="moviesStore.minRating"
        :decade="moviesStore.decade"
        :genres="moviesStore.allGenres"
        :years="moviesStore.uniqueYears"
        :decades="moviesStore.decades"
        @update:genre="moviesStore.genre = $event"
        @update:year="moviesStore.year = $event"
        @update:sort="moviesStore.sort = $event"
        @update:min-rating="moviesStore.minRating = $event"
        @update:decade="moviesStore.decade = $event"
        @clear="moviesStore.clearFilters()"
      />
    </div>

    <LoadingSpinner v-if="moviesStore.loading" message="Cargando peliculas..." />

    <div v-else-if="moviesStore.error" class="text-center py-20 text-red-500">
      <i class="fas fa-exclamation-triangle text-4xl mb-3"></i>
      <p>{{ moviesStore.error }}</p>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-800">Mi coleccion</h2>
        <span class="text-sm text-gray-500">{{ moviesStore.filteredMovies.length }} peliculas</span>
      </div>

      <MovieGrid :movies="paginatedMovies" :grid-cols="ui.gridCols" />

      <Pagination
        :current-page="currentPage"
        :total="moviesStore.filteredMovies.length"
        :per-page="perPage"
        @update:current-page="currentPage = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useUiStore } from '@/stores/ui'
import SearchBar from '@/components/ui/SearchBar.vue'
import FilterControls from '@/components/ui/FilterControls.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import Pagination from '@/components/ui/Pagination.vue'
import MovieGrid from '@/components/movie/MovieGrid.vue'

const moviesStore = useMoviesStore()
const ui = useUiStore()

const currentPage = ref(1)
const perPage = ref(20)

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return moviesStore.filteredMovies.slice(start, start + perPage.value)
})

function onSearch() {
  currentPage.value = 1
}

watch(
  () => [moviesStore.genre, moviesStore.year, moviesStore.sort, moviesStore.minRating, moviesStore.decade],
  () => { currentPage.value = 1 }
)

onMounted(() => {
  moviesStore.loadMovies()
})
</script>