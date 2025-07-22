// store/useAuthStore.ts
import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  setIsLoggedIn: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
}))
