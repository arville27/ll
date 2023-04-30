import { PrismaClientType } from '@/server/db';
import { z } from 'zod';
import { getAttendanceLog } from './getAttendanceLog';
import { TRPCError } from '@trpc/server';
import { procedure } from '@/server/trpc';

export const addAttendanceLogInputSchema = z.object({
  uid: z.string(),
});
type AddAttendanceLogInput = z.infer<typeof addAttendanceLogInputSchema>;

export async function addAttendanceLog({
  input,
  prisma,
}: {
  input: AddAttendanceLogInput;
  prisma: PrismaClientType;
}) {
  const isValidUid = await prisma.student.findUnique({ where: { uid: input.uid } });

  if (!isValidUid)
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Student UID not found' });

  const todayAttendanceLogs = await getAttendanceLog({ prisma });
  const isAlreadyAttended = todayAttendanceLogs.find(
    (log) => log.student.uid === input.uid
  );
  if (isAlreadyAttended)
    throw new TRPCError({ code: 'FORBIDDEN', message: 'This student has been recorded' });

  const result = await prisma.attendanceLog.create({
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
}

export const addAttendanceLogProcedure = procedure
  .input(addAttendanceLogInputSchema)
  .mutation(async ({ input, ctx }) => addAttendanceLog({ input, prisma: ctx.prisma }));
