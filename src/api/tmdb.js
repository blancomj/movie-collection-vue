export function getPosterUrl(posterPath, size = 'w500') {
  if (!posterPath) return null
  return `https://image.tmdb.org/t/p/${size}${posterPath}`
}

export function getBackdropUrl(backdropPath, size = 'w1280') {
  if (!backdropPath) return null
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`
}

export function getProfileUrl(profilePath, size = 'w185') {
  if (!profilePath) return null
  return `https://image.tmdb.org/t/p/${size}${profilePath}`
}