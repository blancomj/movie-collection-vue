<template>
  <div class="detail-page">
    <LoadingSpinner v-if="moviesStore.loading" message="Cargando detalles..." />

    <div v-else-if="moviesStore.error" class="empty-state">
      <div class="empty-state-icon" style="color:#dc3545;"><i class="fas fa-exclamation-triangle"></i></div>
      <h3 class="empty-state-title">Error</h3>
      <p class="empty-state-text">{{ moviesStore.error }}</p>
      <button @click="$router.push('/')" class="btn btn-primary"><i class="fas fa-home mr-2"></i>Volver al Inicio</button>
    </div>

    <div v-else-if="movie">
      <MovieHero :movie="movie" :poster="poster" :backdrop="backdrop" />

      <div class="details-body">
        <div class="detail-section mobile-trailer-row">
          <button
            v-if="trailerKey"
            class="btn btn-primary"
            @click="showTrailer = true"
          >
            <i class="fas fa-play"></i> Ver Trailer
          </button>
          <button
            v-if="!isLocalMovie"
            class="btn btn-secondary"
            :class="{ 'active-wish': isWished }"
            @click="toggleWish"
          >
            <i class="fas fa-bookmark"></i>
            {{ isWished ? 'Quitar de Deseadas' : 'Agregar a Deseadas' }}
          </button>
          <WatchedButton
            v-if="!isWished"
            :tmdb-id="movie?.tmdb_id"
          />
        </div>

        <section class="detail-section">
          <h2><i class="fas fa-align-left"></i> Sinopsis</h2>
          <p>{{ movie.overview || 'Sin descripcion disponible.' }}</p>
        </section>

        <section class="detail-section">
          <div class="info-grid">
            <div class="info-card">
              <div class="info-icon"><i class="fas fa-calendar"></i></div>
              <div class="info-label">Fecha de Lanzamiento</div>
              <div class="info-value">{{ formatDate(movie.release_date) }}</div>
            </div>
            <div class="info-card">
              <div class="info-icon"><i class="fas fa-clock"></i></div>
              <div class="info-label">Duracion</div>
              <div class="info-value">{{ formatRuntime(movie.runtime) }}</div>
            </div>
            <div class="info-card">
              <div class="info-icon"><i class="fas fa-star"></i></div>
              <div class="info-label">Calificacion</div>
              <div class="info-value">{{ (movie.vote_average || 0).toFixed(1) }}/10</div>
            </div>
            <div class="info-card">
              <div class="info-icon"><i class="fas fa-vote-yea"></i></div>
              <div class="info-label">Votos</div>
              <div class="info-value">{{ (movie.vote_count || 0).toLocaleString() }}</div>
            </div>
          </div>
        </section>

        <section v-if="castList.length" class="detail-section">
          <h2><i class="fas fa-users"></i> Elenco Principal</h2>
          <CastGrid :cast="castList" />
        </section>

        <section v-if="backdrops.length" class="detail-section">
          <h2><i class="fas fa-images"></i> Galeria</h2>
          <div class="backdrop-gallery">
            <div v-for="(bd, i) in backdrops" :key="i" class="backdrop-item">
              <img :src="`https://image.tmdb.org/t/p/w780${bd.file_path}`" :alt="`Fotograma ${i + 1}`" loading="lazy" />
            </div>
          </div>
        </section>

        <section v-if="similar.length" class="detail-section">
          <h2><i class="fas fa-film"></i> Peliculas Similares</h2>
          <div class="similar-grid">
            <div
              v-for="m in similar"
              :key="m.id"
              class="similar-card"
              @click="goToMovie(m.id)"
            >
              <img
                v-if="m.poster_path"
                :src="`https://image.tmdb.org/t/p/w300${m.poster_path}`"
                :alt="m.title"
                class="similar-poster"
                loading="lazy"
              />
              <div v-else class="similar-poster-placeholder">
                <i class="fas fa-film"></i>
              </div>
              <div class="similar-info">
                <div class="similar-title">{{ m.title }}</div>
                <div class="similar-rating"><i class="fas fa-star"></i> {{ (m.vote_average || 0).toFixed(1) }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>

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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
import { useWishlistStore } from '@/stores/wishlist'
import { useFavoritesStore } from '@/stores/favorites'
import { useWatchedStore } from '@/stores/watched'
import { usePoster } from '@/composables/usePoster'
import { useNotifications } from '@/composables/useNotifications'
import { getMovieVideos, getTmdbMovie, getSimilarMovies, saveMovie } from '@/api/movies'
import client from '@/api/client'
import MovieHero from '@/components/movie/MovieHero.vue'
import CastGrid from '@/components/movie/CastGrid.vue'
import TrailerModal from '@/components/movie/TrailerModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import WatchedButton from '@/components/ui/WatchedButton.vue'

const route = useRoute()
const router = useRouter()
const moviesStore = useMoviesStore()
const wishlist = useWishlistStore()
const favorites = useFavoritesStore()
const watched = useWatchedStore()
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
const backdrops = ref([])
const similar = ref([])

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

function goToMovie(tmdbId) {
  router.push({ name: 'movie', params: { id: tmdbId } })
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

async function loadGallery() {
  if (!movie.value) return
  try {
    const data = await client.get(`/movies/tmdb/${movie.value.tmdb_id}/images`)
    backdrops.value = (data.backdrops || []).slice(0, 6)
  } catch (e) {
    console.error('Failed to load gallery:', e)
  }
}

async function loadSimilar() {
  if (!movie.value) return
  try {
    const data = await getSimilarMovies(movie.value.tmdb_id)
    similar.value = (data.results || []).slice(0, 6)
  } catch (e) {
    console.error('Failed to load similar:', e)
  }
}

function formatRuntime(minutes) {
  if (!minutes) return 'N/A'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}min` : `${m}min`
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

function loadMovieData(id) {
  moviesStore.error = null
  moviesStore.currentMovie = null
  tmdbMovie.value = null
  isLocalMovie.value = false
  backdrops.value = []
  similar.value = []
  trailerKey.value = ''
  trailerTitle.value = ''

  moviesStore.loadMovie(id).then(localMovie => {
    if (localMovie) {
      isLocalMovie.value = true
    } else {
      moviesStore.error = null
      moviesStore.loading = true
      getTmdbMovie(id).then(data => {
        tmdbMovie.value = data.movie || null
      }).catch(e => {
        moviesStore.error = 'No se pudo cargar la informacion de la pelicula.'
        console.error('Failed to load from TMDB:', e)
      }).finally(() => {
        moviesStore.loading = false
      })
    }

    wishlist.load().then(() => {
      watched.load().then(() => {
        loadTrailer()
        loadGallery()
        loadSimilar()
      })
    })
  })
}

onMounted(() => {
  loadMovieData(parseInt(route.params.id))
})

watch(() => route.params.id, (newId) => {
  if (newId) loadMovieData(parseInt(newId))
})
</script>

<style scoped>
.detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.details-body {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h2 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-section h2 i {
  color: #667eea;
}

.detail-section > p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.mobile-trailer-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-card {
  background: var(--bg-card);
  padding: 1.25rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-icon {
  font-size: 1.5rem;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.info-label {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Backdrop Gallery */
.backdrop-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.backdrop-item {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  aspect-ratio: 16/9;
}

.backdrop-item:hover {
  transform: scale(1.02);
}

.backdrop-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Similar Movies Grid */
.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.similar-card {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.similar-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.similar-poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.similar-poster-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.similar-info {
  padding: 0.5rem;
}

.similar-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.similar-rating {
  font-size: 0.75rem;
  color: #999;
  margin-top: 4px;
}

.similar-rating i {
  color: #ffd700;
}

/* Active Wish Button */
.btn.active-wish {
  background: rgba(243, 156, 18, 0.2);
  color: #f39c12;
  border-color: #f39c12;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state-title {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.empty-state-text {
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  line-height: 1;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #ccc;
}

@media (max-width: 768px) {
  .details-body {
    padding: 0 1rem;
  }

  .backdrop-gallery {
    grid-template-columns: 1fr;
  }

  .similar-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

@media (max-width: 480px) {
  .detail-section {
    margin-bottom: 1.5rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
