import { ScanInput } from '@/components/ScanInput';
import { TableStudents } from '@/components/TableStudents';
import { trpc } from '@/hooks/trpc';
import { Layout } from '@ll/common';
import { Card, Group, Input, Stack, Text, useMantineTheme } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconList, IconScan, IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

function App() {
  const [keyword, setKeyword] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterKeywordDebounced] = useDebouncedValue(filterKeyword, 300);
  const theme = useMantineTheme();
  const { data: todayAttendanceLog, refetch } = trpc.getAttendanceLog.useQuery();

  return (
    <Layout navbarProp={{ links: [] }}>
      <div className='grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[1fr_0.6fr] h-full'>
        <Stack align='center' className='mt-52'>
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
          <Input
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            radius='xl'
            icon={<IconSearch size={16} />}
            placeholder='Filter by student name'
          />
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
                data={todayAttendanceLog
                  .filter((log) =>
                    log.student.name.toLowerCase().includes(filterKeywordDebounced)
                  )
                  .map((log) => ({
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
