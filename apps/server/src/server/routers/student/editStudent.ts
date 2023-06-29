import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure } from '../../trpc';

export const editStudentInputSchema = z.object({
  id: z.number(),
  name: z.string(),
  birthDate: z.number().lte(new Date().getTime()),
  uid: z.string(),
  studentClassId: z.number(),
});

export type editStudentInput = z.infer<typeof editStudentInputSchema>;

export const editStudentProcedure = protectedProcedure
  .input(editStudentInputSchema)
  .mutation(async ({ input, ctx }) => {
    const existedStudent = await ctx.prisma.student.findUnique({
      where: {
        uid: input.uid,
      },
    });

    if (existedStudent && existedStudent.id !== input.id)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Student ID already used' });

    const { id, uid, name, birthDate, studentClassId } = input;
    return await ctx.prisma.student.update({
      where: { id },
      data: {
        uid,
        name,
        birthDate: new Date(birthDate),
        studentClassId,
      },
    });
  });
