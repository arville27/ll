import { PrismaClientType } from '../../db';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const getStudentClassesInputSchema = z.optional(
  z.object({
    searchKey: z.string(),
  })
);
type GetClassInput = z.infer<typeof getStudentClassesInputSchema>;

export async function getClass({
  input,
  prisma,
}: {
  input: GetClassInput;
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
  .input(getStudentClassesInputSchema)
  .query(({ input, ctx }) => getClass({ input, prisma: ctx.prisma }));
