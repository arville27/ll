import { extractClassAttribute } from '@ll/common/src/utils/extractClassAttribute';
import { StudentClass } from '@prisma/client';
import { z } from 'zod';
import { StudentOrderByEnum } from '../../../enums/orderByEnum';
import { OrderDirEnum } from '../../../enums/orderDirEnum';
import { PrismaClientType } from '../../db';
import { protectedProcedure } from '../../trpc';

const PAGE_SIZE = 10;

export const getStudentsSchema = z.object({
  page: z.optional(z.number()),
  searchKey: z.optional(z.string()),
  orderBy: z.optional(z.string()),
  orderDir: z.optional(z.string()),
});

export type getStudentsInput = z.infer<typeof getStudentsSchema>;

async function getAllStudents({
  input,
  prisma,
}: {
  input: getStudentsInput;
  prisma: PrismaClientType;
}) {
  return await prisma.student.findMany({
    where: {
      OR: [
        {
          name: {
            startsWith: input.searchKey,
          },
        },
        {
          uid: {
            startsWith: input.searchKey,
          },
        },
      ],
    },
    include: {
      studentClass: true,
    },
    orderBy: {
      name: OrderDirEnum.ASC,
    },
  });
}

export const getStudentsProcedure = protectedProcedure
  .input(getStudentsSchema)
  .query(async ({ input, ctx }) => {
    return await getAllStudents({ input, prisma: ctx.prisma });
  });

export const getStudentsPageableProcedure = protectedProcedure
  .input(getStudentsSchema)
  .query(async ({ input, ctx }) => {
    if (!input.page) input.page = 1;
    if (!input.orderBy) input.orderBy = StudentOrderByEnum.NAME;
    if (!input.orderDir) input.orderDir = OrderDirEnum.ASC;
    let classIdentifiers: Pick<StudentClass, 'name' | 'grade'> = {
      name: '',
      grade: null,
    };
    if (!input.searchKey) input.searchKey = '';
    else classIdentifiers = extractClassAttribute(input.searchKey);
    let orderByClause: any;
    switch (input.orderBy) {
      case StudentOrderByEnum.NAME:
        orderByClause = {
          name: input.orderDir,
        };
        break;
      case StudentOrderByEnum.UID:
        orderByClause = [
          {
            uid: input.orderDir,
          },
          {
            name: OrderDirEnum.ASC,
          },
        ];
        break;
      case StudentOrderByEnum.BIRTH_DATE:
        orderByClause = [
          {
            birthDate: input.orderDir,
          },
          {
            name: OrderDirEnum.ASC,
          },
        ];
        break;
      case StudentOrderByEnum.CLASSNAME:
        orderByClause = [
          {
            studentClass: {
              name: input.orderDir,
            },
          },
          {
            studentClass: {
              grade: input.orderDir,
            },
          },
          {
            name: OrderDirEnum.ASC,
          },
        ];
        break;
      default:
        orderByClause = {
          name: OrderDirEnum.ASC,
        };
    }

    const allRecords = await getAllStudents({ input, prisma: ctx.prisma });
    const pageableRecords = !classIdentifiers.grade
      ? await ctx.prisma.student.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.searchKey,
                },
              },
              {
                uid: {
                  contains: input.searchKey,
                },
              },
              {
                studentClass: {
                  name: {
                    contains: input.searchKey,
                  },
                },
              },
            ],
          },
          include: {
            studentClass: true,
          },
          orderBy: orderByClause,
          skip: (input.page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        })
      : await ctx.prisma.student.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.searchKey,
                },
              },
              {
                uid: {
                  contains: input.searchKey,
                },
              },
              {
                studentClass: {
                  AND: [
                    {
                      name: classIdentifiers.name,
                    },
                    {
                      grade: classIdentifiers.grade,
                    },
                  ],
                },
              },
            ],
          },
          include: {
            studentClass: true,
          },
          orderBy: orderByClause,
          skip: (input.page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
        });
    return {
      pageCount: input.page,
      pageTotal: Math.ceil(allRecords.length / PAGE_SIZE),
      records: pageableRecords,
    };
  });
