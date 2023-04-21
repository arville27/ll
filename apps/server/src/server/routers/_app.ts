import { z } from 'zod';
import { procedure, router } from '../trpc';
export const appRouter = router({
  addStudent: procedure
    .input(
      z.object({
        name: z.string(),
        birthDate: z.number().lte(new Date().getTime()),
        uid: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = ctx.prisma.student.create({
        data: {
          uid: input.uid,
          name: input.name,
          birthDate: new Date(input.birthDate),
        },
      });
      return {
        data: await result,
      };
    }),
  getAllStudent: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.student.findMany();
  }),
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
    console.log(todayWithoutTime);
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
// export type definition of API
export type AppRouter = typeof appRouter;
