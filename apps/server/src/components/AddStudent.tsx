import { trpc } from '@/hooks/trpc';
import { useSearchKeyStore } from '@/store/useSearchKeyStore';
import { useSelectedStudentStore } from '@/store/useSelectedStudent';
import { Button, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconCalendarEvent, IconCheck, IconId, IconIdBadge } from '@tabler/icons-react';
import { useState } from 'react';

class StudentInput {
  id: number | undefined;
  uid = '';
  name = '';
  birthDate: Date | null = null;
}

interface Payload {
  id?: number;
  uid: string;
  name: string;
  birthDate: number;
}

export function AddStudent({
  refetch,
  closeAction,
}: {
  refetch: () => void;
  closeAction: () => void;
}) {
  const theme = useMantineTheme();

  const setSearchKey = useSearchKeyStore((state) => state.setSearchKey);
  const selectedStudent = useSelectedStudentStore((state) => state.selectedStudent);
  const setSelectedStudent = useSelectedStudentStore((state) => state.setSelectedStudent);

  const [input, setInput] = useState<StudentInput>(
    selectedStudent ? { ...selectedStudent } : new StudentInput()
  );

  const addStudentMutation = trpc.addStudent.useMutation({
    onSettled: () => {
      // Reset input and search bar value
      setSearchKey('');

      // Refetch student list
      refetch();
    },
  });

  const editStudentMutation = trpc.editStudent.useMutation({
    onSettled: () => {
      // Reset input and search bar value
      setSearchKey('');

      // Refetch student list
      refetch();
    },
  });

  function submitHandler() {
    if (input.uid.length === 0 || input.name.length === 0 || !input.birthDate) {
      notifications.show({
        title: <span className='text-red-6'>Invalid Input</span>,
        message: 'UID, name, or birth date must be filled',
        color: 'red',
        bg: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.red[0],
      });
      return;
    }

    const payloadAdd: Payload = {
      ...input,
      birthDate: input.birthDate.getTime(),
    };

    if (!selectedStudent) {
      addStudentMutation.mutateAsync(payloadAdd, {
        onSuccess: (res) => {
          notifications.show({
            title: <span className='text-green-6'>Success</span>,
            message: `Added "${res.name}" to student list`,
            color: 'green',
            bg:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.green[0],
          });
        },
        onError: (e) => {
          notifications.show({
            title: <span className='text-red-6'>Failed to Add Student</span>,
            message: e.message,
            color: 'red',
            bg: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.red[0],
          });
        },
      });
    } else if (input.id) {
      const payloadEdit = { ...payloadAdd, id: input.id };
      editStudentMutation.mutateAsync(payloadEdit, {
        onSuccess: () => {
          notifications.show({
            title: <span className='text-green-6'>Success</span>,
            message: 'Saved student profile',
            color: 'green',
            bg:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.green[0],
          });
        },
        onError: (e) => {
          notifications.show({
            title: <span className='text-red-6'>Failed to Edit Student</span>,
            message: e.message,
            color: 'red',
            bg: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.red[0],
          });
        },
      });
    }

    closeAction();
  }

  return (
    <Stack className='gap-8 items-center p-4 sm:px-8'>
      <Text ta='center' fz={20} lh={2} fw={700}>
        {!selectedStudent ? 'Add New Student' : 'Edit Student Profile'}
      </Text>

      <Stack align='stretch' spacing='md' w='100%'>
        <TextInput
          data-autoFocus
          defaultValue={input.uid}
          icon={<IconIdBadge size={18} />}
          label='UID'
          onChange={(e) => setInput({ ...input, uid: e.target.value })}
          placeholder='Student ID'
          radius='md'
          required
          size='sm'
        />
        <TextInput
          defaultValue={input.name}
          icon={<IconId size={18} />}
          label='Name'
          onChange={(e) => setInput({ ...input, name: e.target.value })}
          placeholder='Name'
          radius='md'
          required
          size='sm'
        />
        <DateInput
          defaultValue={input.birthDate}
          icon={<IconCalendarEvent size={18} />}
          label='Birth Date'
          maxDate={new Date()}
          onChange={(e) => setInput({ ...input, birthDate: e })}
          placeholder='Birth Date'
          radius='md'
          required
          size='sm'
        />
      </Stack>

      <Button
        gradient={{ from: 'indigo', to: 'cyan' }}
        size='sm'
        variant='gradient'
        w={150}
        onClick={submitHandler}>
        Submit
      </Button>
    </Stack>
  );
}
