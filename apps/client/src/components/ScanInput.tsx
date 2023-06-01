import { Student } from '.prisma/client';
import { trpc } from '@/hooks/trpc';
import { Box, Input, ScrollArea, useMantineTheme } from '@mantine/core';
import { useDebouncedValue, useFocusTrap, useMergedRef } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconHash, IconScan } from '@tabler/icons-react';
import { MutableRefObject, useEffect, useRef } from 'react';

function AutoCompleteItem({
  student,
  index,
  onAction,
}: {
  student: Student;
  index: number;
  onAction: () => void;
}) {
  const theme = useMantineTheme();

  return (
    <Box
      id={`autocomplete-item-${index}`}
      tabIndex={index}
      onClick={onAction}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onAction();
        }
      }}
      className='py-2 px-4 rounded-lg flex justify-between m-1 mb-2 cursor-pointer'
      sx={{
        'backgroundColor':
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        },
        'outlineColor': theme.colors.blue[5],
      }}>
      <div>
        <div>{student.name}</div>
        <Box c='dimmed' className='text-sm flex items-center gap-2'>
          <IconHash size={12} />
          {student.uid}
        </Box>
      </div>
      <div>BPK 7</div>
    </Box>
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
        <ScrollArea className='mt-3 relative h-60 px-6' ref={focusTrapRef}>
          {Boolean(autocompleteData) &&
            autocompleteData.map((student, index) => (
              <AutoCompleteItem
                key={student.id}
                index={index}
                student={student}
                onAction={() => submitStudentUid(student.uid)}
              />
            ))}
        </ScrollArea>
      </form>
    </div>
  );
}
