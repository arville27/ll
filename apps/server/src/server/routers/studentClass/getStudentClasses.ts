import { z } from 'zod';
import { PrismaClientType } from '../../db';
import { protectedProcedure, publicProcedure } from '../../trpc';
import { extractClassAttribute } from '@ll/common/src/utils/extractClassAttribute';
import { StudentClass } from '@prisma/client';

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
  classIdentifiers: Pick<StudentClass, 'name' | 'grade'>;
}) {
  return !classIdentifiers.grade
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
                contains: classIdentifiers.name,
              },
            },
            {
              grade: classIdentifiers.grade,
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
    let classIdentifiers: Pick<StudentClass, 'name' | 'grade'> = {
      name: '',
      grade: null,
    };
    if (!input.searchKey) input.searchKey = '';
    else classIdentifiers = extractClassAttribute(input.searchKey);
    return getAllClasses({ input, prisma: ctx.prisma, classIdentifiers });
  });

export const getStudentClassesPageableProcedure = publicProcedure
  .input(getStudentClassesSchema)
  .query(async ({ input, ctx }) => {
    if (!input.page) input.page = 1;
    let classIdentifiers: Pick<StudentClass, 'name' | 'grade'> = {
      name: '',
      grade: null,
    };
    if (!input.searchKey) input.searchKey = '';
    else classIdentifiers = extractClassAttribute(input.searchKey);
    const allRecords = await getAllClasses({
      input,
      prisma: ctx.prisma,
      classIdentifiers,
    });
    const pageableRecords = !classIdentifiers.grade
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
                name: classIdentifiers.name,
              },
              {
                grade: classIdentifiers.grade,
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
