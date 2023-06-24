import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const deleteStudentClassSchema = z.object({
  id: z.number(),
});

export type deleteStudentClassInput = z.infer<typeof deleteStudentClassSchema>;

export const deleteStudentClassProcedure = protectedProcedure
  .input(deleteStudentClassSchema)
  .mutation(async ({ input, ctx }) => {
    // const relatedStudent = await ctx.prisma.student.findFirst({
    //   where: {
    //     studentClassId: input.id,
    //   },
    // });
    // if (relatedStudent)
    //   throw new TRPCError({
    //     code: 'BAD_REQUEST',
    //     message: 'Can not remove class with student(s)',
    //   });

    return await ctx.prisma.studentClass.delete({
      where: {
        id: input.id,
      },
    });
  });
