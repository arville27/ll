import { PrismaClientType } from '../../db';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const getStudentClassesSchema = z.optional(
  z.object({
    searchKey: z.string(),
  })
);

export type GetStudentClassInput = z.infer<typeof getStudentClassesSchema>;

export async function getClass({
  input,
  prisma,
}: {
  input: GetStudentClassInput;
  prisma: PrismaClientType;
}) {
  return await prisma.studentClass.findMany({
    where: {
      className: {
        contains: input ? input.searchKey : '',
      },
    },
    include: {
      students: true,
    },
  });
}

export const getStudentClassesProcedure = procedure
  .input(getStudentClassesSchema)
  .query(({ input, ctx }) => getClass({ input, prisma: ctx.prisma }));
