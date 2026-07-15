<template>
  <div>
    <div v-if="movies.length === 0" class="text-center py-16 text-gray-400 dark:text-gray-500">
      <i class="fas fa-film text-5xl mb-4 block text-gray-300 dark:text-gray-600"></i>
      <p>No se encontraron peliculas</p>
    </div>

    <!-- Desktop/Tablet: Table -->
    <div v-else class="hidden sm:block overflow-x-auto">
      <table class="w-full text-sm text-left">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
            <th class="py-3 px-2 w-10">#</th>
            <th class="py-3 px-2 w-16"></th>
            <th class="py-3 px-2">Nombre</th>
            <th class="py-3 px-2 w-16">Ano</th>
            <th class="py-3 px-2 w-20">Puntaje</th>
            <th class="py-3 px-2">Generos</th>
            <th class="py-3 px-2 w-24">Duracion</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(movie, index) in movies"
            :key="movie.tmdb_id"
            class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
            @click="$router.push({ name: 'movie', params: { id: movie.tmdb_id } })"
          >
            <td class="py-3 px-2 text-gray-400 dark:text-gray-500">{{ startIndex + index + 1 }}</td>
            <td class="py-3 px-2">
              <img
                v-if="getPoster(movie)"
                :src="getPoster(movie, 'w92')"
                :alt="movie.title"
                class="w-10 h-14 object-cover rounded shadow-sm"
              />
              <div v-else class="w-10 h-14 bg-gradient-to-br from-primary to-purple-700 rounded flex items-center justify-center">
                <i class="fas fa-film text-white text-xs"></i>
              </div>
            </td>
            <td class="py-3 px-2">
              <div class="font-medium text-gray-800 dark:text-gray-200">{{ movie.title }}</div>
              <div v-if="movie.original_title !== movie.title" class="text-xs text-gray-400 dark:text-gray-500">{{ movie.original_title }}</div>
            </td>
            <td class="py-3 px-2 text-gray-600 dark:text-gray-400">{{ movie.year || '-' }}</td>
            <td class="py-3 px-2">
              <span v-if="movie.vote_average" class="inline-flex items-center gap-0.5 text-yellow-600 dark:text-yellow-400">
                <i class="fas fa-star text-xs"></i>
                {{ movie.vote_average.toFixed(1) }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="py-3 px-2">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="g in parseGenres(movie.genres).slice(0, 3)"
                  :key="g.id || g"
                  class="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                >
                  {{ g.name || g }}
                </span>
              </div>
            </td>
            <td class="py-3 px-2 text-gray-500 dark:text-gray-400">
              {{ movie.runtime ? movie.runtime + 'min' : '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile: Compact list -->
    <div v-if="movies.length > 0" class="sm:hidden space-y-2">
      <div
        v-for="(movie, index) in movies"
        :key="movie.tmdb_id"
        class="flex items-center gap-3 p-2 bg-white dark:bg-[#1e1e2f] rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        @click="$router.push({ name: 'movie', params: { id: movie.tmdb_id } })"
      >
        <img
          v-if="getPoster(movie)"
          :src="getPoster(movie, 'w92')"
          :alt="movie.title"
          class="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
        />
        <div v-else class="w-10 h-14 bg-gradient-to-br from-primary to-purple-700 rounded flex items-center justify-center flex-shrink-0">
          <i class="fas fa-film text-white text-xs"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{{ movie.title }}</div>
          <div class="text-xs text-gray-400 dark:text-gray-500">{{ movie.year || '-' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePoster } from '@/composables/usePoster'

defineProps({
  movies: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 }
})

const { getPoster } = usePoster()

function parseGenres(genres) {
  if (!genres) return []
  if (Array.isArray(genres)) return genres
  if (typeof genres === 'string') {
    try { return JSON.parse(genres) } catch { return [] }
  }
  return []
}
</script>
