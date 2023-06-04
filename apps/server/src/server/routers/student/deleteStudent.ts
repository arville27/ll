import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const deleteStudentSchema = z.object({
  id: z.number(),
});

export type deleteStudentInput = z.infer<typeof deleteStudentSchema>;

export const deleteStudentProcedure = protectedProcedure
  .input(deleteStudentSchema)
  .mutation(async ({ input, ctx }) => {
    return await ctx.prisma.student.delete({
      where: {
        id: input.id,
      },
    });
  });
