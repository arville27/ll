import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const addStudentClassSchema = z.object({
  name: z.string(),
  grade: z
    .number()
    .min(1, 'Class grade must be more than 0')
    .max(9, 'Class grade must be less than 10'),
});

export type addStudentClassInput = z.infer<typeof addStudentClassSchema>;

export const addStudentClassProcedure = protectedProcedure
  .input(addStudentClassSchema)
  .mutation(async ({ input, ctx }) => {
    const existedClass = await ctx.prisma.studentClass.findUnique({
      where: {
        name_grade: {
          name: input.name,
          grade: input.grade,
        },
      },
    });

    if (existedClass)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Class already used' });

    return await ctx.prisma.studentClass.create({
      data: {
        name: input.name,
        grade: input.grade,
      },
    });
  });
