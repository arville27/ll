import { protectedProcedure } from '../../trpc';

export const getStudentsCountProcedure = protectedProcedure.query(async ({ ctx }) =>
  ctx.prisma.student.count()
);
