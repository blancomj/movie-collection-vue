<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-1.5 flex-wrap mt-6">
    <button
      :disabled="currentPage <= 1"
      class="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a3d] rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white hover:border-primary text-gray-700 dark:text-gray-300"
      @click="$emit('update:currentPage', currentPage - 1)"
    >
      <i class="fas fa-chevron-left"></i>
    </button>

    <template v-for="page in visiblePages" :key="page">
      <span v-if="page === '...'" class="px-2 py-2 text-gray-400 dark:text-gray-500">...</span>
      <button
        v-else
        class="min-w-[40px] px-3 py-2 border-2 rounded-lg text-sm font-medium transition-colors"
        :class="page === currentPage
          ? 'bg-primary text-white border-primary'
          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a3d] text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary'"
        @click="$emit('update:currentPage', page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      :disabled="currentPage >= totalPages"
      class="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#2a2a3d] rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-white hover:border-primary text-gray-700 dark:text-gray-300"
      @click="$emit('update:currentPage', currentPage + 1)"
    >
      <i class="fas fa-chevron-right"></i>
    </button>

    <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">
      Pagina {{ currentPage }} de {{ totalPages }} ({{ total }} peliculas)
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  total: { type: Number, required: true },
  perPage: { type: Number, default: 20 }
})

defineEmits(['update:currentPage'])

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
})
</script>