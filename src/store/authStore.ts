import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser:   (u: User | null) => void;
  setLoad:   (v: boolean)     => void;
  setError:  (msg: string | null) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  loading: false,
  error: null,
  setUser:  user  => set({ user }),
  setLoad:  loading => set({ loading }),
  setError: error   => set({ error }),
}));
