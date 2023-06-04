import { Student, StudentClass } from '.prisma/client';
import { trpc } from '@/hooks/trpc';
import {
  Autocomplete,
  Badge,
  Box,
  SelectItemProps,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconHash, IconScan } from '@tabler/icons-react';
import { forwardRef, useEffect, useRef } from 'react';

interface ItemProps extends SelectItemProps {
  student: Student & { studentClass: StudentClass };
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ student, ...other }, ref) => {
    return (
      <div ref={ref} {...other} className={`${other.className} flex justify-between`}>
        <Stack className='gap-1'>
          <Text>{student.name}</Text>
          <Box className='text-sm flex items-center gap-1'>
            <IconHash size={14} />
            <Text c='dimmed' fz='xs'>
              {student.uid}
            </Text>
          </Box>
        </Stack>
        <Badge>{student.studentClass.className}</Badge>
      </div>
    );
  }
);

export function ScanInput({
  keyword,
  setKeyword,
  refetch,
}: {
  keyword: string;
  setKeyword: (keyword: string) => void;
  refetch: () => void;
}) {
  const addAttendanceMutation = trpc.attendance.addAttendanceLog.useMutation({
    onSettled: () => refetch(),
  });

  const theme = useMantineTheme();
  const inputRef = useRef(null);
  const [debouncedKeyword] = useDebouncedValue(keyword, 300);
  const { data: autocompleteData } = trpc.student.getStudents.useQuery(
    { searchKey: debouncedKeyword },
    {
      enabled: Boolean(debouncedKeyword),
    }
  );

  useEffect(() => {
    function handleKeypress(e: KeyboardEvent) {
      inputRef.current.focus();
    }

    document.addEventListener('keypress', handleKeypress);

    return () => {
      document.removeEventListener('keypress', handleKeypress);
    };
  }, []);

  function submitStudentUid(studentUid: string) {
    addAttendanceMutation.mutate(
      { uid: studentUid },
      {
        onSuccess: () => {
          notifications.show({
            title: <span className='text-green-6'>Success</span>,
            message: 'Added student attendance ',
            color: 'green',
            bg:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.green[0],
          });
        },
        onError: (e) => {
          notifications.show({
            title: <span className='text-red-6'>Failed to add student attendance</span>,
            message: e.message,
            color: 'red',
            bg: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.red[0],
          });
        },
      }
    );
    setKeyword('');
  }

  return (
    <div className='w-[24rem]'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitStudentUid(keyword);
        }}>
        <Autocomplete
          ref={inputRef}
          value={keyword}
          onChange={(value) => setKeyword(value)}
          radius='xl'
          size='md'
          limit={4}
          icon={<IconScan />}
          onItemSubmit={(item) => submitStudentUid(item.student.uid)}
          itemComponent={AutoCompleteItem}
          placeholder='Student ID'
          dropdownPosition='bottom'
          data={
            autocompleteData
              ? autocompleteData.map((item) => ({
                  student: item,
                  value: item.uid,
                }))
              : []
          }
        />
      </form>
    </div>
  );
}
