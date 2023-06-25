import { protectedProcedure } from '../../trpc';

export const upgradeStudentClassesProcedure = protectedProcedure.mutation(
  async ({ ctx }) => {
    const tobeUpdated = await ctx.prisma.studentClass.findMany({
      where: {
        grade: {
          gt: 0,
        },
      },
      orderBy: {
        grade: 'desc',
      },
    });

    for (let i = 0; i < tobeUpdated.length; i++) {
      await ctx.prisma.studentClass.update({
        where: {
          id: tobeUpdated[i].id,
        },
        data: {
          grade: {
            increment: 1,
          },
        },
      });
    }

    return {
      count: tobeUpdated.length,
    };
  }
);
