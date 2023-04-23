import { AddStudent } from '@/components/AddStudent';
import CustomModal from '@/components/CustomModal';
import { StudentCard } from '@/components/StudentCard';
import { trpc } from '@/hooks/trpc';
import { useSearchKeyStore } from '@/store/useSearchKeyStore';
import { useSelectedStudentStore } from '@/store/useSelectedStudent';
import { Layout } from '@ll/common';
import { Button, Card, Group, Stack, Text, TextInput, createStyles } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSchool, IconSearch } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  title: {
    lineHeight: 1,
  },
}));

export default function StudentPage() {
  const { classes } = useStyles();

  const searchKey = useSearchKeyStore((state) => state.searchKey);
  const setSearchKey = useSearchKeyStore((state) => state.setSearchKey);
  const setSelectedStudent = useSelectedStudentStore((state) => state.setSelectedStudent);

  const [opened, { open, close }] = useDisclosure(false);

  const [debouncedSearchKey] = useDebouncedValue(searchKey, 300);

  const { data, refetch } = trpc.student.getStudentBySearchKey.useQuery(
    {
      searchKey: debouncedSearchKey,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const selectedStudent = useSelectedStudentStore((state) => state.selectedStudent);

  return (
    <Layout
      navbarProp={{
        links: [
          { label: 'Home', link: '/' },
          { label: 'Students', link: '/student' },
          { label: 'Attendance Logs', link: '/attendance' },
        ],
      }}
      className="flex justify-center">
      <Stack className="w-[70%] mt-20 ">
        <Group position="apart">
          <Group>
            <IconSchool />
            <Text fz="xl" fw={500} className={classes.title}>
              Student List
            </Text>
          </Group>
          <Button leftIcon={<IconPlus size="1.2rem" />} onClick={open}>
            New
          </Button>
        </Group>

        <Card withBorder radius="md" p="xl" className={classes.card} w="100%">
          <TextInput
            className="text-xl"
            icon={<IconSearch />}
            m="lg"
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            placeholder="Search by uid or name"
            radius="xl"
            size="md"
          />

          <Stack spacing="xs" className="flex-col-reverse">
            {data &&
              data.map((student) => (
                <StudentCard
                  key={student.uid}
                  data={student}
                  refetch={refetch}
                  editAction={open}
                />
              ))}
          </Stack>
        </Card>
      </Stack>
      <CustomModal
        displayValue={opened}
        closeAction={() => {
          setSelectedStudent(null);
          close();
        }}>
        <AddStudent refetch={refetch}></AddStudent>
      </CustomModal>
    </Layout>
  );
}
