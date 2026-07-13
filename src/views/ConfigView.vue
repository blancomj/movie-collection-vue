<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
      <i class="fas fa-cog text-primary mr-2"></i>Configuracion
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">
          <i class="fas fa-database text-primary mr-2"></i>Base de datos
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span class="text-gray-500 dark:text-gray-400">Total peliculas</span>
            <span class="font-bold text-primary text-lg">{{ movieCount }}</span>
          </div>
          <div v-if="lastUpdate" class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span class="text-gray-500 dark:text-gray-400">Ultima actualizacion</span>
            <span class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(lastUpdate) }}</span>
          </div>
          <button
            class="w-full mt-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
            @click="refreshStats"
          >
            <i class="fas fa-sync-alt"></i> Actualizar estadisticas
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">
          <i class="fas fa-upload text-primary mr-2"></i>Subir peliculas
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Sube un archivo .txt con nombres de peliculas, uno por linea.</p>
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer"
          @click="$refs.fileInput.click()"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <i class="fas fa-cloud-upload-alt text-3xl text-gray-300 dark:text-gray-600 mb-2"></i>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">Arrastra o selecciona un archivo</p>
          <input type="file" accept=".txt" class="hidden" ref="fileInput" @change="handleFile" />
          <button class="px-5 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary-600 transition-colors" @click.stop="$refs.fileInput.click()">
            Seleccionar
          </button>
        </div>
        <div v-if="uploadStatus" class="mt-3 p-3 rounded-lg text-sm"
          :class="uploadStatus.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'">
          <i :class="uploadStatus.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-2"></i>
          {{ uploadStatus.message }}
        </div>
      </div>
    </div>

    <div v-if="batchProcessing" class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6 mb-6">
      <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-3">
        <i class="fas fa-cog fa-spin text-primary mr-2"></i>Procesando peliculas...
      </h3>
      <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
        <span>{{ batchStatus }}</span>
        <span>{{ batchProgress }} / {{ batchTotal }}</span>
      </div>
      <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] text-white font-bold" :style="{ width: `${batchTotal > 0 ? (batchProgress / batchTotal) * 100 : 0}%` }">
          {{ batchTotal > 0 ? Math.round((batchProgress / batchTotal) * 100) : 0 }}%
        </div>
      </div>
      <div v-if="batchResults.length" class="mt-3 max-h-48 overflow-y-auto">
        <div v-for="(r, i) in batchResults" :key="i" class="flex items-center gap-2 py-1 text-sm border-b border-gray-100 dark:border-gray-700 last:border-0">
          <i :class="r.success ? 'fas fa-check-circle text-green-500' : 'fas fa-times-circle text-red-500'"></i>
          <span class="text-gray-700 dark:text-gray-300 truncate">{{ r.name || r.movie?.title || 'Pelicula' }}</span>
          <span v-if="!r.success" class="text-xs text-red-400 ml-auto flex-shrink-0">{{ r.error }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200">
          <i class="fas fa-film text-primary mr-2"></i>Peliculas en coleccion
        </h3>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ moviesStore.movies.length }} peliculas</span>
      </div>

      <div v-if="moviesStore.loading" class="text-center py-8">
        <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else>
        <div class="mb-3">
          <input v-model="searchTerm" type="text" placeholder="Buscar pelicula..." class="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-[#2a2a3d] text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none" />
        </div>
        <div class="max-h-96 overflow-y-auto space-y-1">
          <div
            v-for="m in filteredMoviesList"
            :key="m.tmdb_id"
            class="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <div class="w-8 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              <img v-if="getPosterLocal(m)" :src="getPosterLocal(m)" :alt="m.title" class="w-full h-full object-cover" loading="lazy" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <i class="fas fa-film text-gray-300 dark:text-gray-600 text-xs"></i>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ m.title }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500">{{ m.year || 'N/A' }}</p>
            </div>
            <span class="text-xs text-yellow-500 flex-shrink-0">
              <i class="fas fa-star mr-0.5"></i>{{ m.vote_average?.toFixed(1) || '0.0' }}
            </span>
            <button
              class="flex-shrink-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all p-1"
              title="Eliminar pelicula"
              @click="deleteMovie(m.tmdb_id, m.title)"
            >
              <i class="fas fa-trash-alt text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6">
      <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">
        <i class="fas fa-info-circle text-primary mr-2"></i>Acerca de
      </h3>
      <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Version:</strong> 2.0.0 (Vue 3 + Vite)</p>
        <p><strong>Backend:</strong> Express + sql.js</p>
        <p><strong>Peliculas:</strong> {{ movieCount }}</p>
        <p><strong>Base path:</strong> /peliculas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { processBatch, deleteMovie as apiDeleteMovie, getStats as apiGetStats } from '@/api/movies'
