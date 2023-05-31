import { procedure } from '../../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const editStudentInputSchema = z.object({
  id: z.number(),
  name: z.string(),
  birthDate: z.number().lte(new Date().getTime()),
  uid: z.string(),
  studentClassId: z.number(),
});

export type editStudentInput = z.infer<typeof editStudentInputSchema>;

export const editStudentProcedure = procedure
  .input(editStudentInputSchema)
  .mutation(async ({ input, ctx }) => {
    const isExistedUid = await ctx.prisma.student.findUnique({
      where: {
        uid: input.uid,
      },
    });

    if (isExistedUid && isExistedUid.id !== input.id)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Student UID already used' });

    const { id, uid, name, birthDate, studentClassId } = input;
    const result = ctx.prisma.student.update({
      where: { id },
      data: {
        uid,
        name,
        birthDate: new Date(birthDate),
        studentClassId,
      },
    });
    return await result;
  });
