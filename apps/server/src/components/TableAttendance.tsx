import {
  Button,
  ScrollArea,
  Table,
  Text,
  Tooltip,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AttendanceLog, Student, StudentClass } from '@prisma/client';
import { IconTrash } from '@tabler/icons-react';
import * as dfs from 'date-fns';
import { useState } from 'react';
import CustomConfirmation from '@ll/common/src/CustomConfirmation';
import { notifications } from '@mantine/notifications';
import { trpc } from '@/hooks/trpc';

interface TableAttendanceProps {
  data: (AttendanceLog & { student: Student & { studentClass: StudentClass } })[];
  showDate?: boolean;
  tableWidth?: number | string;
  tableHeight?: number | string;
  onDelete: () => void;
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
  onDelete,
}: TableAttendanceProps) {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const [scrolled, setScrolled] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog & { student: Student }>();
  const [deleteConfrimationDisplay, deleteConfirmationDisclosure] = useDisclosure(false);

  const deleteAttendanceLogMutation = trpc.deleteAttendanceLog.useMutation({
    onSettled: () => onDelete(),
  });

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
        <td className='w-fit'>
          {row.student.studentClass.name} {row.student.studentClass.grade}
        </td>
        {showDate && <td className='w-fit'>{dfs.format(row.date, 'HH:mm')}</td>}
        <td>
          <Button
            variant='subtle'
            compact
            size='xs'
            color='red'
            onClick={() => {
              setSelectedLog(row);
              deleteConfirmationDisclosure.open();
            }}>
            <IconTrash size={14} className='mr-2' />
            <Text>Delete</Text>
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <>
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
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
      {selectedLog && (
        <CustomConfirmation
          displayValue={deleteConfrimationDisplay}
          title='Warning Delete Attendance Log'
          message={`Are you sure want to delete ${selectedLog.student.name.toUpperCase()}'s attendance log at ${dfs.format(
            selectedLog.date,
            'HH:mm'
          )}?`}
          acceptAction={() => {
            deleteAttendanceLogMutation.mutate(
              { id: selectedLog.id },
              {
                onSuccess: (res) => {
                  notifications.show({
                    title: <span className='text-green-6'>Success</span>,
                    message: `Removed "${res!.name}" from today's attendance logs`,
                    color: 'green',
                    bg:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[9]
                        : theme.colors.green[0],
                  });
                },
                onError: (e) => {
                  notifications.show({
                    title: (
                      <span className='text-red-6'>Failed to Delete Attendance Log</span>
                    ),
                    message: e.message,
                    color: 'red',
                    bg:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[9]
                        : theme.colors.red[0],
                  });
                },
              }
            );
          }}
          closeAction={deleteConfirmationDisclosure.close}
        />
      )}
    </>
  );
}
