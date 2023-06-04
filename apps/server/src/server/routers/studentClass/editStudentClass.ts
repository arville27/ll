import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const editStudentClassInputSchema = z.object({
  id: z.number(),
  className: z.string(),
});

export type editStudentClassInput = z.infer<typeof editStudentClassInputSchema>;

export const editStudentClassProcedure = protectedProcedure
  .input(editStudentClassInputSchema)
  .mutation(async ({ input, ctx }) => {
    const existedClass = await ctx.prisma.studentClass.findUnique({
      where: {
        className: input.className,
      },
    });

    if (existedClass && existedClass.id !== input.id)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Student UID already used' });

    return await ctx.prisma.studentClass.update({
      where: { id: input.id },
      data: {
        className: input.className,
      },
    });
  });
