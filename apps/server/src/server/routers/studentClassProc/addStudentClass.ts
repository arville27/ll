import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const addStudentClassSchema = z.object({
  className: z.string(),
});

export type addStudentClassInput = z.infer<typeof addStudentClassSchema>;

export const addStudentClassProcedure = procedure
  .input(addStudentClassSchema)
  .mutation(async ({ input, ctx }) => {
    const studentClass = await ctx.prisma.studentClass.findUnique({
      where: { className: input.className },
    });

    if (studentClass)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Classname already used' });

    const result = ctx.prisma.studentClass.create({
      data: {
        className: input.className,
      },
    });
    return await result;
  });
