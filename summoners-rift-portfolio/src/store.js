import { create } from 'zustand'
export const usePortfolio = create((set) => ({
  active: null,
  select: (active) => set({ active }),
  reset: () => set({ active: null })
}))