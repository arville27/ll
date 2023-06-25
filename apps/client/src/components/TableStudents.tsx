import { AttendanceLog, Student, StudentClass } from '.prisma/client';
import { trpc } from '@/hooks/trpc';
import CustomConfirmation from '@ll/common/src/CustomConfirmation';
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
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import * as dfs from 'date-fns';
import { useState } from 'react';

interface TableStudentsProps {
  data: (AttendanceLog & { student: Student & { studentClass: StudentClass } })[];
  onDelete: () => void;
}

const useStyles = createStyles((theme) => ({
  header: {
    'position': 'sticky',
    'top': 0,
    'backgroundColor':
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
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

  contentLimit: {
    maxWidth: 135,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export function TableStudents({ data, onDelete }: TableStudentsProps) {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const [scrolled, setScrolled] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog & { student: Student }>();
  const [deleteConfrimationDisplay, deleteConfirmationDisclosure] = useDisclosure(false);

  const deleteAttendanceLogMutation = trpc.deleteAttendanceLog.useMutation({
    onSettled: () => onDelete(),
  });

  const rows = data.map((row, i) => {
    return (
      <tr key={i}>
        <td className='max-w-[135px]'>
          <Tooltip
            position='top-start'
            label={
              <>
                <Text className='break-words'>{row.student.name}</Text>
                <Text fz='xs' c='dimmed' className='break-words'>
                  #{row.student.name}
                </Text>
              </>
            }
            classNames={{
              tooltip: 'break-word whitespace-normal max-w-4/5',
            }}>
            <div className='truncate'>{row.student.name}</div>
          </Tooltip>
        </td>
        <td
          className={
            classes.contentLimit
          }>{`${row.student.studentClass.name} ${row.student.studentClass.grade}`}</td>
        <td className={classes.contentLimit}>{dfs.format(row.date, 'HH:mm')}</td>
        <td className='text-center'>
          <Button
            color='red'
            size='xs'
            compact
            onClick={() => {
              setSelectedLog(row);
              deleteConfirmationDisclosure.open();
            }}>
            <IconTrash size={14} />
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <>
      <ScrollArea
        sx={{ height: '100%', paddingRight: 25 }}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table
          sx={{ minWidth: 300, maxWidth: 700 }}
          verticalSpacing='xs'
          highlightOnHover>
          <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <tr>
              <th>Student's name</th>
              <th>Student's class</th>
              <th>Clock In</th>
              <th>Action</th>
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
