<template>
  <button
    class="inline-flex items-center justify-center rounded-full transition-all"
    :class="[isWatched ? 'bg-red-500 text-white shadow-md' : 'bg-black/60 text-white hover:bg-red-500/80', classSize]"
    @click.stop="handleToggle"
    :title="isWatched ? 'Marcar como no vista' : 'Marcar como vista'"
  >
    <i class="fas fa-bookmark"></i>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useWatchedStore } from '@/stores/watched'
import { useNotifications } from '@/composables/useNotifications'
import { saveMovie } from '@/api/movies'

const props = defineProps({
  tmdbId: { type: Number, required: true },
  movie: { type: Object, default: null },
  isLocal: { type: Boolean, default: false },
  size: { type: String, default: 'md' }
})

const emit = defineEmits(['saved'])

const watched = useWatchedStore()
const { success } = useNotifications()

const isWatched = computed(() => watched.isWatched(props.tmdbId))

const classSize = computed(() => {
  if (props.size === 'sm') return 'w-8 h-8 text-xs'
  return 'w-10 h-10 text-sm'
})

async function handleToggle() {
  try {
    if (!props.isLocal && props.movie) {
      await saveMovie({
        tmdb_id: props.movie.tmdb_id,
        title: props.movie.title,
        original_title: props.movie.original_title,
        year: props.movie.year,
        overview: props.movie.overview,
        poster_path: props.movie.poster_path,
        backdrop_path: props.movie.backdrop_path,
        vote_average: props.movie.vote_average,
        vote_count: props.movie.vote_count,
        genres: props.movie.genres || [],
        runtime: props.movie.runtime || 0,
        release_date: props.movie.release_date
      })
      emit('saved')
    }
    const newState = await watched.toggle(props.tmdbId)
    success(newState ? 'Marcada como vista' : 'Marcada como no vista')
  } catch (e) {
    console.error(e)
  }
}
</script>
