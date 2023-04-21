import Layout from '@/components/Layout';
import { TableStudents } from '@/components/TableStudents';
import { Input, Card, Group, Text, Stack, useMantineTheme } from '@mantine/core';
import { IconList, IconScan } from '@tabler/icons-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { trpc } from '@/hooks/trpc';

function App() {
  const [student, setStudent] = useState('');
  const [data, setData] = useState([]);
  const inputRef = useRef(null);
  const theme = useMantineTheme();
  const addAttendanceMutation = trpc.addAttendanceLog.useMutation();

  useEffect(() => {
    function handleKeypress() {
      inputRef.current.focus();
    }

    document.addEventListener('keypress', handleKeypress);

    return () => {
      document.removeEventListener('keypress', handleKeypress);
    };
  }, []);

  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await addAttendanceMutation.mutateAsync({ uid: student });
    // setData([{ name: student, clockIn: new Date().getTime() }, ...data]);
    setStudent('');
  }

  return (
    <Layout>
      <div className="grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[1fr_0.6fr] h-full">
        <Stack justify="center" align="center">
          <IconScan opacity={1} width={192} height={192} />
          <div className="w-[24rem]">
            <form onSubmit={submitHandler}>
              <Input
                ref={inputRef}
                value={student}
                autoComplete="none"
                onChange={(e) => setStudent(e.target.value)}
                icon={<IconScan />}
                placeholder="Student ID"
                radius="xl"
                size="md"
              />
            </form>
          </div>
        </Stack>
        <Stack
          className="px-14 pt-12"
          sx={{
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
          }}>
          <Group>
            <IconList />
            <Text fz="lg" fw={500}>
              Today attendance
            </Text>
          </Group>
          {Boolean(data.length) ? (
            <Card
              withBorder
              sx={{
                height: '72vh',
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              }}>
              <TableStudents data={data} />
            </Card>
          ) : (
            <Text fz="sm" c="dimmed">
              No attendance
            </Text>
          )}
        </Stack>
      </div>
    </Layout>
  );
}

export default App;
