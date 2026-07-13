<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-black/90"></div>

        <button
          class="absolute top-4 right-4 z-10 text-white text-2xl hover:text-gray-300 transition-colors"
          @click="$emit('close')"
        >
          <i class="fas fa-times"></i>
        </button>

        <div class="relative z-10 w-full max-w-4xl">
          <div class="relative w-full" style="padding-top: 56.25%;">
            <iframe
              v-if="videoKey"
              :src="`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`"
              class="absolute inset-0 w-full h-full rounded-xl"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

          <div v-if="videoTitle" class="mt-3 text-center">
            <p class="text-white font-medium">{{ videoTitle }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  videoKey: { type: String, default: '' },
  videoTitle: { type: String, default: '' }
})

const emit = defineEmits(['close'])

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

watch(() => props.visible, (show) => {
  if (show) {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s ease; }
.modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>