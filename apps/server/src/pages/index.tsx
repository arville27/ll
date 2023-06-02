import MainLayout from '@/components/MainLayout';
import { TableAttendance } from '@/components/TableAttendance';
import { trpc } from '@/hooks/trpc';
import { Card, Group, LoadingOverlay, Stack, Text, useMantineTheme } from '@mantine/core';
import { Icon24Hours } from '@tabler/icons-react';
import * as dfs from 'date-fns';

export default function AttendancePage() {
  const { data } = trpc.getAttendanceLog.useQuery();
  const theme = useMantineTheme();

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

        <Card
          withBorder
          radius='md'
          sx={{
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          }}
          className='shadow-md self-center w-full max-w-full mb-12'>
          {data && data.length > 0 ? (
            <TableAttendance tableHeight='fit' data={data} />
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
