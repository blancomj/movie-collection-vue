import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const drawerOpen = ref(false)
  const gridCols = ref(parseInt(localStorage.getItem('gridCols') || '2'))
  const isDark = ref(false)
  const notifications = ref([])

  let notifId = 0

  function applyTheme(dark) {
    if (dark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
    }
    applyTheme(isDark.value)
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    document.documentElement.classList.add('transitioning')
    applyTheme(isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    setTimeout(() => {
      document.documentElement.classList.remove('transitioning')
    }, 350)
  }

  function openDrawer() { drawerOpen.value = true }
  function closeDrawer() { drawerOpen.value = false }

  function setGridCols(cols) {
    gridCols.value = cols
    localStorage.setItem('gridCols', cols.toString())
  }

  function notify(message, type = 'info', duration = 3000) {
    const id = ++notifId
    notifications.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id)
      }, duration)
    }
  }

  function notifySuccess(msg) { notify(msg, 'success') }
  function notifyError(msg) { notify(msg, 'error', 5000) }
  function notifyInfo(msg) { notify(msg, 'info') }

  return {
    drawerOpen, gridCols, isDark, notifications,
    initTheme, toggleTheme, openDrawer, closeDrawer, setGridCols,
    notify, notifySuccess, notifyError, notifyInfo
  }
})