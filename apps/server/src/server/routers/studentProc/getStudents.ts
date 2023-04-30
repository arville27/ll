import { procedure } from '@/server/trpc';
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
    if (!input || input.searchKey.length <= 0) return await ctx.prisma.student.findMany();

    const whereClause = {
      where: {
        OR: [
          {
            name: {
              contains: input.searchKey ?? '',
            },
          },
          {
            uid: {
              contains: input.searchKey ?? '',
            },
          },
        ],
      },
    };

    return await ctx.prisma.student.findMany(whereClause);
  });
