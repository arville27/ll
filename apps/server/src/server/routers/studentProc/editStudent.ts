import { procedure } from '@/server/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const editStudentProcedure = procedure
  .input(
    z.object({
      id: z.number(),
      name: z.string(),
      birthDate: z.number().lte(new Date().getTime()),
      uid: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const isExistedUid = await ctx.prisma.student.findUnique({
      where: {
        uid: input.uid,
      },
    });

    if (isExistedUid && isExistedUid.id !== input.id)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Student UID already used' });

    const { id, uid, name, birthDate } = input;
    const result = ctx.prisma.student.update({
      where: { id },
      data: {
        uid,
        name,
        birthDate: new Date(birthDate),
      },
    });
    return await result;
  });
