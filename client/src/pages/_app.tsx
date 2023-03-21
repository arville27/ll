import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import { useState } from 'react';

import '../style.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
