import type { AppRouter } from '@ll/server';
import { httpBatchLink, createTRPCProxyClient } from '@trpc/client';
import superjson from 'superjson';

// @ts-expect-error
export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `http://localhost:3000/api/trpc`,
    }),
  ],
});
