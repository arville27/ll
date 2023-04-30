import { trpc } from '@/hooks/trpc';
import '@/style.css';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  em,
  LoadingOverlay,
} from '@mantine/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

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
            'sm': em('640px'),
            'md': em('768px'),
            'lg': em('1034px'),
            'xl': em('1280px'),
            '2xl': em('1536px'),
          },
        }}>
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default trpc.withTRPC(MyApp);
