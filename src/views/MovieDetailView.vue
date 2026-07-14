<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <LoadingSpinner v-if="moviesStore.loading" message="Cargando detalles..." />

    <div v-else-if="moviesStore.error" class="text-center py-20">
      <i class="fas fa-exclamation-triangle text-4xl mb-3 text-yellow-400"></i>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ moviesStore.error }}</p>
      <button @click="$router.push('/')" class="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors">
        <i class="fas fa-home mr-2"></i>Volver al inicio
      </button>
    </div>

    <div v-else-if="movie">
      <MovieHero :movie="movie" :poster="poster" :backdrop="backdrop" />

      <div class="flex flex-wrap gap-3 mb-6">
        <button
          v-if="!isLocalMovie"
          class="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors"
          :class="isWished
            ? 'bg-primary text-white shadow-md'
            : 'bg-white dark:bg-[#2a2a3d] border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary'"
          @click="toggleWish"
        >
          <i class="fas fa-bookmark"></i>
          {{ isWished ? 'Quitar de Deseadas' : 'Marcar como Deseada' }}
        </button>

        <button
          v-if="trailerKey"
          class="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          @click="showTrailer = true"
        >
          <i class="fas fa-play"></i> Ver Trailer
        </button>
      </div>

      <div v-if="movie.overview" class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">Sinopsis</h2>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ movie.overview }}</p>
      </div>

      <div v-if="castList.length" class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6 mb-6">
        <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
          <i class="fas fa-users text-primary mr-2"></i>Reparto
        </h2>
        <CastGrid :cast="castList" />
      </div>

      <SimilarMovies :tmdb-id="movie.tmdb_id" />

      <BackdropGallery :tmdb-id="movie.tmdb_id" />

      <TrailerModal
        :visible="showTrailer"
        :video-key="trailerKey"
        :video-title="trailerTitle"
        @close="showTrailer = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
import { useWishlistStore } from '@/stores/wishlist'
import { usePoster } from '@/composables/usePoster'
import { useNotifications } from '@/composables/useNotifications'
import { getMovieVideos, getTmdbMovie, saveMovie } from '@/api/movies'
import MovieHero from '@/components/movie/MovieHero.vue'
import CastGrid from '@/components/movie/CastGrid.vue'
import SimilarMovies from '@/components/movie/SimilarMovies.vue'
import BackdropGallery from '@/components/movie/BackdropGallery.vue'
import TrailerModal from '@/components/movie/TrailerModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const moviesStore = useMoviesStore()
const wishlist = useWishlistStore()
const { getPoster, getBackdrop } = usePoster()
const { success } = useNotifications()

const isLocalMovie = ref(false)
const tmdbMovie = ref(null)

const movie = computed(() => moviesStore.currentMovie || tmdbMovie.value)
const poster = computed(() => movie.value ? getPoster(movie.value) : null)
const backdrop = computed(() => movie.value ? getBackdrop(movie.value) : null)

const isWished = computed(() => movie.value && wishlist.isWanted(movie.value.tmdb_id))

const castList = computed(() => {
  if (!movie.value) return []
  const c = movie.value.cast
  if (!c) return []
  if (Array.isArray(c)) return c
  if (typeof c === 'string') {
    try { return JSON.parse(c) } catch { return [] }
  }
  return []
})

const showTrailer = ref(false)
const trailerKey = ref('')
const trailerTitle = ref('')

async function toggleWish() {
  if (!movie.value) return
  try {
    if (!isLocalMovie.value) {
      await saveMovie({
        tmdb_id: movie.value.tmdb_id,
        title: movie.value.title,
        original_title: movie.value.original_title,
        year: movie.value.year,
        overview: movie.value.overview,
        poster_path: movie.value.poster_path,
        backdrop_path: movie.value.backdrop_path,
        vote_average: movie.value.vote_average,
        vote_count: movie.value.vote_count,
        genres: movie.value.genres || [],
        runtime: movie.value.runtime || 0,
        release_date: movie.value.release_date
      })
      isLocalMovie.value = true
    }
    const isNowWanted = await wishlist.toggle(movie.value.tmdb_id)
    success(isNowWanted ? 'Agregado a deseadas' : 'Eliminado de deseadas')
  } catch (e) {
    console.error(e)
  }
}

async function loadTrailer() {
  if (!movie.value) return
  try {
    const data = await getMovieVideos(movie.value.tmdb_id)
    const videos = data.results || []
    let trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.iso_639_1 === 'es')
    if (!trailer) trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube')
    if (!trailer) trailer = videos.find(v => (v.type === 'Teaser' || v.type === 'Clip') && v.site === 'YouTube')
    if (!trailer) trailer = videos.find(v => v.site === 'YouTube')
    if (trailer) {
      trailerKey.value = trailer.key
      trailerTitle.value = trailer.name || movie.value.title
    }
  } catch (e) {
    console.error('Failed to load trailer:', e)
  }
}

onMounted(async () => {
  const id = parseInt(route.params.id)

  moviesStore.error = null
  const localMovie = await moviesStore.loadMovie(id)
  if (localMovie) {
    isLocalMovie.value = true
  } else {
    moviesStore.error = null
    moviesStore.loading = true
    try {
      const data = await getTmdbMovie(id)
      tmdbMovie.value = data.movie || null
    } catch (e) {
      moviesStore.error = 'No se pudo cargar la información de la película.'
      console.error('Failed to load from TMDB:', e)
    } finally {
      moviesStore.loading = false
    }
  }

  await wishlist.load()
  loadTrailer()
})
</script>
