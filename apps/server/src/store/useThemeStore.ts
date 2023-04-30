import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeStore = {
  hydrated: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

const usePersistedStore = create(
  persist<ThemeStore>(
    (set) => ({
      hydrated: true,
      theme: 'light',
      setTheme: (theme) => {
        set(() => ({ theme }));
      },
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'themeStorage',
    }
  )
);

// This a fix to ensure zustand never hydrates the store before React hydrates the page
// else it causes a mismatch between SSR/SSG and client side on first draw which produces an error
export const useThemeStore = ((selector, compare) => {
  const store = usePersistedStore(selector, compare);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return hydrated
    ? store
    : selector({
        hydrated,
        theme: 'light',
      } as ThemeStore);
}) as typeof usePersistedStore;
