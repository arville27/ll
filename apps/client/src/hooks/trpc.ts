import type { AppRouter } from '@ll/server';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

function getBaseUrl() {
  // assume localhost
  return 'http://localhost:3000';
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          headers() {
            return {
              Authorization: 'RjsDKNJvHJI0y6XYmpxg8qraBMH9z6XI',
            };
          },
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});
