import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/movie/:id', name: 'movie', component: () => import('@/views/MovieDetailView.vue') },
  { path: '/favoritos', name: 'favorites', component: () => import('@/views/FavoritesView.vue') },
  { path: '/deseadas', name: 'wanted', component: () => import('@/views/WantedView.vue') },
  { path: '/vistas', name: 'watched', component: () => import('@/views/WatchedView.vue') },
  { path: '/estadisticas', name: 'stats', component: () => import('@/views/StatsView.vue') },
  { path: '/configuracion', name: 'config', component: () => import('@/views/ConfigView.vue') }
]

const router = createRouter({
  history: createWebHistory('/peliculas'),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router