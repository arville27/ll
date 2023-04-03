import { z } from 'zod';
import { procedure, router } from '../trpc';
export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const queryResult = ctx.prisma.student.findMany({
        include: { attendanceLogs: true },
      });
      return {
        message: `hello ${input.text}`,
        students: await queryResult,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
