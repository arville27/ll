import { trpc } from '@/hooks/trpc';
import { useThemeStore } from '@/store/useThemeStore';
import '@/style.css';
import { ColorSchemeProvider, LoadingOverlay, MantineProvider, em } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { AppProps } from 'next/app';

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }: AppProps) {
  const { hydrated, colorScheme, toggleColorScheme } = useThemeStore((state) => ({
    hydrated: state.hydrated,
    colorScheme: state.theme,
    toggleColorScheme: state.toggleTheme,
  }));

  if (!hydrated) {
    return <LoadingOverlay visible />;
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
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
                  : theme.colors.gray[0],
            },
          }),
          breakpoints: {
            'xs': em('400px'),
            'sm': em('640px'),
            'md': em('768px'),
            'lg': em('1024px'),
            'xl': em('1280px'),
            '2xl': em('1536px'),
          },
        }}>
        <Component {...pageProps} />
        <Notifications zIndex={300} position='top-right' />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default trpc.withTRPC(MyApp);
