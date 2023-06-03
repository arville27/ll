import { procedure } from '../../trpc';
import { z } from 'zod';

export const deleteStudentSchema = z.object({
  id: z.number(),
});

export type deleteStudentInput = z.infer<typeof deleteStudentSchema>;

export const deleteStudentProcedure = procedure
  .input(deleteStudentSchema)
  .mutation(async ({ input, ctx }) => {
    return await ctx.prisma.student.delete({
      where: {
        id: input.id,
      },
    });
  });
