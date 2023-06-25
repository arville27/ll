import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const addStudentClassSchema = z.object({
  name: z.string(),
  grade: z.number().or(z.nan()),
});

export type addStudentClassInput = z.infer<typeof addStudentClassSchema>;

export const addStudentClassProcedure = protectedProcedure
  .input(addStudentClassSchema)
  .mutation(async ({ input, ctx }) => {
    if (input.grade <= 0)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Class grade must greater than 0',
      });
    const grade = isNaN(input.grade) ? null : input.grade;
    const existedClass = await ctx.prisma.studentClass.findFirst({
      where: {
        name: input.name,
        grade: grade,
      },
    });

    if (existedClass)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Class already used' });

    return await ctx.prisma.studentClass.create({
      data: {
        name: input.name,
        grade: grade,
      },
    });
  });
