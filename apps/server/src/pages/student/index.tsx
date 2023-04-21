import Layout from '@/components/Layout';
import { trpc } from '@/hooks/trpc';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  Card,
  Input,
  TextInput,
  createStyles,
  useMantineColorScheme,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Student } from '@prisma/client';
import {
  IconSchool,
  IconSearch,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  item: {
    '& + &': {
      paddingTop: theme.spacing.sm,
      marginTop: theme.spacing.sm,
      borderTop: `1rem solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },
  },

  switch: {
    '& *': {
      cursor: 'pointer',
    },
  },

  title: {
    lineHeight: 1,
  },
}));

export default function Home() {
  const { classes, theme } = useStyles();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>();
  const [uid, setUid] = useState('');
  const [displayedData, setDisplayedData] = useState<Student[]>([]);
  // const [data, setData] = useState<Student[]>([]);

  const addStudentMutation = trpc.addStudent.useMutation({
    onSettled: () => refetch(),
  });

  const { data, refetch } = trpc.getAllStudent.useQuery();

  useEffect(() => {
    console.log(displayedData);
    if (!displayedData || displayedData.length === 0) filterSearchKey('');
  });

  function submitHandler() {
    if (!birthDate || !name || !uid) {
      return;
    }
    const input = {
      name: name,
      birthDate: birthDate.getTime(),
      uid: uid,
    };

    addStudentMutation.mutateAsync(input);
  }

  function filterSearchKey(keyword: string) {
    // console.log(data);
    if (!data) return;
    if (keyword.length === 0) setDisplayedData(data);
    else
      setDisplayedData(
        data.filter(
          (student) =>
            student.uid.includes(keyword) || student.name.includes(keyword)
        )
      );
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Layout className="flex justify-center">
      <div className="mt-20 flex flex-col gap-5">
        <Group>
          <IconSchool />
          <Stack spacing={5}>
            <Text fz="xl" fw={500} className={classes.title}>
              Student List
            </Text>
          </Stack>
        </Group>
        <Card withBorder radius="md" p="xl" className={classes.card} w={600}>
          <TextInput
            className="text-xl"
            icon={<IconSearch />}
            m="lg"
            onChange={(e) => filterSearchKey(e.target.value)}
            placeholder="Search by uid or name"
            radius="xl"
            size="md"
          />

          <Stack spacing="xs">
            {displayedData.map((student) => (
              <Group
                key={student.uid}
                p="md"
                sx={{
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[9]
                      : theme.colors.blue[0],
                  borderRadius: '8px',
                }}
              >
                <IconUser width={80} height={80} />
                <Stack justify="space-between" spacing="md">
                  <Stack spacing="none">
                    <Text fz="xl" lh="0.7">
                      {student.name}
                    </Text>
                    <Text fz="sm">{student.uid}</Text>
                  </Stack>
                  <Text c="dimmed" fz="0.75rem">
                    {student.birthDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        </Card>
      </div>
      {/* <Box
        w={500}
        mx="auto"
        my={20}
        sx={{
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          padding: '15px',
          borderRadius: '8px',
        }}
      >
        <Text
          ta="center"
          sx={{
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: 'bold',
          }}
        >
          Add New Student
        </Text>
        <Stack
          align="stretch"
          spacing="md"
          sx={{
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <TextInput
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Student ID"
            radius="xl"
            size="xs"
          />
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            radius="xl"
            size="xs"
          />
          <DateInput
            value={birthDate}
            onChange={(e) => setBirthDate(e)}
            placeholder="Birth date"
            radius="xl"
            size="xs"
            maxDate={new Date()}
          />
          <Button
            color={theme.colors.blue[theme.fn.primaryShade()]}
            variant="filled"
            size="sm"
            onClick={submitHandler}
          >
            Submit
          </Button>
        </Stack>
      </Box>

      <Box w="90%" m="auto">
        <Text
          my="lg"
          sx={{
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: 'bold',
          }}
        >
          Student List
        </Text>
        <TextInput
          className="text-xl"
          onChange={(e) => filterSearchKey(e.target.value)}
          placeholder="Search by uid or name"
          radius="xl"
          size="md"
        />
        <Grid grow m={'md'}>
          {displayedData.map((student, index) => (
            <Grid.Col key={student.id} span={3}>
              <Group noWrap spacing="none" h={100}>
                <Center
                  bg={
                    theme.colorScheme === 'dark'
                      ? theme.colors.gray[9]
                      : theme.colors.cyan[8]
                  }
                  h="100%"
                  w={50}
                  sx={{
                    color: 'white',
                    borderRadius: '8px 0 0 8px',
                  }}
                >
                  {index + 1}
                </Center>
                <Stack
                  spacing="none"
                  p="none"
                  sx={{
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[9]
                        : theme.colors.blue[0],
                    borderRadius: '0 8px 8px 0',
                  }}
                >
                  <Text>
                    StudentID : <span>{student.uid}</span>
                  </Text>
                  <Text>
                    Name : <span>{student.name}</span>
                  </Text>
                  <Text>
                    BirthDate :{' '}
                    <span>
                      {student.birthDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </Text>
                </Stack>
              </Group>
            </Grid.Col>
          ))}
        </Grid>
      </Box> */}
    </Layout>
  );
}
