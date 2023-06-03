import type { AppRouter } from '@ll/server';
import { httpBatchLink, createTRPCProxyClient } from '@trpc/client';
import { exit } from 'process';
import superjson from 'superjson';

const SERVER_URL = process.env.SERVER_URL as string;

if (!SERVER_URL) {
  console.log('Please make sure to define SERVER_URL environment variable');
  exit(1);
}

// @ts-expect-error
export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${process.env.SERVER_URL}/api/trpc`,
    }),
  ],
});
