import { StudentOrderByEnum } from '@/enums/orderByEnum';
import { OrderDirEnum } from '@/enums/orderDirEnum';
import { z } from 'zod';
import { procedure } from '../../trpc';

export const getStudentsSchema = z.object({
  page: z.number(),
  searchKey: z.string(),
  orderBy: z.string(),
  orderDir: z.string(),
});

export type getStudentsInput = z.infer<typeof getStudentsSchema>;

const PAGE_SIZE = 10;

export const getStudentsProcedure = procedure
  .input(getStudentsSchema)
  .query(async ({ input, ctx }) => {
    input.searchKey = input.searchKey ?? '';
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
              className: input.orderDir,
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

    const getAll = await ctx.prisma.student.findMany({
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
              className: {
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
    });

    const getByPage = await ctx.prisma.student.findMany({
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
              className: {
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
      skip: PAGE_SIZE * (input.page - 1),
      take: PAGE_SIZE,
    });

    const startIndex = PAGE_SIZE * (input.page - 1);
    return {
      pageCount: input.page,
      pageTotal: Math.ceil(getAll.length / PAGE_SIZE),
      records: getByPage,
    };
  });
