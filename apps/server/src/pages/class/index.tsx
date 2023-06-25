import CustomConfirmation from '@ll/common/src/CustomConfirmation';
import CustomModal from '@ll/common/src/CustomModal';
import MainLayout from '@/components/MainLayout';
import { trpc } from '@/hooks/trpc';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Pagination,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Student, StudentClass } from '@prisma/client';
import {
  IconArrowAutofitUp,
  IconChalkboard,
  IconDeviceDesktopSearch,
  IconPlus,
  IconSchool,
  IconSearch,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AddStudentClassForm from './AddStudentClassForm';
import ClassContent from './ClassContent';
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
  const [upgradeClassDisplay, upgradeClassDisclosure] = useDisclosure(false);
  const [selectedClass, setSelectedClass] = useState<
    StudentClass & { students: Student[] }
  >();
  const [isUpgrade, setIsUpgrade] = useState(false);

  useEffect(() => {
    const { q } = router.query;
    if (q) setSearchKey(String(q));
  }, [router.query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchKey]);

  const { data: studentClasses, refetch } = trpc.getStudentClassesPageable.useQuery({
    searchKey: debouncedSearchKey,
    page: page,
  });
  const deleteStudentClassMutation = trpc.deleteStudentClass.useMutation({
    onSettled: () => {
      setPage(1);
      refetch();
    },
  });
  const upgradeStudentClassesMutation = trpc.upgradeStudentClasses.useMutation({
    onSettled: () => refetch(),
  });

  return (
    <MainLayout className='relative h-full w-full pt-12'>
      <LoadingOverlay visible={!studentClasses} />
      <div className='grid grid-rows-none grid-cols-1 lg:grid-cols-[1fr_0.7fr] px-4 h-full'>
        <Stack spacing='xl' className='mx-auto w-full px-4 mb-8 max-w-2xl'>
          <Group position='apart'>
            <Group>
              <IconChalkboard />
              <Text fz='xl' fw={500} className='leading-none'>
                Class List
              </Text>
            </Group>
            <Group spacing='sm'>
              <Button
                className='hidden sm:block'
                leftIcon={<IconArrowAutofitUp size='1.1rem' />}
                size='xs'
                color={isUpgrade ? 'green' : 'red'}
                onClick={() => {
                  if (isUpgrade) upgradeClassDisclosure.open();
                  else {
                    router.push({
                      query: {
                        q: '',
                      },
                    });
                    setSearchKey('');
                    setIsUpgrade(() => true);
                  }
                }}
                disabled={editClassDisplay}>
                {isUpgrade ? 'Confirm' : 'Upgrade Class'}
              </Button>
              <Tooltip
                className='sm:hidden'
                label={`
                ${isUpgrade ? 'Confirm' : 'Upgrade Class'}`}>
                <ActionIcon
                  size='md'
                  color={isUpgrade ? 'green' : 'red'}
                  variant='filled'
                  onClick={() => {
                    if (isUpgrade) upgradeClassDisclosure.open();
                    else setIsUpgrade(() => true);
                  }}>
                  <IconArrowAutofitUp size='1.1rem' />
                </ActionIcon>
              </Tooltip>
              <Button
                className='hidden sm:block'
                leftIcon={<IconPlus size='1.1rem' />}
                size='xs'
                onClick={addClassDisclosure.open}>
                New
              </Button>
              <Tooltip className='sm:hidden' label='New'>
                <ActionIcon
                  size='md'
                  color='blue'
                  variant='filled'
                  onClick={addClassDisclosure.open}>
                  <IconPlus size='1.1rem' />
                </ActionIcon>
              </Tooltip>
            </Group>
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
            placeholder='Search class'
            radius='md'
            size='sm'
          />

          <Stack spacing='none'>
            {studentClasses && studentClasses.records.length > 0 ? (
              <>
                {studentClasses.records.map((studentClass, index) => (
                  <ClassContent
                    key={index}
                    index={index}
                    studentClass={studentClass}
                    totalClass={studentClasses.records.length}
                    isUpgrading={isUpgrade}
                    isSelected={Boolean(
                      selectedClass && selectedClass.id === studentClass.id
                    )}
                    onEdit={refetch}
                    onSelect={() => {
                      setSelectedClass(studentClass);
                      studentListDisclosure.open();
                    }}
                    onDeleteClick={() => {
                      setSelectedClass(studentClass);
                      deleteClassDisclosure.open();
                    }}
                  />
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
        <div className='h-11/12 mx-auto w-full hidden lg:block max-w-lg px-4'>
          <Card withBorder className='h-full shadow-md rounded-lg p-5'>
            <Group position='apart' className='mb-5'>
              <Group spacing='xs'>
                <IconSchool size={20} />
                <Text fz='md' fw={500}>
                  {selectedClass
                    ? `${selectedClass.name} ${selectedClass.grade ?? ''} `
                    : ''}
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
          title='Warning Delete Student Class'
          message={`All class data and its students records will be REMOVED PERMANENTLY. Proceed to remove "${
            selectedClass.name
          } ${selectedClass.grade ?? ''}"?`}
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
                    message: `Removed "${res.name} ${res.grade ?? ''}"`,
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
                  {selectedClass.name} {selectedClass.grade}
                  Student List
                </Text>
              </Group>
              {selectedClass && (
                <Text fz='xs' c='dimmed' className='ml-8'>
                  Total {selectedClass.students.length} student(s)
                </Text>
              )}
            </Stack>
          }
          displayValue={studentListDisplay}
          closeAction={studentListDisclosure.close}>
          <div className='px-1 sm:px-2'>
            <StudentListDetail studentClass={selectedClass} />
          </div>
        </CustomModal>
      )}
      {studentClasses && (
        <CustomConfirmation
          displayValue={upgradeClassDisplay}
          title='Warning Upgrade All Classes'
          message={`Upgrade class will increase grade by one to every class without exception and can't be revert. Proceed to upgrade student class as shown in the page?`}
          closeAction={() => {
            upgradeClassDisclosure.close();
            setIsUpgrade(false);
          }}
          acceptAction={() =>
            upgradeStudentClassesMutation.mutate(undefined, {
              onSuccess: (res) => {
                notifications.show({
                  title: <span className='text-green-6'>Success</span>,
                  message: `${res.count} classes is upgraded`,
                  color: 'green',
                  bg:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[9]
                      : theme.colors.green[0],
                });
                setIsUpgrade(false);
                refetch();
              },
              onError: (e) => {
                notifications.show({
                  title: (
                    <span className='text-red-6'>Failed to Upgrade All Classes</span>
                  ),
                  message: e.message,
                  color: 'red',
                  bg:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[9]
                      : theme.colors.red[0],
                });
              },
            })
          }
        />
      )}
    </MainLayout>
  );
}
