import { procedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const editStudentClassInputSchema = z.object({
  id: z.number(),
  className: z.string(),
});

export type editStudentClassInput = z.infer<typeof editStudentClassInputSchema>;

export const editStudentClassProcedure = procedure
  .input(editStudentClassInputSchema)
  .mutation(async ({ input, ctx }) => {
    const isExisted = await ctx.prisma.studentClass.findUnique({
      where: {
        className: input.className,
      },
    });

    if (isExisted && isExisted.className !== input.className)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Student UID already used' });

    const result = ctx.prisma.studentClass.update({
      where: { id: input.id },
      data: {
        className: input.className,
      },
    });
    return await result;
  });
