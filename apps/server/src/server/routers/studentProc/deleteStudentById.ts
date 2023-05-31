import { procedure } from '../../trpc';
import { z } from 'zod';

export const deleteStudentByIdSchema = z.object({
  id: z.number(),
});

export type deleteStudentByIdInput = z.infer<typeof deleteStudentByIdSchema>;

export const deleteStudentByIdProcedure = procedure
  .input(deleteStudentByIdSchema)
  .mutation(async ({ input, ctx }) => {
    return await ctx.prisma.student.delete({
      where: {
        id: input.id,
      },
    });
  });
