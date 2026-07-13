import { useUiStore } from '@/stores/ui'

export function useNotifications() {
  const ui = useUiStore()

  return {
    notify: ui.notify,
    success: ui.notifySuccess,
    error: ui.notifyError,
    info: ui.notifyInfo
  }
}