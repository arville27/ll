import { z } from 'zod';
import { PrismaClientType } from '../../db';
import { protectedProcedure, publicProcedure } from '../../trpc';

const PAGE_SIZE = 8;

export const getStudentClassesSchema = z.object({
  searchKey: z.optional(z.string()),
  page: z.optional(z.number()),
});

export type GetStudentClassInput = z.infer<typeof getStudentClassesSchema>;

export async function getAllClasses({
  input,
  prisma,
}: {
  input: GetStudentClassInput;
  prisma: PrismaClientType;
}) {
  return await prisma.studentClass.findMany({
    where: {
      name: {
        contains: input.searchKey ?? '',
      },
    },
    include: {
      students: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export const getStudentClassesProcedure = protectedProcedure
  .input(getStudentClassesSchema)
  .query(({ input, ctx }) => getAllClasses({ input, prisma: ctx.prisma }));

export const getStudentClassesPageableProcedure = publicProcedure
  .input(getStudentClassesSchema)
  .query(async ({ input, ctx }) => {
    if (!input.page) input.page = 1;
    const allRecords = await getAllClasses({ input, prisma: ctx.prisma });
    const pageableRecords = await ctx.prisma.studentClass.findMany({
      where: {
        name: {
          contains: input.searchKey ?? '',
        },
      },
      include: {
        students: true,
      },
      orderBy: [{ name: 'asc' }, { grade: 'asc' }],
      skip: (input.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
    return {
      pageCount: input.page,
      pageTotal: Math.ceil(allRecords.length / PAGE_SIZE),
      records: pageableRecords,
    };
  });
