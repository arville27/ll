import { trpc } from '@/hooks/trpc';
import {
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Student, StudentClass } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function ClassContent({
  index,
  studentClass,
  totalClass,
  isUpgrading,
  isSelected,
  onEdit,
  onSelect,
  onDeleteClick,
}: {
  index: number;
  studentClass: StudentClass & { students: Student[] };
  totalClass: number;
  isUpgrading: boolean;
  isSelected: boolean;
  onEdit: () => void;
  onSelect: () => void;
  onDeleteClick: () => void;
}) {
  const theme = useMantineTheme();
  const [editClassDisplay, editClassDisclosure] = useDisclosure(false);
  const [currentClass, setCurrentClass] = useState<
    StudentClass & { students: Student[] }
  >(studentClass);

  useEffect(() => {
    if (isUpgrading) editClassDisclosure.close();
  }, [isUpgrading, editClassDisclosure]);

  useEffect(() => {
    setCurrentClass(studentClass);
  }, [studentClass]);

  const editStudentClassMutation = trpc.editStudentClass.useMutation({
    onSettled: onEdit,
  });
  function submitEdit() {
    if (!currentClass.grade) return;
    editStudentClassMutation.mutate(
      {
        id: currentClass.id,
        name: currentClass.name,
        grade: currentClass.grade,
      },
      {
        onSuccess: (res) => {
          notifications.show({
            title: <span className='text-green-6'>Success</span>,
            message: `Saved ${res.name} ${res.grade ?? ''}`,
            color: 'green',
            bg:
              theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.green[0],
          });
          //   setSelectedClass(undefined);
          editClassDisclosure.close();
        },
        onError: (e) => {
          notifications.show({
            title: <span className='text-red-6'>Failed to Delete Student</span>,
            message: e.message,
            color: 'red',
            bg: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.red[0],
          });
        },
      }
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitEdit();
      }}>
      <Flex
        justify='space-between'
        align='center'
        className='px-5 py-2 cursor-pointer'
        sx={{
          'backgroundColor': isSelected
            ? theme.colorScheme == 'dark'
              ? theme.colors.dark[9]
              : theme.colors.gray[2]
            : '',
          '&:hover': {
            backgroundColor:
              theme.colorScheme == 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
          },
          [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
          },
        }}
        onClick={onSelect}
        tabIndex={1}>
        {editClassDisplay && !isUpgrading ? (
          <>
            <Group>
              <TextInput
                autoFocus
                className='text-xl'
                defaultValue={currentClass.name}
                label='Class'
                onChange={(e) =>
                  setCurrentClass({
                    ...currentClass,
                    name: e.target.value,
                  })
                }
                onClick={(e) => e.stopPropagation()}
                radius='md'
                size='xs'
              />
              <NumberInput
                autoFocus
                className='text-xl'
                defaultValue={currentClass.grade ?? undefined}
                label='Grade'
                onChange={(e) => {
                  if (e)
                    setCurrentClass({
                      ...currentClass,
                      grade: e,
                    });
                }}
                onClick={(e) => e.stopPropagation()}
                radius='md'
                size='xs'
                w={70}
              />
            </Group>
            <Group spacing='none' className='self-end'>
              <Button
                type='submit'
                variant='subtle'
                radius='md'
                size='xs'
                compact
                onClick={(e) => e.stopPropagation()}>
                Save
              </Button>
              <Button
                variant='subtle'
                radius='md'
                size='xs'
                compact
                color='red'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  editClassDisclosure.close();
                }}>
                Cancel
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Stack spacing='none'>
              <Text fz='sm' fw={600}>
                {currentClass.name} {currentClass.grade}
              </Text>
              <Text fz='xs' c='dimmed'>
                {currentClass.students.length} student(s)
              </Text>
            </Stack>
            <Group spacing='none' className='self-end items-end'>
              {isUpgrading ? (
                <>
                  {!currentClass.grade ? (
                    <Text fz='xs' fw={600} c='dimmed'>
                      not changed
                    </Text>
                  ) : (
                    <>
                      <Text fz='xs' px='xs'>
                        {'upgrade to '}
                      </Text>
                      <Text fz='sm' fw={600} color='green'>
                        {` ${currentClass.name} ${currentClass.grade + 1}`}
                      </Text>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant='subtle'
                    radius='md'
                    size='xs'
                    compact
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      editClassDisclosure.open();
                    }}>
                    Edit
                  </Button>
                  <Button
                    color='red'
                    variant='subtle'
                    radius='md'
                    size='xs'
                    compact
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onDeleteClick();
                    }}>
                    Delete
                  </Button>
                </>
              )}
            </Group>
          </>
        )}
      </Flex>
      {index < totalClass - 1 && <Divider />}
    </form>
  );
}
