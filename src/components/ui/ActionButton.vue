<template>
  <span
    v-if="readonly && isWished"
    class="inline-flex items-center justify-center rounded-full bg-primary text-white shadow-md"
    :class="sizeClasses"
  >
    <i class="fas fa-bookmark"></i>
  </span>

  <button
    v-else-if="!readonly"
    class="inline-flex items-center justify-center rounded-full transition-all"
    :class="sizeClasses"
    @click.stop="handleToggle"
    :title="isWished ? 'Quitar de deseadas' : 'Marcar como deseada'"
  >
    <i :class="isWished ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  tmdbId: { type: Number, required: true },
  size: { type: String, default: 'md' },
  readonly: { type: Boolean, default: false }
})

const wishlist = useWishlistStore()
const { success } = useNotifications()

const isWished = computed(() => wishlist.isWanted(props.tmdbId))

const sizeClasses = computed(() => {
  const base = isWished.value
    ? 'bg-primary text-white shadow-md'
    : 'bg-black/60 text-white hover:bg-black/80'
  if (props.size === 'sm') return `${base} w-8 h-8 text-xs`
  return `${base} w-10 h-10 text-sm`
})

async function handleToggle() {
  try {
    const newState = await wishlist.toggle(props.tmdbId)
    success(newState ? 'Agregado a deseadas' : 'Eliminado de deseadas')
  } catch (e) {
    console.error(e)
  }
}
</script>