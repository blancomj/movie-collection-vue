<template>
  <button
    class="inline-flex items-center justify-center rounded-full transition-all"
    :class="[isWatched ? 'bg-red-500 text-white shadow-md' : 'bg-black/60 text-white hover:bg-red-500/80', classSize]"
    @click.stop="handleToggle"
    :title="isWatched ? 'Marcar como no vista' : 'Marcar como vista'"
  >
    <i class="fas fa-bookmark"></i>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useWatchedStore } from '@/stores/watched'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  tmdbId: { type: Number, required: true },
  size: { type: String, default: 'md' }
})

const watched = useWatchedStore()
const { success } = useNotifications()

const isWatched = computed(() => watched.isWatched(props.tmdbId))

const classSize = computed(() => {
  if (props.size === 'sm') return 'w-8 h-8 text-xs'
  return 'w-10 h-10 text-sm'
})

async function handleToggle() {
  try {
    const newState = await watched.toggle(props.tmdbId)
    success(newState ? 'Marcada como vista' : 'Marcada como no vista')
  } catch (e) {
    console.error(e)
  }
}
</script>
