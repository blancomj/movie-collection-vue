<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 dark:bg-[#1e1e2f] dark:border-gray-700 md:hidden">
    <div class="flex justify-around items-center h-16">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-gray-500 dark:text-gray-400 hover:text-primary transition-colors relative"
        active-class="text-primary"
      >
        <i :class="item.icon" class="text-lg"></i>
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
const navItems = [
  { to: '/', icon: 'fas fa-home', label: 'Inicio' },
  { to: '/favoritos', icon: 'fas fa-heart', label: 'Favoritos' },
  { to: '/estadisticas', icon: 'fas fa-chart-bar', label: 'Stats' },
  { to: '/configuracion', icon: 'fas fa-cog', label: 'Config' }
]
</script>