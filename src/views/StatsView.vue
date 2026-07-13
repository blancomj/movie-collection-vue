<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">
      <i class="fas fa-chart-bar text-primary mr-2"></i>Estadisticas
    </h1>

    <LoadingSpinner v-if="!stats" message="Cargando estadisticas..." />

    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-card shadow-sm p-6 text-center">
          <i class="fas fa-film text-primary text-3xl mb-2"></i>
          <p class="text-3xl font-bold text-primary">{{ stats.total }}</p>
          <p class="text-sm text-gray-500">Peliculas</p>
        </div>
        <div class="bg-white rounded-card shadow-sm p-6 text-center">
          <i class="fas fa-star text-yellow-400 text-3xl mb-2"></i>
          <p class="text-3xl font-bold text-yellow-500">{{ avgRating }}</p>
          <p class="text-sm text-gray-500">Calificacion promedio</p>
        </div>
        <div class="bg-white rounded-card shadow-sm p-6 text-center">
          <i class="fas fa-bookmark text-primary text-3xl mb-2"></i>
          <p class="text-3xl font-bold text-primary">{{ wishlist.count }}</p>
          <p class="text-sm text-gray-500">En lista de deseos</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-bold text-gray-700 mb-3">Por decada</h3>
          <StatsBar :data="byDecade" :width="500" :height="220" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-700 mb-3">Por calificacion</h3>
          <StatsBar :data="byRating" :width="500" :height="220" color="#ffc107" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-bold text-gray-700 mb-3">Distribucion por decada</h3>
          <StatsPie :data="byDecade" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-700 mb-3">Top 10 mejor calificadas</h3>
          <TopLists title="" icon="fas fa-trophy" :items="topRated" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopLists title="Mas recientes" icon="fas fa-clock" :items="recentMovies" />
        <TopLists title="Mas populares" icon="fas fa-fire" :items="popularMovies" />
      </div>

      <div v-if="stats.lastUpdate" class="text-center text-sm text-gray-400 mt-4">
        Ultima actualizacion: {{ formatDate(stats.lastUpdate) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useWishlistStore } from '@/stores/wishlist'
import { getStats as apiGetStats } from '@/api/movies'
import StatsBar from '@/components/ui/StatsBar.vue'
import StatsPie from '@/components/ui/StatsPie.vue'
import TopLists from '@/components/ui/TopLists.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const moviesStore = useMoviesStore()
const wishlist = useWishlistStore()
const stats = ref(null)

const avgRating = computed(() => {
  if (!moviesStore.movies.length) return '0.0'
  const sum = moviesStore.movies.reduce((acc, m) => acc + (m.vote_average || 0), 0)
  return (sum / moviesStore.movies.length).toFixed(1)
})

const byDecade = computed(() => {
  const decades = {}
  for (const m of moviesStore.movies) {
    if (m.year) {
      const decade = Math.floor(m.year / 10) * 10
      decades[decade + 's'] = (decades[decade + 's'] || 0) + 1
    }
  }
  return Object.fromEntries(Object.entries(decades).sort(([a], [b]) => a.localeCompare(b)))
})

const byRating = computed(() => {
  const ratings = {}
  for (let i = 1; i <= 9; i++) ratings[i + '.0+'] = 0
  for (const m of moviesStore.movies) {
    if (m.vote_average) {
      const bucket = Math.floor(m.vote_average)
      if (bucket >= 1 && bucket <= 9) ratings[bucket + '.0+']++
    }
  }
  return ratings
})

const topRated = computed(() =>
  moviesStore.movies
    .filter(m => m.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 10)
    .map(m => ({
      label: m.title,
      sub: m.year ? `(${m.year})` : '',
      value: m.vote_average?.toFixed(1)
    }))
)

const recentMovies = computed(() =>
  moviesStore.movies
    .filter(m => m.year)
    .sort((a, b) => b.year - a.year)
    .slice(0, 10)
    .map(m => ({
      label: m.title,
      sub: m.original_title !== m.title ? m.original_title : '',
      value: m.year
    }))
)

const popularMovies = computed(() =>
  moviesStore.movies
    .filter(m => m.vote_count > 0)
    .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, 10)
    .map(m => ({
      label: m.title,
      sub: `${m.vote_count} votos`,
      value: m.vote_average?.toFixed(1)
    }))
)

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return dateStr }
}

onMounted(async () => {
  if (moviesStore.movies.length === 0) {
    await moviesStore.loadMovies()
  }
  stats.value = { total: moviesStore.movies.length, lastUpdate: null }
  try {
    const data = await apiGetStats()
    if (data) stats.value = data
  } catch (e) {
    // use local stats
  }
  wishlist.load()
})
</script>