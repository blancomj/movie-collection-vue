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

      <div v-if="movie.vote_average" class="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold">
        <i class="fas fa-star text-yellow-400 mr-0.5"></i>
        {{ movie.vote_average.toFixed(1) }}
      </div>

      <div v-if="movie.year" class="absolute top-2 left-2 bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-bold">
        {{ movie.year }}
      </div>

      <div class="absolute bottom-2 right-2">
        <ActionButton :tmdb-id="movie.tmdb_id" size="sm" />
      </div>

      <div class="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <span class="px-4 py-2 bg-primary text-white rounded-full font-medium text-sm flex items-center gap-2">
          <i class="fas fa-eye"></i> Ver detalles
        </span>
      </div>
    </div>

    <div class="p-3">
      <h3 class="font-bold text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{{ movie.title }}</h3>
      <p v-if="movie.original_title !== movie.title" class="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">{{ movie.original_title }}</p>
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

const props = defineProps({
  movie: { type: Object, required: true }
})

const router = useRouter()
const { getPoster } = usePoster()
const poster = computed(() => getPoster(props.movie))
</script>