import { useNotifications } from '@/composables/useNotifications'
import { usePoster } from '@/composables/usePoster'
import axios from 'axios'

const moviesStore = useMoviesStore()
const { success, error: notifyError } = useNotifications()
const { getPoster: getPosterLocal } = usePoster()

const movieCount = ref(0)
const lastUpdate = ref('')
const uploadStatus = ref(null)
const batchProcessing = ref(false)
const batchProgress = ref(0)
const batchTotal = ref(0)
const batchStatus = ref('')
const batchResults = ref([])
const searchTerm = ref('')

const filteredMoviesList = computed(() => {
  if (!searchTerm.value) return moviesStore.movies
  const term = searchTerm.value.toLowerCase()
  return moviesStore.movies.filter(m =>
    (m.title && m.title.toLowerCase().includes(term)) ||
    (m.original_title && m.original_title.toLowerCase().includes(term))
  )
})

async function refreshStats() {
  try {
    const data = await apiGetStats()
    movieCount.value = data.total
    lastUpdate.value = data.lastUpdate
    success('Estadisticas actualizadas')
  } catch (e) {
    notifyError('Error al actualizar estadisticas')
  }
}

async function deleteMovie(tmdbId, title) {
  if (!confirm(`Eliminar "${title}" de tu coleccion?`)) return
  try {
    await apiDeleteMovie(tmdbId)
    moviesStore.movies = moviesStore.movies.filter(m => m.tmdb_id !== tmdbId)
    movieCount.value = moviesStore.movies.length
    success(`"${title}" eliminada`)
  } catch (e) {
    notifyError('Error al eliminar pelicula')
  }
}

async function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  await processFile(file)
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

async function processFile(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post('/peliculas/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (res.data.success) {
      const { movieNames } = res.data
      uploadStatus.value = { type: 'success', message: `Archivo: ${movieNames.length} peliculas para procesar.` }
      batchProcessing.value = true
      batchTotal.value = movieNames.length
      batchProgress.value = 0
      batchResults.value = []
      batchStatus.value = 'Iniciando...'

      const batchSize = 5
      for (let i = 0; i < movieNames.length; i += batchSize) {
        batchStatus.value = `Procesando ${movieNames[i].trim()}...`
        try {
          const result = await processBatch(movieNames, i, batchSize)
          if (result && result.results) {
            batchResults.value.push(...result.results)
          }
        } catch (e) {
          console.error('Batch error:', e)
        }
        batchProgress.value = Math.min(i + batchSize, movieNames.length)
      }

      const successCount = batchResults.value.filter(r => r.success).length
      batchStatus.value = `Completado: ${successCount} de ${movieNames.length} peliculas`
      batchProcessing.value = false
      success(`${successCount} peliculas procesadas correctamente`)

      await moviesStore.loadMovies()
      movieCount.value = moviesStore.movies.length
    }
  } catch (e) {
    uploadStatus.value = { type: 'error', message: 'Error al subir archivo' }
    batchProcessing.value = false
    notifyError(e.message)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return dateStr }
}

onMounted(async () => {
  await moviesStore.loadMovies()
  try {
    const data = await apiGetStats()
    movieCount.value = data.total
    lastUpdate.value = data.lastUpdate
  } catch (e) {
    movieCount.value = moviesStore.movies.length
  }
})
</script>