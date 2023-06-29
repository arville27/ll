import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';
import * as dfs from 'date-fns';

export const editAttendanceLogInputSchema = z.object({
  id: z.number(),
  studentId: z.number(),
  date: z.date(),
});

export type editAttendanceLogInput = z.infer<typeof editAttendanceLogInputSchema>;

export const editAttendanceLogProcedure = protectedProcedure
  .input(editAttendanceLogInputSchema)
  .mutation(async ({ input, ctx }) => {
    const startDay = dfs.startOfDay(input.date);
    const endDay = dfs.endOfDay(input.date);

    const existedSameDay = await ctx.prisma.attendanceLog.findFirst({
      where: {
        studentId: input.studentId,
        date: {
          gte: startDay,
          lte: endDay,
        },
      },
    });

    if (existedSameDay && existedSameDay.id !== input.id)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This student has been recorded',
      });

    const { id, studentId, date } = input;
    return await ctx.prisma.attendanceLog.update({
      where: { id },
      data: {
        studentId,
        date,
      },
      include: {
        student: true,
      },
    });
  });
