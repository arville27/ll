import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const addStudentSchema = z.object({
  name: z.string(),
  birthDate: z.number().lte(new Date().getTime()),
  uid: z.string(),
  studentClassId: z.number(),
});

export type addStudentInput = z.infer<typeof addStudentSchema>;

export const addStudentProcedure = procedure
  .input(addStudentSchema)
  .mutation(async ({ input, ctx }) => {
    const existedStudent = await ctx.prisma.student.findUnique({
      where: { uid: input.uid },
    });

    if (existedStudent)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Student UID already used' });

    return await ctx.prisma.student.create({
      data: {
        uid: input.uid,
        name: input.name,
        birthDate: new Date(input.birthDate),
        studentClassId: input.studentClassId,
      },
    });
  });
