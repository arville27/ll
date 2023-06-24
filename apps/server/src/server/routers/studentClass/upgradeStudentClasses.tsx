import { protectedProcedure } from '../../trpc';

export const upgradeStudentClassesProcedure = protectedProcedure.mutation(
  async ({ ctx }) => {
    const deleted = await ctx.prisma.studentClass.deleteMany({
      where: {
        grade: {
          gte: 9,
        },
      },
    });

    const tobeUpdated = await ctx.prisma.studentClass.findMany({
      where: {
        grade: {
          lt: 9,
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
      updated: {
        count: tobeUpdated.length,
      },
      deleted,
    };
  }
);
