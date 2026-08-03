import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: (notification) => set(() => ({ notification }))
  }
}));

export const useNotification = () => useNotificationStore((state) => state.notification);
export const useNotificationActions = () => useNotificationStore((state) => state.actions);

let timeoutId

export const setNotification = (message, seconds = 5) => {
  const { setNotification } = useNotificationStore.getState().actions
  setNotification(message)

  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() => {
    setNotification(null)
  }, seconds * 1000)
}
