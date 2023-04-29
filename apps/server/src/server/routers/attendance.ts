import { z } from 'zod';
import { procedure, router } from '../trpc';

export const attendanceRouter = router({
  addAttendanceLog: procedure
    .input(
      z.object({
        uid: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.attendanceLog.create({
        data: {
          date: new Date(),
          student: {
            connect: { uid: input.uid },
          },
        },
      });
      return {
        data: result,
      };
    }),
  getAttendanceLog: procedure
    .input(
      z.object({
        date: z.optional(z.date()),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!input.date) input.date = new Date();
      const theDay = new Date(
        input.date.getFullYear(),
        input.date.getMonth(),
        input.date.getDate()
      );
      const nextDay = new Date(
        input.date.getFullYear(),
        input.date.getMonth(),
        input.date.getDate() + 1
      );

      return await ctx.prisma.attendanceLog.findMany({
        where: {
          date: {
            gte: theDay,
            lt: nextDay,
          },
        },
        include: {
          student: true,
        },
      });
    }),
});
