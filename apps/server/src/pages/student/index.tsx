import { AddStudent } from '@/components/AddStudent';
import CustomConfirmation from '@/components/CustomConfirmation';
import CustomModal from '@/components/CustomModal';
import MainLayout from '@/components/MainLayout';
import { StudentCard } from '@/components/StudentCard';
import { trpc } from '@/hooks/trpc';
import { useSearchKeyStore } from '@/store/useSearchKeyStore';
import { useSelectedStudentStore } from '@/store/useSelectedStudent';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
  LoadingOverlay,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconPlus, IconSchool, IconSearch } from '@tabler/icons-react';

export default function StudentPage() {
  const theme = useMantineTheme();

  const searchKey = useSearchKeyStore((state) => state.searchKey);
  const setSearchKey = useSearchKeyStore((state) => state.setSearchKey);
  const setSelectedStudent = useSelectedStudentStore((state) => state.setSelectedStudent);

  const [openedModal, disclosureModal] = useDisclosure(false);
  const [openedDeleteConfirm, disclosureDeleteConfirm] = useDisclosure(false);

  const [debouncedSearchKey] = useDebouncedValue(searchKey, 300);

  const { data, refetch } = trpc.getStudents.useQuery(
    {
      searchKey: debouncedSearchKey,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const selectedStudent = useSelectedStudentStore((state) => state.selectedStudent);

  const deleteStudentMutation = trpc.deleteStudentById.useMutation({
    onSettled: () => refetch(),
  });

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

        <TextInput
          className='text-xl'
          icon={<IconSearch />}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
          placeholder='Search by id or name'
          radius='xl'
          size='md'
        />

        <Stack className='mb-8' spacing='md'>
          {data && data.length > 0 ? (
            data.map((student) => (
              <StudentCard
                key={student.uid}
                data={student}
                refetch={refetch}
                editAction={disclosureModal.open}
                deleteAction={disclosureDeleteConfirm.open}
              />
            ))
          ) : (
            <Text>No Student</Text>
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
