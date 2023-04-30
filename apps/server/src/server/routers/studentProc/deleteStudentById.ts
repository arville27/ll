import { procedure } from '@/server/trpc';
import { z } from 'zod';

export const deleteStudentByIdProcedure = procedure
  .input(
    z.object({
      id: z.number(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    return await ctx.prisma.student.delete({
      where: {
        id: input.id,
      },
    });
  });
