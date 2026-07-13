import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getWantedMovies as apiGetWanted, toggleWanted as apiToggleWanted } from '@/api/movies'

export const useWishlistStore = defineStore('wishlist', () => {
  const wantedIds = ref(new Set())
  const wantedMovies = ref([])
  const loading = ref(false)

  const count = computed(() => wantedIds.value.size)

  function isWanted(tmdbId) {
    return wantedIds.value.has(tmdbId)
  }

  async function load() {
    loading.value = true
    try {
      const data = await apiGetWanted()
      const movies = data.movies || []
      wantedMovies.value = movies
      wantedIds.value = new Set(movies.map(m => m.tmdb_id))
    } catch (e) {
      console.error('Failed to load wishlist:', e)
    } finally {
      loading.value = false
    }
  }

  async function toggle(tmdbId) {
    try {
      const data = await apiToggleWanted(tmdbId)
      if (data.wanted) {
        wantedIds.value.add(tmdbId)
      } else {
        wantedIds.value.delete(tmdbId)
      }
      return data.wanted
    } catch (e) {
      console.error('Failed to toggle wanted:', e)
      throw e
    }
  }

  return { wantedIds, wantedMovies, loading, count, isWanted, load, toggle }
})