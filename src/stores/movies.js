import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMovies as apiGetMovies, getMovie as apiGetMovie, getStats as apiGetStats } from '@/api/movies'

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref([])
  const currentMovie = ref(null)
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const search = ref('')
  const genre = ref('')
  const year = ref('')
  const sort = ref('original_title.asc')
  const minRating = ref(0)
  const decade = ref('')

  const allGenres = [
    { id: 28, name: 'Accion' },
    { id: 12, name: 'Aventura' },
    { id: 16, name: 'Animacion' },
    { id: 35, name: 'Comedia' },
    { id: 80, name: 'Crimen' },
    { id: 99, name: 'Documental' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Familiar' },
    { id: 14, name: 'Fantasia' },
    { id: 36, name: 'Historia' },
    { id: 27, name: 'Terror' },
    { id: 10402, name: 'Musica' },
    { id: 9648, name: 'Misterio' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Ciencia Ficcion' },
    { id: 53, name: 'Suspense' },
    { id: 10752, name: 'Guerra' },
    { id: 37, name: 'Western' }
  ]

  const decades = ['1960', '1970', '1980', '1990', '2000', '2010', '2020']

  const filteredMovies = computed(() => {
    let result = [...movies.value]

    if (search.value) {
      const term = search.value.toLowerCase()
      result = result.filter(m =>
        (m.title && m.title.toLowerCase().includes(term)) ||
        (m.original_title && m.original_title.toLowerCase().includes(term))
      )
    }

    if (genre.value) {
      result = result.filter(m =>
        m.genres && m.genres.some(g => g.id && g.id.toString() === genre.value)
      )
    }

    if (year.value) {
      result = result.filter(m => m.year && m.year.toString() === year.value)
    }

    if (minRating.value > 0) {
      result = result.filter(m => (m.vote_average || 0) >= minRating.value)
    }

    if (decade.value) {
      const start = parseInt(decade.value)
      result = result.filter(m => m.year >= start && m.year < start + 10)
    }

    const [field, direction] = sort.value.split('.')
    result.sort((a, b) => {
      let valA = a[field] || ''
      let valB = b[field] || ''
      if (field === 'year' || field === 'vote_average') {
        valA = Number(valA) || 0
        valB = Number(valB) || 0
      }
      if (typeof valA === 'string') {
        return direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      }
      return direction === 'asc' ? valA - valB : valB - valA
    })

    return result
  })

  const uniqueYears = computed(() => {
    const years = new Set(movies.value.map(m => m.year).filter(Boolean))
    return [...years].sort((a, b) => b - a)
  })

  async function loadMovies() {
    loading.value = true
    error.value = null
    try {
      const data = await apiGetMovies()
      movies.value = data.movies || []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function loadMovie(id) {
    loading.value = true
    error.value = null
    try {
      const data = await apiGetMovie(id)
      currentMovie.value = data.movie || null
      return currentMovie.value
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    try {
      const data = await apiGetStats()
      stats.value = data
    } catch (e) {
      console.error('Failed to load stats:', e)
    }
  }

  function clearFilters() {
    search.value = ''
    genre.value = ''
    year.value = ''
    minRating.value = 0
    decade.value = ''
    sort.value = 'original_title.asc'
  }

  return {
    movies, currentMovie, stats, loading, error,
    search, genre, year, sort, minRating, decade,
    allGenres, decades,
    filteredMovies, uniqueYears,
    loadMovies, loadMovie, loadStats, clearFilters
  }
})