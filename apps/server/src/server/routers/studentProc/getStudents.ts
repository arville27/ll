import { procedure } from '../../trpc';
import { z } from 'zod';

export const getStudentsSchema = z.optional(
  z.object({
    searchKey: z.string(),
  })
);

export type getStudentsInput = z.infer<typeof getStudentsSchema>;

export const getStudentsProcedure = procedure
  .input(getStudentsSchema)
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
