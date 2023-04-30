import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const addStudentProcedure = procedure
  .input(
    z.object({
      name: z.string(),
      birthDate: z.number().lte(new Date().getTime()),
      uid: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const isExistedUid = await ctx.prisma.student.findUnique({
      where: { uid: input.uid },
    });

    if (isExistedUid)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Student UID already used' });

    const result = ctx.prisma.student.create({
      data: {
        uid: input.uid,
        name: input.name,
        birthDate: new Date(input.birthDate),
      },
    });
    return await result;
  });
