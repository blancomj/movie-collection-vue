import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFavoriteMovies as apiGetFavorites, toggleFavorite as apiToggleFavorite } from '@/api/movies'

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref(new Set())
  const favoriteMovies = ref([])
  const loading = ref(false)

  const count = computed(() => favoriteIds.value.size)

  function isFavorite(tmdbId) {
    return favoriteIds.value.has(tmdbId)
  }

  async function load() {
    loading.value = true
    try {
      const data = await apiGetFavorites()
      const movies = data.movies || []
      favoriteMovies.value = movies
      favoriteIds.value = new Set(movies.map(m => m.tmdb_id))
    } catch (e) {
      console.error('Failed to load favorites:', e)
    } finally {
      loading.value = false
    }
  }

  async function toggle(tmdbId) {
    try {
      const data = await apiToggleFavorite(tmdbId)
      if (data.favorite) {
        favoriteIds.value.add(tmdbId)
      } else {
        favoriteIds.value.delete(tmdbId)
      }
      return data.favorite
    } catch (e) {
      console.error('Failed to toggle favorite:', e)
      throw e
    }
  }

  return { favoriteIds, favoriteMovies, loading, count, isFavorite, load, toggle }
})
