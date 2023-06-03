import CustomConfirmation from '@/components/CustomConfirmation';
import CustomModal from '@/components/CustomModal';
import MainLayout from '@/components/MainLayout';
import { trpc } from '@/hooks/trpc';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Pagination,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Student, StudentClass } from '@prisma/client';
import {
  IconChalkboard,
  IconDeviceDesktopSearch,
  IconPlus,
  IconSchool,
  IconSearch,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AddStudentClassForm from './AddStudentClassForm';
import StudentListDetail from './StudentListDetail';

export default function StudentClassPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const isLgMediaScreen = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [debouncedSearchKey] = useDebouncedValue(searchKey, 300);
  const [addClassDisplay, addClassDisclosure] = useDisclosure(false);
  const [editClassDisplay, editClassDisclosure] = useDisclosure(false);
  const [deleteClassDisplay, deleteClassDisclosure] = useDisclosure(false);
  const [studentListDisplay, studentListDisclosure] = useDisclosure(false);
  const [selectedClass, setSelectedClass] = useState<
    StudentClass & { students: Student[] }
  >();

  useEffect(() => {
    const { q } = router.query;
    if (q) setSearchKey(String(q));
  }, [router.query]);

  const { data: studentClasses, refetch } = trpc.getStudentClassesPageable.useQuery({
    searchKey: debouncedSearchKey,
    page: page,
  });
  const editStudentClassMutation = trpc.editStudentClass.useMutation({
    onSettled: () => refetch(),
  });
  const deleteStudentClassMutation = trpc.deleteStudentClass.useMutation({
    onSettled: () => refetch(),
  });

  function submitEdit() {
    if (selectedClass)
      editStudentClassMutation.mutate(
        {
          id: selectedClass.id,
          className: selectedClass.className,
        },
        {
          onSuccess: (res) => {
            notifications.show({
              title: <span className='text-green-6'>Success</span>,
              message: `Saved ${res.className}`,
              color: 'green',
              bg:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[9]
                  : theme.colors.green[0],
            });
            setSelectedClass(undefined);
            editClassDisclosure.close();
          },
          onError: (e) => {
            notifications.show({
              title: <span className='text-red-6'>Failed to Delete Student</span>,
              message: e.message,
              color: 'red',
              bg:
                theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.red[0],
            });
          },
        }
      );
  }
  return (
    <MainLayout className='relative h-full w-full pt-12'>
      <LoadingOverlay visible={!studentClasses} />
      <div className='grid grid-rows-none grid-cols-1 lg:grid-cols-[1fr_0.7fr] px-4 h-full'>
        <Stack spacing='xl' className='mx-auto w-full px-4 max-w-2xl'>
          <Group position='apart'>
            <Group>
              <IconChalkboard />
              <Text fz='xl' fw={500} className='leading-none'>
                Class List
              </Text>
            </Group>
            <Button
              className='hidden sm:block'
              leftIcon={<IconPlus size='1.1rem' />}
              size='xs'
              onClick={addClassDisclosure.open}>
              New
            </Button>
            <ActionIcon
              className='sm:hidden'
              size='md'
              color='blue'
              variant='filled'
              onClick={addClassDisclosure.open}>
              <IconPlus size='1.1rem' />
            </ActionIcon>
          </Group>

          <TextInput
            className='text-xl'
            icon={<IconSearch size={14} />}
            value={searchKey}
            onChange={(e) => {
              router.push({
                query: {
                  q: e.target.value,
                },
              });
              setSearchKey(e.target.value);
            }}
            placeholder='Search class name'
            radius='md'
            size='sm'
          />

          <Stack spacing='none'>
            {studentClasses && studentClasses.records.length > 0 ? (
              <>
                {studentClasses.records.map((studentClass, index) => (
                  <form
                    key={studentClass.id}
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitEdit();
                    }}>
                    <Flex
                      justify='space-between'
                      align='center'
                      className='px-5 py-2 cursor-pointer'
                      sx={{
                        'backgroundColor':
                          selectedClass && selectedClass.id === studentClass.id
                            ? theme.colorScheme == 'dark'
                              ? theme.colors.dark[9]
                              : theme.colors.gray[2]
                            : '',
                        '&:hover': {
                          backgroundColor:
                            theme.colorScheme == 'dark'
                              ? theme.colors.dark[8]
                              : theme.colors.gray[1],
                        },
                        [theme.fn.smallerThan('xs')]: {
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        },
                      }}
                      onClick={() => {
                        setSelectedClass(studentClass);
                        studentListDisclosure.open();
                      }}
                      tabIndex={1}>
                      {selectedClass &&
                      selectedClass.id === studentClass.id &&
                      editClassDisplay ? (
                        <>
                          <TextInput
                            autoFocus
                            className='text-xl'
                            defaultValue={studentClass.className}
                            onChange={(e) =>
                              setSelectedClass({
                                ...studentClass,
                                className: e.target.value,
                              })
                            }
                            onClick={(e) => e.stopPropagation()}
                            radius='md'
                            size='xs'
                          />
                          <Group spacing='none' className='self-end'>
                            <Button
                              type='submit'
                              variant='subtle'
                              size='xs'
                              onClick={(e) => e.stopPropagation()}>
                              Save
                            </Button>
                            <Button
                              variant='subtle'
                              size='xs'
                              color='red'
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSelectedClass(undefined);
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
                              {studentClass.className}
                            </Text>
                            <Text fz='xs' c='dimmed'>
                              {studentClass.students.length} student(s)
                            </Text>
                          </Stack>
                          <Group spacing='none' className='self-end'>
                            <Button
                              variant='subtle'
                              size='xs'
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSelectedClass(studentClass);
                                editClassDisclosure.open();
                              }}>
                              Edit
                            </Button>
                            <Button
                              color='red'
                              variant='subtle'
                              size='xs'
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setSelectedClass(studentClass);
                                deleteClassDisclosure.open();
                              }}>
                              Delete
                            </Button>
                          </Group>
                        </>
                      )}
                    </Flex>
                    {index < studentClasses.records.length - 1 && <Divider />}
                  </form>
                ))}

                <Pagination
                  className='self-end pt-3'
                  value={page}
                  onChange={(e) => setPage(e)}
                  total={studentClasses.pageTotal}
                />
              </>
            ) : (
              <Box className='text-center'>
                <IconDeviceDesktopSearch color='gray' size={40} />
                <Text>No classes found</Text>
              </Box>
            )}
          </Stack>
        </Stack>
        <div className='h-[90%] mx-auto w-full hidden lg:block max-w-lg px-4'>
          <Card withBorder className='p-7 h-full shadow-md rounded-lg'>
            <Group position='apart' className='pb-5'>
              <Group spacing='xs'>
                <IconSchool size={20} />
                <Text fz='md' fw={500}>
                  Student List
                </Text>
              </Group>
              {selectedClass && (
                <Text fz='xs' c='dimmed' className='self-end'>
                  Total {selectedClass.students.length} student(s)
                </Text>
              )}
            </Group>
            <StudentListDetail studentClass={selectedClass} />
          </Card>
        </div>
      </div>
      <CustomModal
        modalTitle={<Text>Add New Class</Text>}
        displayValue={addClassDisplay}
        closeAction={addClassDisclosure.close}>
        <AddStudentClassForm
          submitAction={refetch}
          cancelAction={addClassDisclosure.close}
        />
      </CustomModal>
      {selectedClass && (
        <CustomConfirmation
          displayValue={deleteClassDisplay}
          title='Delete Student Class'
          message={`Are you sure want to delete ${selectedClass.className}?`}
          closeAction={deleteClassDisclosure.close}
          acceptAction={() =>
            deleteStudentClassMutation.mutate(
              {
                id: selectedClass.id,
              },
              {
                onSuccess: (res) => {
                  notifications.show({
                    title: <span className='text-green-6'>Success</span>,
                    message: `Removed "${res.className}"`,
                    color: 'green',
                    bg:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[9]
                        : theme.colors.green[0],
                  });
                  if (res.id === selectedClass.id) setSelectedClass(undefined);
                },
                onError: (e) => {
                  notifications.show({
                    title: (
                      <span className='text-red-6'>Failed to Delete Student Class</span>
                    ),
                    message: e.message,
                    color: 'red',
                    bg:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[9]
                        : theme.colors.red[0],
                  });
                },
              }
            )
          }
        />
      )}
      {isLgMediaScreen && !editClassDisplay && selectedClass && (
        <CustomModal
          modalTitle={
            <Stack spacing='none'>
              <Group spacing='xs'>
                <IconSchool size={20} />
                <Text fz='md' fw={500}>
                  Student List
                </Text>
              </Group>
              {selectedClass && (
                <Text fz='xs' c='dimmed' className='self-end'>
                  Total {selectedClass.students.length} student(s)
                </Text>
              )}
            </Stack>
          }
          displayValue={studentListDisplay}
          closeAction={studentListDisclosure.close}>
          <div className='px-3'>
            <StudentListDetail studentClass={selectedClass} />
          </div>
        </CustomModal>
      )}
    </MainLayout>
  );
}
