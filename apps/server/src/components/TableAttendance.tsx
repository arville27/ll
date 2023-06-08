import { ScrollArea, Table, Tooltip, createStyles, Text } from '@mantine/core';
import { AttendanceLog, Student, StudentClass } from '@prisma/client';
import * as dfs from 'date-fns';
import { useState } from 'react';

interface TableAttendanceProps {
  data: (AttendanceLog & { student: Student & { studentClass: StudentClass } })[];
  showDate?: boolean;
  tableWidth?: number | string;
  tableHeight?: number | string;
}

const useStyles = createStyles((theme) => ({
  header: {
    'position': 'sticky',
    'top': 0,
    'backgroundColor': theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    'transition': 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export function TableAttendance({
  tableWidth = '100%',
  tableHeight = '70vh',
  data,
  showDate,
}: TableAttendanceProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row, index) => {
    return (
      <tr key={row.id}>
        <td className='w-fit'>{index + 1}</td>
        <td className='w-fit whitespace-nowrap'>{dfs.format(row.date, 'HH:mm')}</td>
        <td className='w-fit'>
          <Tooltip
            position='top-start'
            label={`#${row.student.uid}`}
            classNames={{
              tooltip: 'break-words whitespace-normal max-w-3/5',
            }}>
            <Text className='truncate max-w-[12rem]'>#{row.student.uid}</Text>
          </Tooltip>
        </td>
        <td className='w-fit'>
          <Tooltip
            position='top-start'
            label={row.student.name}
            classNames={{
              tooltip: 'break-words whitespace-normal max-w-3/5',
            }}>
            <div className='line-clamp-1 '>
              <Text className='truncate max-w-[12rem]'>{row.student.name}</Text>
            </div>
          </Tooltip>
        </td>
        <td className='w-fit'>{row.student.studentClass.className}</td>
        {showDate && <td className='w-fit'>{dfs.format(row.date, 'HH:mm')}</td>}
      </tr>
    );
  });

  return (
    <ScrollArea
      sx={{ height: tableHeight, paddingInline: '20px' }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table highlightOnHover verticalSpacing='xs' sx={{ width: tableWidth }}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th></th>
            <th className='whitespace-nowrap'>Clock in</th>
            <th>ID</th>
            <th>{"Student's name"}</th>
            <th>{"Student's class"}</th>
            {showDate && <th>Date</th>}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
