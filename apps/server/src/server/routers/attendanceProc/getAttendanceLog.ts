import { PrismaClientType } from '../../db';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const getAttendanceLogInputSchema = z.optional(
  z.object({
    startDate: z.date(),
    endDate: z.date(),
  })
);
type GetAttendanceLogInput = z.infer<typeof getAttendanceLogInputSchema>;

export async function getAttendanceLog({
  input,
  prisma,
}: {
  input?: GetAttendanceLogInput;
  prisma: PrismaClientType;
}) {
  let startDate = new Date();
  let endDate = new Date();
  if (input) {
    startDate = input.startDate;
    endDate = input.endDate;
  }

  const startDateInit = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endDateInit = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate() + 1
  );

  return await prisma.attendanceLog.findMany({
    where: {
      date: {
        gte: startDateInit,
        lt: endDateInit,
      },
    },
    include: {
      student: {
        include: {
          studentClass: true,
        },
      },
    },
  });
}

export const getAttendanceLogProcedure = procedure
  .input(getAttendanceLogInputSchema)
  .query(({ input, ctx }) => getAttendanceLog({ input, prisma: ctx.prisma }));
