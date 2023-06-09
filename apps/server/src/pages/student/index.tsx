import CustomConfirmation from '@ll/common/src/CustomConfirmation';
import CustomModal from '@ll/common/src/CustomModal';
import MainLayout from '@/components/MainLayout';
import { StudentOrderByEnum } from '@/enums/orderByEnum';
import { OrderDirEnum } from '@/enums/orderDirEnum';
import { trpc } from '@/hooks/trpc';
import SaveStudentForm from '@/pages/student/SaveStudentForm';
import StudentCard from '@/pages/student/StudentCard';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Student } from '@prisma/client';
import {
  IconDeviceDesktopSearch,
  IconPlus,
  IconSchool,
  IconSearch,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function StudentPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const [searchKey, setSearchKey] = useState('');
  const [debouncedSearchKey] = useDebouncedValue(searchKey, 300);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState<string>(StudentOrderByEnum.NAME);
  const [orderDir, setOrderDir] = useState<string>(OrderDirEnum.ASC);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [openedModal, disclosureModal] = useDisclosure(false);
  const [openedDeleteConfirm, disclosureDeleteConfirm] = useDisclosure(false);

  const { data: studentsCount } = trpc.getStudentsCount.useQuery();

  const { data: students, refetch } = trpc.getStudentsPageable.useQuery(
    {
      searchKey: debouncedSearchKey,
      page: page,
      orderBy: orderBy,
      orderDir: orderDir,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const deleteStudentMutation = trpc.deleteStudent.useMutation({
    onSettled: () => refetch(),
  });

  useEffect(() => {
    const { q, orderby, orderdir } = router.query;
    if (q) setSearchKey(String(q));
    if (orderby) setOrderBy((orderBy) => String(orderby));
    if (orderdir) setOrderDir((orderDir) => String(orderdir));
  }, [router.query]);

  return (
    <MainLayout className='relative h-full w-full pt-12 min-w-0'>
      <LoadingOverlay visible={!students} />
      <Stack spacing='xl' className='mx-auto px-5 max-w-[50rem]'>
        <Group position='apart'>
          <Group>
            <IconSchool />
            <div>
              <Text fz='xl' fw={500} className='leading-none'>
                Student List
              </Text>
              <Text fz='xs' c='dimmed'>
                {studentsCount ?? 0} student(s)
              </Text>
            </div>
          </Group>
          <Button
            className='hidden sm:block'
            leftIcon={<IconPlus size='1.1rem' />}
            size='xs'
            onClick={disclosureModal.open}>
            New
          </Button>
          <ActionIcon
            className='sm:hidden'
            color='blue'
            variant='filled'
            size='md'
            onClick={disclosureModal.open}>
            <IconPlus size='1.1rem' />
          </ActionIcon>
        </Group>

        <Stack spacing='none'>
          <TextInput
            className='text-xl'
            icon={<IconSearch size={14} />}
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
              router.push({
                query: {
                  ...router.query,
                  q: e.target.value,
                },
              });
              setPage(1);
            }}
            placeholder='Search by id, name, class'
            radius='md'
            size='sm'
          />

          <Group className='self-end'>
            <Select
              className='max-w-[7rem]'
              value={orderBy}
              label='Sort by'
              data={[
                { value: StudentOrderByEnum.UID, label: 'ID' },
                { value: StudentOrderByEnum.NAME, label: 'Name' },
                { value: StudentOrderByEnum.BIRTH_DATE, label: 'Birth date' },
                { value: StudentOrderByEnum.CLASSNAME, label: 'Class' },
              ]}
              size='xs'
              onChange={(e) => {
                if (e) {
                  setOrderBy(e);
                  router.push({
                    query: {
                      ...router.query,
                      orderby: e,
                    },
                  });
                  setPage(1);
                }
              }}
            />
            <Select
              className='max-w-[5rem]'
              value={orderDir}
              label='Order'
              data={[
                { value: OrderDirEnum.ASC, label: 'A - Z' },
                { value: OrderDirEnum.DESC, label: 'Z - A' },
              ]}
              size='xs'
              onChange={(e) => {
                if (e) {
                  setOrderDir(e);
                  router.push({
                    query: {
                      ...router.query,
                      orderdir: e,
                    },
                  });
                  setPage(1);
                }
              }}
            />
          </Group>
        </Stack>

        <Stack className='mb-8' spacing='md'>
          {students && students.records.length > 0 ? (
            <>
              {students.records.map((student) => (
                <StudentCard
                  key={student.uid}
                  student={student}
                  editAction={() => {
                    setSelectedStudent(student);
                    disclosureModal.open();
                  }}
                  deleteAction={() => {
                    setSelectedStudent(student);
                    disclosureDeleteConfirm.open();
                  }}
                />
              ))}

              <Pagination
                className='self-end'
                value={page}
                onChange={(e) => setPage(e)}
                total={students.pageTotal}
              />
            </>
          ) : (
            <Box className='text-center'>
              <IconDeviceDesktopSearch color='gray' size={40} />
              <Text>No students found</Text>
            </Box>
          )}
        </Stack>
      </Stack>

      <CustomModal
        displayValue={openedModal}
        closeAction={() => {
          disclosureModal.close();
          setTimeout(() => setSelectedStudent(undefined), 200); // Because of modal transition = 200ms
        }}>
        <SaveStudentForm
          student={selectedStudent}
          refetch={refetch}
          closeAction={() => {
            disclosureModal.close();
            setTimeout(() => setSelectedStudent(undefined), 200); // Because of modal transition = 200ms
          }}
        />
      </CustomModal>

      <CustomConfirmation
        displayValue={openedDeleteConfirm}
        title='Delete Confirmation'
        message='Are you sure want to delete this student?'
        closeAction={disclosureDeleteConfirm.close}
        acceptAction={() => {
          if (selectedStudent) {
            deleteStudentMutation.mutate(
              { id: selectedStudent.id },
              {
                onSuccess: (res) => {
                  notifications.show({
                    title: <span className='text-green-6'>Success</span>,
                    message: `Removed "${res.name}" from student list`,
                    color: 'green',
                    bg:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[9]
                        : theme.colors.green[0],
                  });
                },
                onError: (e) => {
                  notifications.show({
                    title: <span className='text-red-6'>Failed to Delete Student</span>,
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
          }
        }}
      />
    </MainLayout>
  );
}
