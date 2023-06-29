import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure } from '../../../server/trpc';

export const loginProcedure = publicProcedure
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (input.username.toLowerCase() !== 'll' || input.password !== '080808')
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Bad credentials' });

    ctx.session.user = {
      name: input.username,
    };
    await ctx.session.save();

    return ctx.session.user;
  });
