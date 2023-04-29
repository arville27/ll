import { trpc } from '@/hooks/trpc';
import '@/style.css';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  em,
} from '@mantine/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';

// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
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
            sm: em('640px'),
            md: em('768px'),
            lg: em('1034px'),
            xl: em('1280px'),
            '2xl': em('1536px'),
          },
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default trpc.withTRPC(MyApp);
