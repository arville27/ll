import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const addStudentClassSchema = z.object({
  class: z.string(),
});

export type addStudentClassInput = z.infer<typeof addStudentClassSchema>;

export const addStudentClassProcedure = procedure
  .input(addStudentClassSchema)
  .mutation(async ({ input, ctx }) => {
    const isExistedUid = await ctx.prisma.student.findUnique({
      where: { uid: input.class },
    });

    if (isExistedUid)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Classname already used' });

    const result = ctx.prisma.studentClass.create({
      data: {
        className: input.class,
      },
    });
    return await result;
  });
