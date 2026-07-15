import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getWatchedMovies as apiGetWatched, toggleWatched as apiToggleWatched } from '@/api/movies'

export const useWatchedStore = defineStore('watched', () => {
  const watchedIds = ref(new Set())
  const watchedMovies = ref([])
  const loading = ref(false)

  const count = computed(() => watchedIds.value.size)

  function isWatched(tmdbId) {
    return watchedIds.value.has(tmdbId)
  }

  async function load() {
    loading.value = true
    try {
      const data = await apiGetWatched()
      const movies = data.movies || []
      watchedMovies.value = movies
      watchedIds.value = new Set(movies.map(m => m.tmdb_id))
    } catch (e) {
      console.error('Failed to load watched movies:', e)
    } finally {
      loading.value = false
    }
  }

  async function toggle(tmdbId) {
    try {
      const data = await apiToggleWatched(tmdbId)
      if (data.watched) {
        watchedIds.value.add(tmdbId)
      } else {
        watchedIds.value.delete(tmdbId)
      }
      return data.watched
    } catch (e) {
      console.error('Failed to toggle watched:', e)
      throw e
    }
  }

  return { watchedIds, watchedMovies, loading, count, isWatched, load, toggle }
})
