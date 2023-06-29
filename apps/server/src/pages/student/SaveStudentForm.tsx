import { trpc } from '@/hooks/trpc';
import { addStudentInput } from '@/server/routers/student/addStudent';
import { extractClassAttribute } from '@ll/common/src/utils/extractClassAttribute';
import { Button, Select, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { Student } from '@prisma/client';
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

export default function SaveStudentForm({
  student,
  refetch,
  closeAction,
}: {
  student: Student | undefined;
  refetch: () => void;
  closeAction: () => void;
}) {
  const theme = useMantineTheme();

  const [input, setInput] = useState<StudentInput>(
    student
      ? {
          id: String(student.id),
          uid: student.uid,
          name: student.name,
          birthDate: student.birthDate,
          studentClassId: String(student.studentClassId),
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
        label: `${studentClass.name} ${studentClass.grade ?? ''}`,
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

    if (!student) {
      addStudentMutation.mutate(payloadAdd, {
        onSuccess: (res) => {
          notifications.show({
            title: <span className='text-green-6'>Success</span>,
            message: `Added "${res.name}" to student list`,
            color: 'green',
            bg:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.green[0],
          });
          closeAction();
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
          closeAction();
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
  }

  return (
    <Stack className='gap-8 items-center p-4 sm:px-8'>
      <Text ta='center' fz={20} lh={2} fw={700}>
        {!student ? 'Add New Student' : 'Edit Student Profile'}
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
          maxLength={90}
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
          placeholder='Input class'
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const classIdentifiers = extractClassAttribute(query.trim());
            addStudentClassMutation.mutate(classIdentifiers, {
              onSuccess: (res) => {
                setInput({ ...input, studentClassId: String(res.id) });
                notifications.show({
                  title: <span className='text-green-6'>Success</span>,
                  message: `Added new class "${res.name} ${res.grade ?? ''}" `,
                  color: 'green',
                  bg:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[9]
                      : theme.colors.green[0],
                });
              },
              onError: (e) => {
                const errMsg = JSON.parse(e.message).at(0);
                notifications.show({
                  title: <span className='text-red-6'>Failed to add class</span>,
                  message: errMsg ? errMsg.message : '',
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
          maxLength={10}
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
          maxLength={96}
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
