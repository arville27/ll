import { trpc } from '@/hooks/trpc';
import { Button, Group, Input, useMantineTheme } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconChalkboard, IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import { useState } from 'react';

export function AddStudentClassForm({
  submitAction,
  cancelAction,
}: {
  submitAction: () => void;
  cancelAction: () => void;
}) {
  const theme = useMantineTheme();
  const [className, setClassName] = useState('');
  const addStudentClassMutation = trpc.addStudentClass.useMutation({
    onSettled: () => {
      submitAction();
      cancelAction();
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addStudentClassMutation.mutate(
            { className },
            {
              onSuccess: (res) => {
                notifications.show({
                  title: <span className='text-green-6'>Success</span>,
                  message: `Added ${res.className}`,
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
                  icon: <IconExclamationCircle />,
                });
              },
            }
          );
        }}>
        <div className='flex gap-2'>
          <Input
            autoFocus
            className='w-full'
            icon={<IconChalkboard />}
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder='Input class name'
          />
          <Button type='submit' variant='gradient' size='sm'>
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
