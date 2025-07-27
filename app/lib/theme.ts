import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to document root immediately
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(theme);
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      initTheme: () => {
        if (typeof window === 'undefined') return;
        
        const { theme } = get();
        
        // Check for system preference if no stored theme
        if (!localStorage.getItem('theme-storage')) {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const initialTheme = systemPrefersDark ? 'dark' : 'light';
          get().setTheme(initialTheme);
          return;
        }
        
        // Apply stored theme
        get().setTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);