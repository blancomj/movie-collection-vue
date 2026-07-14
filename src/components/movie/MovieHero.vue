<template>
  <div class="mb-6">
    <div v-if="backdrop" class="relative rounded-card overflow-hidden shadow-lg">
      <div
        class="h-64 md:h-96 bg-cover bg-center"
        :style="{ backgroundImage: `url(${backdrop})` }"
      >
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="flex items-end gap-4">
          <div class="w-32 md:w-40 flex-shrink-0">
            <img v-if="poster" :src="poster" :alt="movie.title" class="w-full rounded-card shadow-lg" />
          </div>
          <div class="flex-1 min-w-0 text-white">
            <h1 class="text-2xl md:text-3xl font-bold">{{ movie.title }}</h1>
            <p v-if="movie.original_title !== movie.title" class="text-sm opacity-75 mt-0.5">{{ movie.original_title }}</p>
            <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/80">
              <span v-if="movie.year"><i class="fas fa-calendar-alt mr-1"></i>{{ movie.year }}</span>
              <span v-if="movie.vote_average"><i class="fas fa-star text-yellow-400 mr-1"></i>{{ movie.vote_average.toFixed(1) }}</span>
              <span v-if="movie.runtime"><i class="fas fa-clock mr-1"></i>{{ movie.runtime }} min</span>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span v-for="g in genresList" :key="g.id" class="px-2 py-0.5 text-xs font-medium rounded-full bg-white/20 text-white">{{ g.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6">
      <div class="flex items-end gap-4">
        <div class="w-32 md:w-40 flex-shrink-0">
          <img v-if="poster" :src="poster" :alt="movie.title" class="w-full rounded-card shadow-lg" />
          <div v-else class="aspect-[2/3] rounded-card bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center">
            <i class="fas fa-film text-white text-3xl"></i>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">{{ movie.title }}</h1>
          <p v-if="movie.original_title !== movie.title" class="text-sm text-gray-400 mt-0.5">{{ movie.original_title }}</p>
          <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span v-if="movie.year"><i class="fas fa-calendar-alt mr-1"></i>{{ movie.year }}</span>
            <span v-if="movie.vote_average"><i class="fas fa-star text-yellow-400 mr-1"></i>{{ movie.vote_average.toFixed(1) }}</span>
            <span v-if="movie.runtime"><i class="fas fa-clock mr-1"></i>{{ movie.runtime }} min</span>
          </div>
          <div class="flex flex-wrap gap-1.5 mt-3">
            <span v-for="g in genresList" :key="g.id" class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">{{ g.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: { type: Object, required: true },
  poster: { type: String, default: null },
  backdrop: { type: String, default: null }
})

const genresList = computed(() => {
  const g = props.movie.genres
  if (!g) return []
  if (Array.isArray(g)) return g
  if (typeof g === 'string') {
    try { return JSON.parse(g) } catch { return [] }
  }
  return []
})
</script>