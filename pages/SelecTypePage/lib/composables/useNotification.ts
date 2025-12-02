import { ref } from "#imports";

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export function useNotification() {
  const notifications = ref<Notification[]>([]);
  let notificationId = 0;

  const addNotification = (
    message: string,
    type: Notification['type'] = 'info',
    duration = 3000
  ) => {
    const notification: Notification = {
      id: ++notificationId,
      message,
      type,
      duration,
    };

    notifications.value.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    }

    return notification.id;
  };

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  const showSuccess = (message: string, duration?: number) => {
    return addNotification(message, 'success', duration);
  };

  const showError = (message: string, duration?: number) => {
    return addNotification(message, 'error', duration);
  };

  const showWarning = (message: string, duration?: number) => {
    return addNotification(message, 'warning', duration);
  };

  const showInfo = (message: string, duration?: number) => {
    return addNotification(message, 'info', duration);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}