import MainLayout from '@/components/MainLayout';
import { TableAttendance } from '@/components/TableAttendance';
import { trpc } from '@/hooks/trpc';
import { Card, Group, Stack, Text, LoadingOverlay, useMantineTheme } from '@mantine/core';
import { DateInput, DateValue } from '@mantine/dates';
import { IconArticle, IconCalendarEvent } from '@tabler/icons-react';
import { useState } from 'react';

export default function AttendancePage() {
  const theme = useMantineTheme();

  const [date, setDate] = useState<DateValue>();

  const { data } = trpc.attendance.getAttendanceLog.useQuery({
    date: date ? date : undefined,
  });

  const today = new Date();

  return (
    <MainLayout className='relative h-full w-full pt-12'>
      <LoadingOverlay visible={!data} />
      <Stack spacing='xl' className='mx-auto px-5 max-w-[50rem]'>
        <Card
          withBorder
          className='self-end px-6 py-4 rounded-xl shadow-md'
          sx={{
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          }}>
          <Text
            fz='sm'
            color={
              theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[6]
            }>
            Total
          </Text>
          <Group spacing='xs' align='flex-end'>
            <span className='text-3xl p-0 font-medium'>{data ? data.length : 0}</span>
            <Text
              fz='sm'
              color={
                theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[6]
              }>
              log(s)
            </Text>
          </Group>
        </Card>
        <Group position='apart'>
          <Group>
            <IconArticle />
            <Text fz='xl' fw={500} className='leading-none'>
              Attendance Log
            </Text>
          </Group>
          <DateInput
            icon={<IconCalendarEvent size={18} />}
            value={today}
            maxDate={today}
            onChange={(e) => setDate(e)}
            placeholder='Date'
            radius='md'
            size='sm'
            variant='filled'
            styles={{
              input: {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
                border:
                  theme.colorScheme === 'dark'
                    ? `solid 1px ${theme.colors.gray[7]}`
                    : `solid 1px ${theme.colors.gray[5]}`,
              },
            }}
          />
        </Group>

        <Card
          withBorder
          radius='md'
          sx={{
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            width: '100%',
            maxWidth: '100%',
          }}
          className='shadow-md self-center mb-10'>
          {data && data.length > 0 ? (
            <TableAttendance tableHeight='auto' showDate data={data}></TableAttendance>
          ) : (
            <Text>No attendance logs on current date</Text>
          )}
        </Card>
      </Stack>
    </MainLayout>
  );
}
