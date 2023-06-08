import { protectedProcedure } from '../../../server/trpc';

export const logoutProcedure = protectedProcedure.mutation(({ ctx }) =>
  ctx.session.destroy()
);
