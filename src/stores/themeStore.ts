import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme
        const newTheme = current === 'light' ? 'dark' : 
                        current === 'dark' ? 'system' : 'light'
        set({ theme: newTheme })
      }
    }),
    {
      name: 'nelson-gpt-theme'
    }
  )
)