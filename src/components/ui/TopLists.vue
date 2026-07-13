<template>
  <div class="bg-white dark:bg-[#1e1e2f] rounded-card shadow-sm p-6">
    <h3 class="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">
      <i :class="icon" class="mr-2 text-primary"></i>{{ title }}
    </h3>

    <div v-if="items.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500">
      <p>No hay datos disponibles</p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
      >
        <span
          class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          :class="i < 3 ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
        >
          {{ i + 1 }}
        </span>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ item.label }}</p>
          <p v-if="item.sub" class="text-xs text-gray-400 dark:text-gray-500">{{ item.sub }}</p>
        </div>

        <span class="flex-shrink-0 text-sm font-bold text-primary">
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: 'fas fa-list' },
  items: {
    type: Array,
    default: () => []
  }
})
</script>