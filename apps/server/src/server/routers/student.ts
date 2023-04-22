import { z } from 'zod';
import { procedure, router } from '../trpc';

export const studentRouter = router({
  addStudent: procedure
    .input(
      z.object({
        name: z.string(),
        birthDate: z.number().lte(new Date().getTime()),
        uid: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = ctx.prisma.student.create({
        data: {
          uid: input.uid,
          name: input.name,
          birthDate: new Date(input.birthDate),
        },
      });
      return {
        data: await result,
      };
    }),
  editStudent: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        birthDate: z.number().lte(new Date().getTime()),
        uid: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = ctx.prisma.student.update({
        data: {
          uid: input.uid,
          name: input.name,
          birthDate: new Date(input.birthDate),
        },
        where: { uid: input.uid },
      });
      return {
        data: await result,
      };
    }),
  getStudentBySearchKey: procedure
    .input(
      z.object({
        searchKey: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const whereClause = {
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
          ],
        },
      };

      return input.searchKey.length === 0
        ? await ctx.prisma.student.findMany()
        : await ctx.prisma.student.findMany(whereClause);
    }),
  deleteStudentByUid: procedure
    .input(
      z.object({
        uid: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.student.delete({
        where: {
          uid: input.uid,
        },
      });
    }),
});
