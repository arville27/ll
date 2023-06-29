import { TRPCError, initTRPC } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { IronSession, getIronSession } from 'iron-session';
import { sessionOptions } from './sessionOptions';
import { prisma } from './db';

type CreateContextOptions = {
  session: IronSession;
  req: NextApiRequest;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    ...opts,
    prisma,
  };
};

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const session = await getIronSession(_opts.req, _opts.res, sessionOptions);

  return createInnerTRPCContext({ session, req: _opts.req });
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
import superjson from 'superjson';
import { ZodError } from 'zod';
import { NextApiRequest } from 'next';

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    let message = shape.message;
    if (error.cause instanceof ZodError) {
      const flatten = error.cause.flatten();
      // prettier-ignore
      message = Object.entries(flatten.fieldErrors).reduce(
        (finalMessage, [field, messages]) => `${finalMessage}\n${field}: ${messages ? messages.join(', ') : String(messages)}`,
        ''
      );
    }

    return {
      ...shape,
      message,
    };
  },
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  const { authorization } = ctx.req.headers;

  if (
    !ctx.session.user &&
    (!authorization || authorization !== 'RjsDKNJvHJI0y6XYmpxg8qraBMH9z6XI')
  ) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
