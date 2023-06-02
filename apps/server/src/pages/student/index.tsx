import { AddStudent } from '@/components/AddStudent';
import CustomConfirmation from '@/components/CustomConfirmation';
import CustomModal from '@/components/CustomModal';
import MainLayout from '@/components/MainLayout';
import { StudentCard } from '@/components/StudentCard';
import { StudentOrderByEnum } from '@/enums/orderByEnum';
import { OrderDirEnum } from '@/enums/orderDirEnum';
import { trpc } from '@/hooks/trpc';
import { useSearchKeyStore } from '@/store/useSearchKeyStore';
import { useSelectedStudentStore } from '@/store/useSelectedStudent';
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
import {
  IconCheck,
  IconDeviceDesktopSearch,
  IconPlus,
  IconSchool,
  IconSearch,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function StudentPage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const mounted = useRef(false);

  const { searchKey, setSearchKey } = useSearchKeyStore((state) => state);
  const { setSelectedStudent } = useSelectedStudentStore((state) => state);
  const [debouncedSearchKey] = useDebouncedValue(searchKey, 300);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState<string>(StudentOrderByEnum.NAME);
  const [orderDir, setOrderDir] = useState<string>(OrderDirEnum.ASC);

  const [openedModal, disclosureModal] = useDisclosure(false);
  const [openedDeleteConfirm, disclosureDeleteConfirm] = useDisclosure(false);

  const { data, refetch } = trpc.getStudentsPageable.useQuery(
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

  const selectedStudent = useSelectedStudentStore((state) => state.selectedStudent);

  const deleteStudentMutation = trpc.deleteStudentById.useMutation({
    onSettled: () => refetch(),
  });

  useEffect(() => {
    const { q, orderby, orderdir } = router.query;
    setSearchKey(String(q ?? ''));
    if (orderby) setOrderBy((orderBy) => String(orderby));
    if (orderdir) setOrderDir((orderDir) => String(orderdir));
  }, [router.query]);

  return (
    <MainLayout className='relative h-full w-full pt-12'>
      <LoadingOverlay visible={!data} />
      <Stack spacing='xl' className='mx-auto px-5 max-w-[50rem]'>
        <Group position='apart'>
          <Group>
            <IconSchool />
            <Text fz='xl' fw={500} className='leading-none'>
              Student List
            </Text>
          </Group>
          <Button
            className='hidden sm:block'
            leftIcon={<IconPlus size='1.1rem' />}
            onClick={disclosureModal.open}>
            New
          </Button>
          <ActionIcon
            className='sm:hidden'
            size='lg'
            color='blue'
            variant='filled'
            onClick={disclosureModal.open}>
            <IconPlus size='1.1rem' />
          </ActionIcon>
        </Group>

        <Stack spacing='none'>
          <TextInput
            className='text-xl'
            icon={<IconSearch />}
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
                { value: StudentOrderByEnum.CLASSNAME, label: 'Class name' },
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
          {data && data.records.length > 0 ? (
            <>
              {data.records.map((student) => (
                <StudentCard
                  key={student.uid}
                  data={student}
                  editAction={disclosureModal.open}
                  deleteAction={disclosureDeleteConfirm.open}
                />
              ))}

              <Pagination
                className='self-end'
                value={page}
                onChange={(e) => setPage(e)}
                total={data.pageTotal}></Pagination>
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
          setSelectedStudent(null);
        }}>
        <AddStudent
          refetch={refetch}
          closeAction={() => {
            disclosureModal.close();
            setSelectedStudent(null);
          }}></AddStudent>
      </CustomModal>

      <CustomConfirmation
        displayValue={openedDeleteConfirm}
        title='Delete Confirmation'
        message='Are you sure want to delete this student?'
        closeAction={disclosureDeleteConfirm.close}
        acceptAction={() => {
          if (selectedStudent) {
            deleteStudentMutation.mutateAsync(
              { id: selectedStudent.id },
              {
                onSuccess: (res) => {
                  notifications.show({
                    title: <span className='text-green-6'>Success</span>,
                    message: `Removed "${res.name}" from student list`,
                    color: 'green',
                    bg: theme.colors.green[0],
                    icon: <IconCheck />,
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
