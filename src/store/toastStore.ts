import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000, // 기본 5초
      ...toast,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    
    // 자동 제거
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  
  clearAll: () => {
    set({ toasts: [] });
  },
}));

// 편의 함수들
export const toast = {
  success: (title: string, description?: string) => {
    useToastStore.getState().addToast({ type: 'success', title, description });
  },
  error: (title: string, description?: string) => {
    useToastStore.getState().addToast({ type: 'error', title, description, duration: 7000 });
  },
  warning: (title: string, description?: string) => {
    useToastStore.getState().addToast({ type: 'warning', title, description });
  },
  info: (title: string, description?: string) => {
    useToastStore.getState().addToast({ type: 'info', title, description });
  },
};
