import { procedure } from '../../trpc';
import { z } from 'zod';

export const getStudentsProcedure = procedure
  .input(
    z.optional(
      z.object({
        searchKey: z.string(),
      })
    )
  )
  .query(async ({ input, ctx }) => {
    if (!input || input.searchKey.length <= 0)
      return await ctx.prisma.student.findMany({
        include: {
          studentClass: true,
        },
      });

    return await ctx.prisma.student.findMany({
      where: {
        OR: [
          {
            name: {
              contains: input.searchKey,
            },
          },
          {
            uid: {
              contains: input.searchKey,
            },
          },
          {
            studentClass: {
              className: {
                contains: input.searchKey,
              },
            },
          },
        ],
      },
      include: {
        studentClass: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  });
