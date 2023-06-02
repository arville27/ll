import { PrismaClientType } from '../../db';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const getAttendanceLogPerStudentInputSchema = z.optional(
  z.object({
    startDate: z.date(),
    endDate: z.date(),
  })
);
type getAttendanceLogPerStudentInputType = z.infer<
  typeof getAttendanceLogPerStudentInputSchema
>;

export async function getAttendanceLogPerStudent({
  input,
  prisma,
}: {
  input?: getAttendanceLogPerStudentInputType;
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

  return await prisma.student.findMany({
    where: {
      attendanceLogs: {
        some: {
          date: {
            gte: startDateInit,
            lt: endDateInit,
          },
        },
      },
    },
    include: {
      attendanceLogs: {
        where: {
          date: {
            gte: startDateInit,
            lt: endDateInit,
          },
        },
      },
      studentClass: true,
    },
  });
}

export const getAttendanceLogPerStudentProcedure = procedure
  .input(getAttendanceLogPerStudentInputSchema)
  .query(({ input, ctx }) => getAttendanceLogPerStudent({ input, prisma: ctx.prisma }));
