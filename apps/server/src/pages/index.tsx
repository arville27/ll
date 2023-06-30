import MainLayout from '@/components/MainLayout';
import { TableAttendance } from '@/components/TableAttendance';
import { trpc } from '@/hooks/trpc';
import { extractClassAttribute } from '@ll/common/src/utils/extractClassAttribute';
import {
  Card,
  Group,
  Input,
  LoadingOverlay,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Icon24Hours, IconSearch } from '@tabler/icons-react';
import * as dfs from 'date-fns';
import { useState } from 'react';

export default function AttendancePage() {
  const { data, refetch } = trpc.getAttendanceLog.useQuery();
  const theme = useMantineTheme();
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterKeywordDebounced] = useDebouncedValue(filterKeyword.toLowerCase(), 300);

  return (
    <MainLayout className='relative h-full w-full pt-12'>
      <LoadingOverlay visible={!data} />
      <Stack spacing='xl' className='mx-auto px-5 max-w-[50rem]'>
        <Group position='apart'>
          <Group>
            <Icon24Hours />
            <Stack spacing={3}>
              <Text fz='xl' fw={500} className='leading-none'>
                {"Today's attendance"}
              </Text>
              <Text fs='sm' c='dimmed'>
                {dfs.format(new Date(), 'EEEE, dd MMM yyyy')}
              </Text>
            </Stack>
          </Group>
        </Group>

        <Input
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          radius='xl'
          icon={<IconSearch size={16} />}
          placeholder="Filter by student's name or class"
        />
        <Card
          withBorder
          radius='md'
          sx={{
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          }}
          className='shadow-md self-center w-full max-w-full mb-12'>
          {data && data.length > 0 ? (
            <TableAttendance
              tableHeight='fit'
              refetch={refetch}
              data={data.filter((log) => {
                const classIdentifiers = extractClassAttribute(filterKeywordDebounced);
                const isValidClass = !classIdentifiers.grade
                  ? log.student.studentClass.name
                      .toLowerCase()
                      .includes(filterKeywordDebounced)
                  : log.student.studentClass.name.toLowerCase() ==
                      classIdentifiers.name &&
                    log.student.studentClass.grade === classIdentifiers.grade;
                return (
                  log.student.name.toLowerCase().includes(filterKeywordDebounced) ||
                  isValidClass
                );
              })}
            />
          ) : (
            <Text className='flex justify-center'>
              No attendance logs on current date
            </Text>
          )}
        </Card>
      </Stack>
    </MainLayout>
  );
}
