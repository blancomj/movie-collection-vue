<template>
  <div class="relative">
    <div class="flex gap-3">
      <div class="relative flex-1">
        <input
          :value="modelValue"
          type="text"
          :placeholder="placeholder"
          class="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-600 rounded-full text-base bg-white dark:bg-[#2a2a3d] text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none transition-colors"
          @input="onInput"
          @keydown.enter="$emit('search')"
        />
        <button
          v-if="modelValue"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          @click="$emit('update:modelValue', ''); $emit('search')"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <button
        class="px-5 py-3 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors flex items-center gap-2"
        @click="$emit('search')"
      >
        <i class="fas fa-search"></i>
        <span class="hidden sm:inline">Buscar</span>
      </button>
    </div>

    <Transition name="fade">
      <div
        v-if="suggestions.length > 0 && showSuggestions"
        class="absolute top-full left-0 right-14 bg-white dark:bg-[#2a2a3d] border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg mt-2 max-h-80 overflow-y-auto z-50"
      >
        <button
          v-for="(item, i) in suggestions"
          :key="i"
          class="w-full px-4 py-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
          @click="selectSuggestion(item)"
        >
          <i class="fas fa-film text-primary/50"></i>
          <div>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.title }}</p>
            <p v-if="item.year" class="text-xs text-gray-400 dark:text-gray-500">{{ item.year }}</p>
          </div>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMoviesStore } from '@/stores/movies'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar peliculas...' }
})

const emit = defineEmits(['update:modelValue', 'search'])

const moviesStore = useMoviesStore()
const showSuggestions = ref(false)

let debounceTimer = null

function onInput(e) {
  const val = e.target.value
  emit('update:modelValue', val)
  showSuggestions.value = val.length >= 2

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search')
  }, 300)
}

const suggestions = computed(() => {
  if (!props.modelValue || props.modelValue.length < 2) return []
  const term = props.modelValue.toLowerCase()
  return moviesStore.movies
    .filter(m =>
      (m.title && m.title.toLowerCase().includes(term)) ||
      (m.original_title && m.original_title.toLowerCase().includes(term))
    )
    .slice(0, 8)
})

function selectSuggestion(item) {
  emit('update:modelValue', item.title)
  showSuggestions.value = false
  emit('search')
}
</script>