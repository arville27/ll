import { trpc } from '@/hooks/trpc';
import { addStudentInput } from '@/server/routers/studentProc/addStudent';
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
import format from 'date-fns/format';
import { useState } from 'react';

class StudentInput {
  id = '';
  uid = '';
  name = '';
  birthDate: Date | null = null;
  studentClassId = '';
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

  const { data: classes, refetch: classesRefetch } = trpc.getStudentClasses.useQuery({});

  const addStudentClassMutation = trpc.addStudentClass.useMutation({
    onSettled: () => {
      // Refetch class list
      classesRefetch();
    },
  });

  const addStudentMutation = trpc.addStudent.useMutation({
    onSettled: () => {
      // Refetch student list
      refetch();
    },
  });

  const editStudentMutation = trpc.editStudent.useMutation({
    onSettled: () => {
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

    const payloadAdd: addStudentInput = {
      ...input,
      birthDate: input.birthDate.getTime(),
      studentClassId: Number(input.studentClassId),
    };

    if (!selectedStudent) {
      addStudentMutation.mutate(payloadAdd, {
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
      editStudentMutation.mutate(payloadEdit, {
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
          value={input.name}
          icon={<IconId size={18} />}
          label='Name'
          onChange={(e) => {
            let name = e.target.value;
            setInput({
              ...input,
              name,
              uid:
                name && input.birthDate
                  ? `${format(input.birthDate, 'ddMMyy')}${name.split(' ')[0]}`
                  : '',
            });
          }}
          placeholder='Input name'
          radius='md'
          required
          size='sm'
        />
        <DateInput
          value={input.birthDate}
          icon={<IconCalendarEvent size={18} />}
          label='Birth Date'
          maxDate={new Date()}
          onChange={(birthDate) =>
            setInput({
              ...input,
              birthDate,
              uid:
                input.name && birthDate
                  ? `${format(birthDate, 'ddMMyy')}${input.name.split(' ')[0]}`
                  : '',
            })
          }
          placeholder='Select birth date'
          radius='md'
          required
          size='sm'
        />
        <Select
          value={input.studentClassId}
          icon={<IconChalkboard size={18} />}
          label='Class'
          data={classOptions}
          placeholder='Select class'
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { className: query };
            addStudentClassMutation.mutate(item, {
              onSuccess: (res) => {
                setInput({ ...input, studentClassId: String(res.id) });
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
          required
        />
        <TextInput
          value={input.uid}
          icon={<IconIdBadge size={18} />}
          label='ID'
          description='Notes : Editable'
          onChange={(e) => setInput({ ...input, uid: e.target.value })}
          placeholder='Autogenerate ID'
          radius='md'
          required
          size='sm'
          inputWrapperOrder={['label', 'input', 'description', 'error']}
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
