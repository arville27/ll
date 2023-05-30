import { ScanInput } from '@/components/ScanInput';
import { TableStudents } from '@/components/TableStudents';
import { trpc } from '@/hooks/trpc';
import { Layout } from '@ll/common';
import { Card, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconList, IconScan } from '@tabler/icons-react';
import { useState } from 'react';

function App() {
  const [keyword, setKeyword] = useState('');
  const theme = useMantineTheme();
  const { data: todayAttendanceLog, refetch } = trpc.getAttendanceLog.useQuery();

  return (
    <Layout navbarProp={{ links: [] }}>
      <div className='grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[1fr_0.6fr] h-full'>
        <Stack align='center' className='mt-40'>
          <IconScan size={192} />
          <ScanInput keyword={keyword} setKeyword={setKeyword} refetch={refetch} />
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
              className='shadow-md'
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
