import { initTRPC } from '@trpc/server';

import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from './db';

type CreateContextOptions = Record<string, never>;

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

export const createTRPCContext = (_opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({});
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
import superjson from 'superjson';
import { ZodError } from 'zod';

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
