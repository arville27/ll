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
      // const student = ctx.prisma.student.find
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
  getTodayAttendanceLog: procedure.query(async ({ ctx }) => {
    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return await ctx.prisma.attendanceLog.findMany({
      where: {
        date: {
          gte: todayWithoutTime,
        },
      },
      include: {
        student: true,
      },
    });
  }),
});
