import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'movie-collection-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref(new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')))

  const count = computed(() => favoriteIds.value.size)

  function isFavorite(tmdbId) {
    return favoriteIds.value.has(tmdbId)
  }

  function toggle(tmdbId) {
    if (favoriteIds.value.has(tmdbId)) {
      favoriteIds.value.delete(tmdbId)
    } else {
      favoriteIds.value.add(tmdbId)
    }
    save()
    return favoriteIds.value.has(tmdbId)
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoriteIds.value]))
  }

  return { favoriteIds, count, isFavorite, toggle }
})
