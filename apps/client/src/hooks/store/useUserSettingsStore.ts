import { Store } from 'tauri-plugin-store-api';
import { create } from 'zustand';
import { z } from 'zod';

const tauriStore = new Store('.settings.conf');

interface UserSettings {
  darkMode: boolean;
  serverUrl: string;
  _hydrated: boolean;
  setServerUrl: (serverUrl: string) => void;
  toggleDarkMode: () => void;
}

export const useUserSettingsStore = create<UserSettings>((set) => ({
  darkMode: false,
  serverUrl: 'http://localhost:3000',
  _hydrated: false,
  setServerUrl: (serverUrl) => {
    set(() => ({ serverUrl }));
    tauriStore.set('serverUrl', serverUrl);
    tauriStore.save();
  },
  toggleDarkMode: async () => {
    set((state) => {
      tauriStore.set('darkMode', !state.darkMode);
      return { darkMode: !state.darkMode };
    });
    tauriStore.save();
  },
}));

const hydrate = async () => {
  const serverUrl = await tauriStore.get('serverUrl');
  const darkMode = await tauriStore.get('darkMode');

  const parsedServerUrl = z.string().safeParse(serverUrl);
  const parsedDarkMode = z.boolean().safeParse(darkMode);

  if (parsedServerUrl.success) {
    useUserSettingsStore.setState({ serverUrl: parsedServerUrl.data });
  }

  if (parsedDarkMode.success) {
    useUserSettingsStore.setState({ darkMode: parsedDarkMode.data });
  }

  useUserSettingsStore.setState({ _hydrated: true });
};

let loop = setInterval(() => {
  if (typeof window !== 'undefined') {
    hydrate();
    clearInterval(loop);
  }
}, 100);
