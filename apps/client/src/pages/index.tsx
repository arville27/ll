import { TableStudents } from '@/components/TableStudents';
import { trpc } from '@/hooks/trpc';
import { Layout } from '@ll/common';
import { Card, Group, Input, Stack, Text, useMantineTheme } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconList, IconScan } from '@tabler/icons-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

function App() {
  const [student, setStudent] = useState('');
  const inputRef = useRef(null);
  const theme = useMantineTheme();
  const { data: todayAttendanceLog, refetch } = trpc.attendance.getAttendanceLog.useQuery(
    {}
  );
  const addAttendanceMutation = trpc.attendance.addAttendanceLog.useMutation({
    onSettled: () => refetch(),
  });

  useEffect(() => {
    function handleKeypress() {
      inputRef.current.focus();
    }

    document.addEventListener('keypress', handleKeypress);

    return () => {
      document.removeEventListener('keypress', handleKeypress);
    };
  }, []);

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addAttendanceMutation.mutateAsync({ uid: student }).then(() => {
      notifications.show({
        title: <span className='text-green-6'>Success</span>,
        message: 'Added student attendance ',
        color: 'green',
        bg: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.green[0],
      });
    });
    setStudent('');
  }

  return (
    <Layout
      navbarProp={{
        links: [{ label: 'Scan', link: '/', icon: <IconScan size={20} /> }],
      }}>
      <div className='grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[1fr_0.6fr] h-full'>
        <Stack justify='center' align='center'>
          <IconScan opacity={1} width={192} height={192} />
          <div className='w-[24rem]'>
            <form onSubmit={submitHandler}>
              <Input
                ref={inputRef}
                value={student}
                autoComplete='none'
                onChange={(e) => setStudent(e.target.value)}
                icon={<IconScan />}
                placeholder='Student ID'
                radius='xl'
                size='md'
              />
            </form>
          </div>
        </Stack>
        <Stack
          className='px-14 pt-12'
          sx={{
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
          }}>
          <Group>
            <IconList />
            <Text fz='lg' fw={500}>
              Today attendance
            </Text>
          </Group>
          {Boolean(todayAttendanceLog) && todayAttendanceLog.length > 0 ? (
            <Card
              withBorder
              sx={{
                height: '72vh',
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              }}>
              <TableStudents
                data={todayAttendanceLog.map((log) => ({
                  clockIn: log.date.getTime(),
                  name: log.student.name,
                }))}
              />
            </Card>
          ) : (
            <Text fz='sm' c='dimmed'>
              No attendance
            </Text>
          )}
        </Stack>
      </div>
    </Layout>
  );
}

export default App;
