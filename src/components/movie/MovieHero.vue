<template>
  <div class="backdrop-hero" :style="heroStyle">
    <div class="backdrop-overlay"></div>
    <div class="backdrop-content">
      <div class="poster-container">
        <FavoriteButton :tmdb-id="movie.tmdb_id" :movie="movie" :is-local="isLocal" />
        <img v-if="poster" :src="poster" :alt="movie.title" class="poster-image" />
        <div v-else class="poster-fallback">
          <i class="fas fa-film"></i>
        </div>
      </div>
      <div class="info-container">
        <h1 class="movie-title">{{ movie.title }}</h1>
        <div v-if="movie.original_title !== movie.title" class="movie-original-title">{{ movie.original_title }}</div>
        <div class="movie-meta-row">
          <span v-if="movie.year" class="meta-badge"><i class="fas fa-calendar"></i> {{ movie.year }}</span>
          <span v-if="movie.runtime" class="meta-badge"><i class="fas fa-clock"></i> {{ formatRuntime(movie.runtime) }}</span>
          <span v-if="movie.vote_average" class="meta-badge rating-badge"><i class="fas fa-star"></i> {{ movie.vote_average.toFixed(1) }}/10</span>
        </div>
        <div class="genres-row">
          <span v-for="g in genresList" :key="g.id" class="genre-chip">{{ g.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FavoriteButton from '@/components/ui/FavoriteButton.vue'

const props = defineProps({
  movie: { type: Object, required: true },
  poster: { type: String, default: null },
  backdrop: { type: String, default: null },
  isLocal: { type: Boolean, default: false }
})

const heroStyle = computed(() => {
  if (props.backdrop) {
    return { backgroundImage: `url(${props.backdrop})` }
  }
  return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
})

const genresList = computed(() => {
  const g = props.movie.genres
  if (!g) return []
  if (Array.isArray(g)) return g
  if (typeof g === 'string') {
    try { return JSON.parse(g) } catch { return [] }
  }
  return []
})

function formatRuntime(minutes) {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}min` : `${m}min`
}
</script>

<style scoped>
.backdrop-hero {
  position: relative;
  width: 100%;
  min-height: 500px;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-radius: 12px;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%);
}

:global(.dark) .backdrop-overlay {
  background: linear-gradient(to right, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.7) 50%, rgba(13,17,23,0.4) 100%);
}

.backdrop-content {
  position: relative;
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.poster-container {
  flex-shrink: 0;
  width: 280px;
  position: relative;
}

.poster-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.poster-fallback {
  width: 100%;
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
}

.info-container {
  flex: 1;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.movie-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.movie-original-title {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 1rem;
  font-style: italic;
}

.movie-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 6px 14px;
  background: rgba(255,255,255,0.15);
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.meta-badge i {
  font-size: 0.9em;
}

.rating-badge {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
}

.rating-badge i {
  color: #ffd700;
}

.genres-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.genre-chip {
  padding: 6px 14px;
  background: rgba(102, 126, 234, 0.3);
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 500;
  color: white;
}

@media (max-width: 768px) {
  .backdrop-hero {
    min-height: auto;
  }

  .backdrop-content {
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem;
    text-align: center;
  }

  .poster-container {
    width: 416px;
    margin-bottom: 1rem;
  }

  .movie-title {
    font-size: 1.5rem;
  }

  .movie-meta-row {
    justify-content: center;
  }

  .genres-row {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .backdrop-content {
    padding: 1.5rem 0.5rem;
    gap: 1.5rem;
  }

  .poster-container {
    width: 352px;
    margin-bottom: 0.5rem;
  }

  .movie-title {
    font-size: 1.3rem;
    margin-bottom: 0.25rem;
  }

  .meta-badge {
    padding: 4px 10px;
    font-size: 0.75rem;
  }
}
</style>
