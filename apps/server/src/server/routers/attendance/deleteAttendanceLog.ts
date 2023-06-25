import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const deleteAttendanceLogSchema = z.object({
  id: z.number(),
});

export type deleteAttendanceLogInput = z.infer<typeof deleteAttendanceLogSchema>;

export const deleteAttendanceLogProcedure = protectedProcedure
  .input(deleteAttendanceLogSchema)
  .mutation(async ({ input, ctx }) => {
    const deletedLog = await ctx.prisma.attendanceLog.delete({
      where: {
        id: input.id,
      },
    });
    return await ctx.prisma.student.findUnique({
      where: {
        id: deletedLog.studentId,
      },
    });
  });
