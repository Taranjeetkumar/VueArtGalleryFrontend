import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
  const addToast = (message: string, type: ToastType = 'info', description?: string, duration = 4000) => {
    const id = ++toastId;
    const toast: Toast = {
      id,
      message,
      description,
      type,
      duration
    };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, description?: string, duration?: number) => {
    return addToast(message, 'success', description, duration);
  };

  const error = (message: string, description?: string, duration?: number) => {
    return addToast(message, 'error', description, duration);
  };

  const warning = (message: string, description?: string, duration?: number) => {
    return addToast(message, 'warning', description, duration);
  };

  const info = (message: string, description?: string, duration?: number) => {
    return addToast(message, 'info', description, duration);
  };

  const confirm = (message: string, description?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // For now, use native confirm, but this could be replaced with a custom modal
      const result = window.confirm(description ? `${message}\n\n${description}` : message);
      resolve(result);
    });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    confirm
  };
}
