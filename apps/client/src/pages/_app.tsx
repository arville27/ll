import { useUserSettingsStore } from '@/hooks/store/useUserSettingsStore';
import { trpc } from '@/hooks/trpc';
import '@/style.css';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
const UserSettingsStoreProvider = dynamic(
  () => import('@/components/UserSettingsStoreProvider'),
  {
    ssr: false,
  }
);

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }: AppProps) {
  const { colorScheme, toggleColorScheme } = useUserSettingsStore((state) => ({
    colorScheme: state.darkMode ? 'dark' : ('light' as 'light' | 'dark'),
    toggleColorScheme: state.toggleDarkMode,
  }));

  return (
    <UserSettingsStoreProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            globalStyles: (theme) => ({
              body: {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[7]
                    : theme.colors.white,
              },
            }),
          }}>
          <Component {...pageProps} />
          <Notifications zIndex={300} position='top-right' />
        </MantineProvider>
      </ColorSchemeProvider>
    </UserSettingsStoreProvider>
  );
}

export default trpc.withTRPC(MyApp);
