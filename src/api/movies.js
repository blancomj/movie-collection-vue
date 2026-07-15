import client from './client'

export function getMovies(params = {}) {
  const query = {}
  if (params.search) query.search = params.search
  if (params.genre) query.genre = params.genre
  if (params.year) query.year = params.year
  if (params.sort) query.sort = params.sort

  const queryString = new URLSearchParams(query).toString()
  return client.get(`/movies${queryString ? '?' + queryString : ''}`)
}

export function getMovie(tmdbId) {
  return client.get(`/movies/${tmdbId}`)
}

export function saveMovie(movie) {
  return client.post('/movies', movie)
}

export function saveMovies(movies) {
  return client.post('/movies/batch', { movies })
}

export function deleteMovie(tmdbId) {
  return client.delete(`/movies/${tmdbId}`)
}

export function getStats() {
  return client.get('/movies/stats')
}

export function getWantedMovies() {
  return client.get('/movies/wanted')
}

export function toggleWanted(tmdbId) {
  return client.patch(`/movies/${tmdbId}/wanted`)
}

export function getWatchedMovies() {
  return client.get('/movies/watched')
}

export function toggleWatched(tmdbId) {
  return client.patch(`/movies/${tmdbId}/watched`)
}

export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return client.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function processBatch(movieNames, startIndex = 0, batchSize = 5) {
  return client.post('/upload/process', { movieNames, startIndex, batchSize })
}

export function getSimilarMovies(tmdbId) {
  return client.get(`/movies/tmdb/${tmdbId}/similar`)
}

export function getMovieVideos(tmdbId) {
  return client.get(`/movies/tmdb/${tmdbId}/videos`)
}

export function getMovieCredits(tmdbId) {
  return client.get(`/movies/tmdb/${tmdbId}/credits`)
}

export function getTmdbMovie(tmdbId) {
  return client.get(`/movies/tmdb/${tmdbId}`)
}