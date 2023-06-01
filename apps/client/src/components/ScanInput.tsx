import { Student } from '.prisma/client';
import { trpc } from '@/hooks/trpc';
import {
  Badge,
  Box,
  Input,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useFocusTrap } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconHash, IconScan } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

function AutoCompleteItem({
  student,
  onAction,
}: {
  student: Student;
  onAction: () => void;
}) {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
      onClick={onAction}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onAction();
        }
      }}
      className='py-2 px-4 rounded-lg flex justify-between m-1 mb-2 w-[95%]'
      sx={{
        'backgroundColor':
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
        'outlineColor': theme.colors.blue[5],
      }}>
      <Stack className='gap-1'>
        <div>{student.name}</div>
        <Box className='text-sm flex items-center gap-1'>
          <IconHash size={14} />
          <Text c='dimmed' fz='xs'>
            {student.uid}
          </Text>
        </Box>
      </Stack>
      <Badge>BPK 7</Badge>
    </UnstyledButton>
  );
}

export function ScanInput({
  keyword,
  setKeyword,
  refetch,
}: {
  keyword: string;
  setKeyword: (keyword: string) => void;
  refetch: () => void;
}) {
  const focusTrapRef = useFocusTrap(true);
  const addAttendanceMutation = trpc.addAttendanceLog.useMutation({
    onSettled: () => refetch(),
  });

  const theme = useMantineTheme();
  const inputRef = useRef(null);
  const [debouncedKeyword] = useDebouncedValue(keyword, 300);
  const { data: autocompleteData } = trpc.getStudents.useQuery(
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
        <Input
          ref={inputRef}
          value={keyword}
          autoComplete='none'
          onChange={(e) => setKeyword(e.target.value)}
          icon={<IconScan />}
          placeholder='Student ID'
          radius='xl'
          size='md'
        />
        <ScrollArea className='mt-3 relative h-60 px-2' ref={focusTrapRef}>
          {Boolean(autocompleteData) &&
            autocompleteData.map((student, index) => (
              <AutoCompleteItem
                key={student.id}
                student={student}
                onAction={() => submitStudentUid(student.uid)}
              />
            ))}
        </ScrollArea>
      </form>
    </div>
  );
}
