import { trpc } from '@/hooks/trpc';
import { useSearchKeyStore } from '@/store/useSearchKeyStore';
import { useSelectedStudentStore } from '@/store/useSelectedStudent';
import { Button, Select, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import {
  IconCalendarEvent,
  IconChalkboard,
  IconId,
  IconIdBadge,
} from '@tabler/icons-react';
import { useState } from 'react';

class StudentInput {
  id = '';
  uid = '';
  name = '';
  birthDate: Date | null = null;
  studentClassId = '';
}

interface AddStudentPayload {
  uid: string;
  name: string;
  birthDate: number;
  studentClassId: number;
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

  const [input, setInput] = useState<StudentInput>(
    selectedStudent
      ? {
          id: String(selectedStudent.id),
          uid: selectedStudent.uid,
          name: selectedStudent.name,
          birthDate: selectedStudent.birthDate,
          studentClassId: String(selectedStudent.studentClassId),
        }
      : new StudentInput()
  );

  const { data: classes, refetch: classesRefetch } = trpc.getStudentClasses.useQuery();

  const addClassMutation = trpc.addStudentClass.useMutation({
    onSettled: () => {
      // Refetch class list
      classesRefetch();
    },
  });

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

  const classOptions = classes
    ? classes.map((studentClass) => ({
        value: studentClass.id + '',
        label: studentClass.className,
      }))
    : [];

  function submitHandler() {
    if (
      input.uid.length === 0 ||
      input.name.length === 0 ||
      !input.birthDate ||
      !input.studentClassId
    ) {
      notifications.show({
        title: <span className='text-red-6'>Invalid Input</span>,
        message: 'ID, name, or birth date must be filled',
        color: 'red',
        bg: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.red[0],
      });
      return;
    }

    const payloadAdd: AddStudentPayload = {
      ...input,
      birthDate: input.birthDate.getTime(),
      studentClassId: Number(input.studentClassId),
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
      const payloadEdit = { ...payloadAdd, id: Number(input.id) };
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
            title: <span className='text-red-6'>Failed to Add Class</span>,
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
          data-autofocus
          value={input.uid}
          icon={<IconIdBadge size={18} />}
          label='ID'
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
          onChange={(e) => {
            let name = e.target.value;
            setInput({
              ...input,
              name: name,
              uid:
                name && input.birthDate
                  ? `${input.birthDate.getDate()}${input.birthDate.getMonth()}${input.birthDate
                      .getFullYear()
                      .toString()
                      .substring(-2)}${name}`
                  : '',
            });
            console.log(name);
            console.log(input);
          }}
          placeholder='Name'
          radius='md'
          required
          size='sm'
        />
        <Select
          defaultValue={input.studentClassId}
          icon={<IconChalkboard size={18} />}
          label='Class'
          data={classOptions}
          placeholder='Class'
          searchable
          creatable
          clearable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { class: query };
            addClassMutation.mutateAsync(item, {
              onSuccess: () => {
                notifications.show({
                  title: <span className='text-green-6'>Success</span>,
                  message: 'Added new class ',
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
                    <span className='text-red-6'>Failed to add student attendance</span>
                  ),
                  message: e.message,
                  color: 'red',
                  bg:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[9]
                      : theme.colors.red[0],
                });
              },
            });
            return query;
          }}
          onChange={(e) => {
            if (e) setInput({ ...input, studentClassId: e });
          }}
          maxDropdownHeight={160}
        />
        <DateInput
          defaultValue={input.birthDate}
          icon={<IconCalendarEvent size={18} />}
          label='Birth Date'
          maxDate={new Date()}
          onChange={(date) =>
            setInput({
              ...input,
              birthDate: date,
              uid:
                input.name && date
                  ? `${date.getDate()}${date.getMonth()}${date
                      .getFullYear()
                      .toString()
                      .substring(-2)}${input.name}`
                  : '',
            })
          }
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
