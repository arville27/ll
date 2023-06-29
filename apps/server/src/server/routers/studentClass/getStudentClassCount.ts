import { protectedProcedure } from '../../trpc';

export const getStudentClassCountProcedure = protectedProcedure.query(async ({ ctx }) =>
  ctx.prisma.studentClass.count()
);
