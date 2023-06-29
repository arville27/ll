import { trpc } from '@/hooks/trpc';
import CustomConfirmation from '@ll/common/src/CustomConfirmation';
import CustomModal from '@ll/common/src/CustomModal';
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Group,
  ScrollArea,
  SelectItemProps,
  Stack,
  Table,
  Text,
  Tooltip,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AttendanceLog, Student, StudentClass } from '@prisma/client';
import { IconClock, IconHash, IconId, IconPencil, IconTrash } from '@tabler/icons-react';
import * as dfs from 'date-fns';
import { forwardRef, useState } from 'react';

interface TableAttendanceProps {
  data: (AttendanceLog & { student: Student & { studentClass: StudentClass } })[];
  showDate?: boolean;
  tableWidth?: number | string;
  tableHeight?: number | string;
  refetch: () => void;
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

interface ItemProps extends SelectItemProps {
  student: Student & { studentClass: StudentClass };
}

// eslint-disable-next-line react/display-name
const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ student, ...other }, ref) => {
    return (
      <div
        ref={ref}
        {...other}
        className={`${other.className} flex justify-between py-2`}>
        <Stack spacing='none'>
          <Text className='truncate max-w-[16.5rem]'>{student.name}</Text>
          <Box className='text-sm flex items-center gap-1'>
            <IconHash size={12} />
            <Text c='dimmed' fz='xs' className='truncate max-w-[15rem]'>
              {student.uid}
            </Text>
          </Box>
        </Stack>
        <Badge>
          {student.studentClass.name} {student.studentClass.grade}
        </Badge>
      </div>
    );
  }
);

function EditAttendanceLog({
  attendanceLog,
  onSuccess,
}: {
  attendanceLog: AttendanceLog & { student: Student };
  onSuccess: () => void;
}) {
  const theme = useMantineTheme();
  const [logTime, setLogTime] = useState(dfs.format(attendanceLog.date, 'HH:mm'));
  const [studentUid, setStudentUid] = useState(attendanceLog.student.uid);
  const [debouncedKeyword] = useDebouncedValue(studentUid, 300);
  const { data: autocompleteData } = trpc.getStudents.useQuery(
    { searchKey: debouncedKeyword },
    {
      enabled: Boolean(debouncedKeyword),
    }
  );

  const editAttendanceLogMutation = trpc.editAttendanceLog.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log({
          attendanceLog,
          newTime: dfs.parse(logTime, 'HH:mm', new Date()),
          studentUid,
        });

        const studentId = autocompleteData?.find(
          (student) => student.uid === studentUid
        )?.id;

        if (!studentId) return;

        editAttendanceLogMutation.mutate(
          {
            id: attendanceLog.id,
            date: dfs.parse(logTime, 'HH:mm', new Date()),
            studentId,
          },
          {
            onSuccess: (res) => {
              notifications.show({
                title: <span className='text-green-6'>Success</span>,
                message: `Saved log changes: "${res!.student.name}" on ${dfs.format(
                  res.date,
                  'hh:mm'
                )}`,
                color: 'green',
                bg:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[9]
                    : theme.colors.green[0],
              });
              onSuccess();
            },
            onError: (e) => {
              notifications.show({
                title: <span className='text-red-6'>Failed to Edit Attendance Log</span>,
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
      }}>
      <Group className='gap-2 items-center p-1' noWrap>
        <Autocomplete
          label="Student's ID"
          required
          value={studentUid}
          onChange={setStudentUid}
          radius='md'
          size='xs'
          limit={4}
          icon={<IconId size={18} />}
          data={
            autocompleteData
              ? autocompleteData.map((item) => ({
                  student: item,
                  value: item.uid,
                }))
              : []
          }
          itemComponent={AutoCompleteItem}
          placeholder='Student ID'
          dropdownPosition='bottom'
          className='break-words w-full'
        />
        <TimeInput
          value={logTime}
          icon={<IconClock size={18} />}
          label='Attend Time'
          onChange={(e) => setLogTime(e.target.value)}
          placeholder='Select birth date'
          radius='md'
          required
          size='xs'
          w={150}
        />
        <Button
          gradient={{ from: 'indigo', to: 'cyan' }}
          size='xs'
          variant='gradient'
          w={110}
          type='submit'
          className='self-end'>
          Submit
        </Button>
      </Group>
    </form>
  );
}

export function TableAttendance({
  tableWidth = '100%',
  tableHeight = '70vh',
  data,
  showDate,
  refetch,
}: TableAttendanceProps) {
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();
  const [scrolled, setScrolled] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog & { student: Student }>();
  const [deleteConfrimationDisplay, deleteConfirmationDisclosure] = useDisclosure(false);
  const [editLogDisplay, editLogDisclosure] = useDisclosure(false);

  const deleteAttendanceLogMutation = trpc.deleteAttendanceLog.useMutation({
    onSettled: () => refetch(),
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
        <td className='space-x-2'>
          <Button
            variant='subtle'
            compact
            size='xs'
            onClick={() => {
              setSelectedLog(row);
              editLogDisclosure.open();
            }}>
            <IconPencil size={14} className='mr-2' />
            <Text>Edit</Text>
          </Button>
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
        <CustomModal
          modalTitle='Edit attendance log'
          displayValue={editLogDisplay}
          closeAction={editLogDisclosure.close}>
          <EditAttendanceLog
            attendanceLog={selectedLog}
            onSuccess={() => {
              refetch();
              editLogDisclosure.close();
            }}
          />
        </CustomModal>
      )}
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
