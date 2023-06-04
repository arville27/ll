import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const addStudentClassSchema = z.object({
  className: z.string(),
});

export type addStudentClassInput = z.infer<typeof addStudentClassSchema>;

export const addStudentClassProcedure = protectedProcedure
  .input(addStudentClassSchema)
  .mutation(async ({ input, ctx }) => {
    const existedClass = await ctx.prisma.studentClass.findUnique({
      where: { className: input.className },
    });

    if (existedClass)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Classname already used' });

    return await ctx.prisma.studentClass.create({
      data: {
        className: input.className,
      },
    });
  });
