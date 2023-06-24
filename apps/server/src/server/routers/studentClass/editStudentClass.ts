import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const editStudentClassInputSchema = z.object({
  id: z.number(),
  name: z.string(),
  grade: z
    .number()
    .min(1, 'Class grade must be more than 0')
    .max(9, 'Class grade must be less than 10'),
});

export type editStudentClassInput = z.infer<typeof editStudentClassInputSchema>;

export const editStudentClassProcedure = protectedProcedure
  .input(editStudentClassInputSchema)
  .mutation(async ({ input, ctx }) => {
    const existedClass = await ctx.prisma.studentClass.findUnique({
      where: {
        name_grade: {
          name: input.name,
          grade: input.grade,
        },
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
