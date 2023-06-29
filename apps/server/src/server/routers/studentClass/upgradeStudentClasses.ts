import { protectedProcedure } from '../../trpc';

export const upgradeStudentClassesProcedure = protectedProcedure.mutation(
  async ({ ctx }) => {
    const updatedClassCount = await ctx.prisma.$transaction(async (tx) => {
      const updateClass = await tx.studentClass.findMany({
        orderBy: {
          grade: 'desc',
        },
      });

      for (let i = 0; i < updateClass.length; i++) {
        await tx.studentClass.update({
          where: {
            id: updateClass[i].id,
          },
          data: {
            grade: {
              increment: 1,
            },
          },
        });
      }

      return updateClass.length;
    });

    return {
      count: updatedClassCount,
    };
  }
);
