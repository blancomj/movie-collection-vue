<template>
  <div class="cast-grid">
    <div
      v-for="actor in cast"
      :key="actor.id"
      class="actor-card"
    >
      <img
        v-if="actor.profile_path"
        :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
        :alt="actor.name"
        class="actor-photo"
        loading="lazy"
      />
      <div v-else class="actor-photo-placeholder">
        <i class="fas fa-user"></i>
      </div>
      <div class="actor-info">
        <span class="actor-name">{{ actor.name }}</span>
        <span class="actor-character">{{ actor.character }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cast: { type: Array, default: () => [] }
})
</script>

<style scoped>
.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.actor-card {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.actor-card:hover {
  transform: translateY(-5px);
}

.actor-photo {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.actor-photo-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
}

.actor-info {
  padding: 0.5rem;
}

.actor-name {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.actor-character {
  display: block;
  font-size: 0.75rem;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .cast-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }
}
</style>
