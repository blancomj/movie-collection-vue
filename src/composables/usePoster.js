import { getPosterUrl as tmdbPoster } from '@/api/tmdb'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export function usePoster() {
  function getPoster(movie, size = 'w500') {
    if (movie.local_poster) {
      return BASE + movie.local_poster
    }
    return tmdbPoster(movie.poster_path, size)
  }

  function getBackdrop(movie, size = 'w1280') {
    if (!movie.backdrop_path) return null
    return `https://image.tmdb.org/t/p/${size}${movie.backdrop_path}`
  }

  function getProfile(profilePath, size = 'w185') {
    if (!profilePath) return null
    return `https://image.tmdb.org/t/p/${size}${profilePath}`
  }

  return { getPoster, getBackdrop, getProfile }
}