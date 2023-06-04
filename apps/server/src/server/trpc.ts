import { initTRPC } from '@trpc/server';

import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from './db';
import { sessionOptions } from '../../lib/sessionOptions';
import { getIronSession } from 'iron-session';

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const session = await getIronSession(_opts.req, _opts.res, sessionOptions);

  return {
    prisma,
    session,
  };
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
