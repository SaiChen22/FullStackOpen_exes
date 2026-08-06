// src/stores/notificationStore.js
import { create } from 'zustand'

let timeoutId = null

const useNotificationStore = create((set) => ({
  message: null,
  type: null,

  // 对应原来 App.jsx 里的 notify 函数
  showNotification: (message, type = 'success', timeout = 5000) => {
    // 如果上一条通知的计时器还没到，先清掉，避免旧的 setTimeout
    // 把新消息意外清空
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    set({ message, type })

    timeoutId = setTimeout(() => {
      set({ message: null, type: null })
    }, timeout)
  },

  clearNotification: () => {
    if (timeoutId) clearTimeout(timeoutId)
    set({ message: null, type: null })
  }
}))

export default useNotificationStore