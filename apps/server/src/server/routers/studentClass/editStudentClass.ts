import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const editStudentClassInputSchema = z.object({
  id: z.number(),
  name: z.string(),
  grade: z.number().nullable(),
});

export type editStudentClassInput = z.infer<typeof editStudentClassInputSchema>;

export const editStudentClassProcedure = protectedProcedure
  .input(editStudentClassInputSchema)
  .mutation(async ({ input, ctx }) => {
    if (input.grade && input.grade <= 0)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Class grade must greater than 0',
      });
    const existedClass = await ctx.prisma.studentClass.findFirst({
      where: {
        name: input.name,
        grade: input.grade,
      },
    });

    if (existedClass && existedClass.id !== input.id)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Class already used' });

    return await ctx.prisma.studentClass.update({
      where: { id: input.id },
      data: {
        name: input.name,
        grade: input.grade,
      },
    });
  });
