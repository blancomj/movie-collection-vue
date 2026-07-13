<template>
  <div>
    <button
      class="md:hidden w-full py-3 bg-primary/10 text-primary border-2 border-primary rounded-lg text-sm font-medium flex items-center justify-center gap-2 mb-3"
      @click="expanded = !expanded"
    >
      <i class="fas fa-filter"></i> Filtros
      <i :class="expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-xs"></i>
    </button>

    <div :class="expanded ? 'grid' : 'hidden md:grid'" class="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <select
        :value="genre"
        class="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-[#2a2a3d] text-gray-700 dark:text-gray-200 focus:border-primary focus:outline-none cursor-pointer"
        @change="$emit('update:genre', $event.target.value)"
      >
        <option value="">Todos los generos</option>
        <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>

      <select
        :value="year"
        class="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-[#2a2a3d] text-gray-700 dark:text-gray-200 focus:border-primary focus:outline-none cursor-pointer"
        @change="$emit('update:year', $event.target.value)"
      >
        <option value="">Todos los anos</option>
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>

      <select
        :value="sort"
        class="px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-[#2a2a3d] text-gray-700 dark:text-gray-200 focus:border-primary focus:outline-none cursor-pointer"
        @change="$emit('update:sort', $event.target.value)"
      >
        <option value="original_title.asc">Alfabetico A-Z</option>
        <option value="original_title.desc">Alfabetico Z-A</option>
        <option value="year.desc">Ano (recientes)</option>
        <option value="year.asc">Ano (antiguas)</option>
        <option value="vote_average.desc">Mejor calificacion</option>
        <option value="vote_average.asc">Peor calificacion</option>
      </select>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Min:</label>
        <div class="flex gap-0.5">
          <button
            v-for="s in 5"
            :key="s"
            class="text-lg transition-colors"
            :class="s <= minRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'"
            @click="$emit('update:minRating', s === minRating ? 0 : s)"
          >
            <i class="fas fa-star"></i>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 col-span-full">
        <button
          v-for="d in decades"
          :key="d"
          class="px-3 py-1 rounded-full text-sm font-medium border-2 transition-colors"
          :class="decade === d
            ? 'bg-primary text-white border-primary'
            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary'"
          @click="$emit('update:decade', decade === d ? '' : d)"
        >
          {{ d }}s
        </button>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-3">
      <span
        v-if="genre"
        class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
      >
        {{ genres.find(g => g.id == genre)?.name }}
        <button @click="$emit('update:genre', '')" class="hover:opacity-70">&times;</button>
      </span>
      <span
        v-if="year"
        class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
      >
        {{ year }}
        <button @click="$emit('update:year', '')" class="hover:opacity-70">&times;</button>
      </span>
      <span
        v-if="decade"
        class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
      >
        {{ decade }}s
        <button @click="$emit('update:decade', '')" class="hover:opacity-70">&times;</button>
      </span>
      <button
        @click="$emit('clear')"
        class="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 transition-colors"
      >
        Limpiar todo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  genre: { type: [String, Number], default: '' },
  year: { type: [String, Number], default: '' },
  sort: { type: String, default: 'original_title.asc' },
  minRating: { type: Number, default: 0 },
  decade: { type: String, default: '' },
  genres: { type: Array, default: () => [] },
  years: { type: Array, default: () => [] },
  decades: { type: Array, default: () => [] }
})

defineEmits(['update:genre', 'update:year', 'update:sort', 'update:minRating', 'update:decade', 'clear'])

const expanded = ref(false)

const hasActiveFilters = computed(() =>
  props.genre || props.year || props.decade || props.minRating > 0
)
</script>