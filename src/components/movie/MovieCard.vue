<template>
  <div
    class="bg-white dark:bg-[#1e1e2f] rounded-card overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-300 cursor-pointer hover:-translate-y-2"
    @click="router.push({ name: 'movie', params: { id: movie.tmdb_id } })"
  >
    <div class="aspect-[2/3] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
      <img
        v-if="poster"
        :src="poster"
        :alt="movie.title"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-700">
        <i class="fas fa-film text-white text-3xl"></i>
      </div>

      <FavoriteButton :tmdb-id="movie.tmdb_id" />

      <div v-if="movie.vote_average" class="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold">
        <i class="fas fa-star text-yellow-400 mr-0.5"></i>
        {{ movie.vote_average.toFixed(1) }}
      </div>

      <div v-if="movie.year" class="absolute top-2 left-10 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-bold">
        {{ movie.year }}
      </div>

      <div class="absolute bottom-2 right-2 z-10">
        <ActionButton :tmdb-id="movie.tmdb_id" size="sm" />
      </div>

      <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <p class="text-white text-xs leading-relaxed line-clamp-3" style="text-shadow: 0 1px 3px rgba(0,0,0,0.8);">
          {{ movie.overview || 'Sin sinopsis disponible.' }}
        </p>
        <span class="text-primary text-[10px] font-semibold mt-1.5 flex items-center gap-1">
          <i class="fas fa-eye"></i> Ver detalles
        </span>
      </div>
    </div>

    <div class="p-3">
      <h3 class="font-bold text-base text-gray-800 dark:text-gray-200 line-clamp-1">{{ movie.title }}</h3>
      <p v-if="movie.original_title !== movie.title" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ movie.original_title }}</p>
      <div class="flex flex-wrap gap-1 mt-1.5">
        <span
          v-for="g in (movie.genres || []).slice(0, 2)"
          :key="g.id"
          class="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        >
          {{ g.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePoster } from '@/composables/usePoster'
import ActionButton from '../ui/ActionButton.vue'
import FavoriteButton from '../ui/FavoriteButton.vue'

const props = defineProps({
  movie: { type: Object, required: true }
})

const router = useRouter()
const { getPoster } = usePoster()
const poster = computed(() => getPoster(props.movie))
</script>