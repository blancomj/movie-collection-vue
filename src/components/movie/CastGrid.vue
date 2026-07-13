<template>
  <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
    <div
      v-for="actor in cast"
      :key="actor.id"
      class="flex-shrink-0 w-20 text-center"
    >
      <div class="w-16 h-16 mx-auto rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mb-1.5">
        <img
          v-if="actor.profile_path"
          :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
          :alt="actor.name"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
          <i class="fas fa-user text-gray-400 dark:text-gray-500"></i>
        </div>
      </div>
      <p class="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{{ actor.name }}</p>
      <p class="text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1">{{ actor.character }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cast: { type: Array, default: () => [] }
})
</script>