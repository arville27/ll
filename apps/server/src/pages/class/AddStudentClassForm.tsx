import { trpc } from '@/hooks/trpc';
import { Button, NumberInput, TextInput, useMantineTheme } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Icon123, IconChalkboard, IconExclamationCircle } from '@tabler/icons-react';
import { useState } from 'react';

export default function AddStudentClassForm({
  submitAction,
  cancelAction,
}: {
  submitAction: () => void;
  cancelAction: () => void;
}) {
  const theme = useMantineTheme();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number | null>(null);
  const addStudentClassMutation = trpc.addStudentClass.useMutation({
    onSettled: () => {
      submitAction();
      cancelAction();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addStudentClassMutation.mutate(
          { name, grade },
          {
            onSuccess: (res) => {
              notifications.show({
                title: <span className='text-green-6'>Success</span>,
                message: `Added ${res.name} ${res.grade ?? ''}`,
                color: 'green',
                bg:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[9]
                    : theme.colors.green[0],
              });
            },
            onError: (e) => {
              notifications.show({
                title: <span className='text-red-6'>Failed to Add Student Class</span>,
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
      <div className='flex gap-2'>
        <TextInput
          data-autofocus
          icon={<IconChalkboard />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
          maw={200}
        />
        <NumberInput
          icon={<Icon123 />}
          value={grade ?? undefined}
          onKeyDown={(e) => {
            const regexr = /^[A-z]$/;
            if (regexr.test(e.key)) e.preventDefault();
          }}
          onChange={(e) => setGrade(e == '' ? null : e)}
          placeholder='Grade'
          w={100}
          min={1}
        />
        <Button type='submit' variant='gradient' size='sm'>
          Submit
        </Button>
      </div>
    </form>
  );
}
