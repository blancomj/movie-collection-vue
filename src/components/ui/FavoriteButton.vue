<template>
  <button
    class="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10"
    :class="isFav
      ? 'bg-red-500/90 text-white shadow-md'
      : 'bg-black/60 text-white hover:bg-black/80'"
    :title="isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'"
    @click.stop="handleToggle"
  >
    <i :class="isFav ? 'fas fa-heart' : 'far fa-heart'" class="text-sm"></i>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useNotifications } from '@/composables/useNotifications'
import { saveMovie } from '@/api/movies'

const props = defineProps({
  tmdbId: { type: Number, required: true },
  movie: { type: Object, default: null },
  isLocal: { type: Boolean, default: false }
})

const emit = defineEmits(['saved'])

const favorites = useFavoritesStore()
const { success } = useNotifications()

const isFav = computed(() => favorites.isFavorite(props.tmdbId))

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
    const newState = await favorites.toggle(props.tmdbId)
    success(newState ? 'Agregada a favoritos' : 'Removida de favoritos')
  } catch (e) {
    console.error(e)
  }
}
</script>
