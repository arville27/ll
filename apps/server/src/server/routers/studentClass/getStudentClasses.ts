import { z } from 'zod';
import { PrismaClientType } from '../../db';
import { protectedProcedure, publicProcedure } from '../../trpc';
import { extractClassAttribute } from '@ll/common/src/utils/extractClassAttribute';

const PAGE_SIZE = 8;

export const getStudentClassesSchema = z.object({
  searchKey: z.optional(z.string()),
  page: z.optional(z.number()),
});

export type GetStudentClassInput = z.infer<typeof getStudentClassesSchema>;

export async function getAllClasses({
  input,
  prisma,
  classIdentifiers,
}: {
  input: GetStudentClassInput;
  prisma: PrismaClientType;
  classIdentifiers: {
    className: string;
    classGrade: number;
  };
}) {
  return isNaN(classIdentifiers.classGrade)
    ? await prisma.studentClass.findMany({
        where: {
          name: {
            contains: input.searchKey,
          },
        },
        include: {
          students: true,
        },
        orderBy: [
          {
            name: 'asc',
          },
          {
            grade: 'asc',
          },
        ],
      })
    : await prisma.studentClass.findMany({
        where: {
          AND: [
            {
              name: {
                contains: classIdentifiers.className,
              },
            },
            {
              grade: classIdentifiers.classGrade,
            },
          ],
        },
        include: {
          students: true,
        },
        orderBy: [
          {
            name: 'asc',
          },
          {
            grade: 'asc',
          },
        ],
      });
}

export const getStudentClassesProcedure = protectedProcedure
  .input(getStudentClassesSchema)
  .query(({ input, ctx }) => {
    const classIdentifiers = {
      className: '',
      classGrade: NaN,
    };
    if (!input.searchKey) input.searchKey = '';
    else {
      const classData = extractClassAttribute(input.searchKey);
      classIdentifiers.className = classData.name;
      classIdentifiers.classGrade = classData.grade;
    }
    return getAllClasses({ input, prisma: ctx.prisma, classIdentifiers });
  });

export const getStudentClassesPageableProcedure = publicProcedure
  .input(getStudentClassesSchema)
  .query(async ({ input, ctx }) => {
    if (!input.page) input.page = 1;
    const classIdentifiers = {
      className: '',
      classGrade: NaN,
    };
    if (!input.searchKey) input.searchKey = '';
    else {
      const classData = extractClassAttribute(input.searchKey);
      classIdentifiers.className = classData.name;
      classIdentifiers.classGrade = classData.grade;
    }
    const allRecords = await getAllClasses({
      input,
      prisma: ctx.prisma,
      classIdentifiers,
    });
    const pageableRecords = isNaN(classIdentifiers.classGrade)
      ? await ctx.prisma.studentClass.findMany({
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
        })
      : await ctx.prisma.studentClass.findMany({
          where: {
            AND: [
              {
                name: classIdentifiers.className,
              },
              {
                grade: classIdentifiers.classGrade,
              },
            ],
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
