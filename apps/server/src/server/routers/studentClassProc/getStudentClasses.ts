import { PrismaClientType } from '../../db';
import { z } from 'zod';
import { procedure } from '../../trpc';

const PAGE_SIZE = 8;

export const getStudentClassesSchema = z.object({
  searchKey: z.optional(z.string()),
  page: z.optional(z.number()),
});

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
        contains: input.searchKey ? input.searchKey : '',
      },
    },
    include: {
      students: true,
    },
    orderBy: {
      className: 'asc',
    },
  });
}

export const getStudentClassesProcedure = procedure
  .input(getStudentClassesSchema)
  .query(({ input, ctx }) => getClass({ input, prisma: ctx.prisma }));

export const getStudentClassesPageableProcedure = procedure
  .input(getStudentClassesSchema)
  .query(async ({ input, ctx }) => {
    if (!input || !input.page) input.page = 1;
    const records = await getClass({ input, prisma: ctx.prisma });
    const startIndex = PAGE_SIZE * (input.page - 1);
    return {
      pageCount: input.page,
      pageTotal: Math.ceil(records.length / PAGE_SIZE),
      records: records.slice(startIndex, startIndex + PAGE_SIZE - 1),
    };
  });
