import CustomModal from '@ll/common/src/CustomModal';
import MainLayout from '@/components/MainLayout';
import { trpc } from '@/hooks/trpc';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { AttendanceLog, Student, StudentClass } from '@prisma/client';
import {
  IconArrowRight,
  IconArticle,
  IconCalendarEvent,
  IconClock,
  IconDeviceDesktopSearch,
  IconPointFilled,
  IconSchool,
} from '@tabler/icons-react';
import * as dfs from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function SummaryCard({ count, itemName }: { count: number; itemName: string }) {
  const theme = useMantineTheme();
  return (
    <Card
      withBorder
      className='self-end px-6 py-4 rounded-xl shadow-sm'
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
        <span className='text-3xl p-0 font-medium'>{count}</span>
        <Text
          fz='sm'
          color={
            theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[6]
          }>
          {itemName}
        </Text>
      </Group>
    </Card>
  );
}

export default function AttendancePage() {
  const theme = useMantineTheme();
  const router = useRouter();
  const today = new Date();

  const [selectedStudent, setSelectedStudent] = useState<
    Student & { attendanceLogs: AttendanceLog[]; studentClass: StudentClass }
  >();
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [openedModal, disclosureModal] = useDisclosure(false);

  useEffect(() => {
    const { startdate, enddate } = router.query;
    if (Number(startdate)) setStartDate(new Date(Number(startdate)));
    if (Number(enddate)) setEndDate(new Date(Number(enddate)));
  }, [router.query]);

  const { data } = trpc.getAttendanceLogPerStudent.useQuery(
    startDate
      ? {
          startDate: startDate,
          endDate: endDate,
        }
      : undefined
  );

  return (
    <MainLayout className='relative h-full w-full pt-12 min-w-0'>
      <LoadingOverlay visible={!data} />
      <Stack spacing='xl' className='mx-auto px-5 max-w-[50rem]'>
        <Group position='apart'>
          <Group>
            <IconArticle />
            <Text fz='xl' fw={500} className='leading-none'>
              Attendance Log
            </Text>
          </Group>
          {data && (
            <Group position='right' spacing='xs'>
              <SummaryCard itemName='Student(s)' count={data.length} />
              <SummaryCard
                itemName='Log(s)'
                count={data.reduce((acc, item) => item.attendanceLogs.length + acc, 0)}
              />
              <SummaryCard
                itemName='Class(es)'
                count={new Set(data.map((item) => item.studentClassId)).size}
              />
            </Group>
          )}
        </Group>

        <Stack spacing='xs'>
          <Group>
            <DateInput
              label='Start date'
              icon={<IconCalendarEvent size={18} />}
              value={startDate}
              maxDate={endDate}
              onChange={(e) => {
                if (e) {
                  router.push({
                    query: {
                      ...router.query,
                      startdate: e.getTime(),
                    },
                  });
                  setStartDate(e);
                }
              }}
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
            <DateInput
              label='End date'
              icon={<IconCalendarEvent size={18} />}
              value={endDate}
              minDate={startDate!}
              maxDate={today}
              onChange={(e) => {
                if (e) {
                  router.push({
                    query: {
                      ...router.query,
                      enddate: e.getTime(),
                    },
                  });
                  setEndDate(e);
                }
              }}
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
          <Group spacing='xs'>
            <Button
              onClick={() => {
                setStartDate(today);
                setEndDate(today);
              }}
              compact
              variant='gradient'>
              Today
            </Button>
            <Button
              onClick={() => {
                const firstDayOfWeek = dfs.startOfWeek(new Date(), {
                  weekStartsOn: 1,
                });
                setStartDate(firstDayOfWeek);
                setEndDate(today);
              }}
              compact
              gradient={{ from: 'lime', to: 'teal' }}
              variant='gradient'>
              This week
            </Button>
            <Button
              onClick={() => {
                const firstDayOfMonth = new Date();
                firstDayOfMonth.setDate(1);
                setStartDate(firstDayOfMonth);
                setEndDate(today);
              }}
              compact
              gradient={{ from: 'yellow', to: 'orange' }}
              variant='gradient'>
              This month
            </Button>
          </Group>
        </Stack>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
          }}
          className='self-center mb-10 flex flex-col gap-2'>
          {data && data.length > 0 ? (
            data.map((i, idx) => (
              <Card withBorder key={idx} className='py-2 px-4'>
                <Flex className='flex-col sm:flex-row justify-between flex-nowrap w-full'>
                  <Group className='w-full truncate' noWrap>
                    <IconPointFilled size={10} className='min-w-3' />
                    <Stack spacing='none' className='w-full truncate'>
                      <Group className='truncate' position='apart' spacing='xl' noWrap>
                        <Text fw={500} className='truncate max-w-xs'>
                          {i.name}
                        </Text>
                        <Group className='hidden sm:flex' spacing='sm' noWrap>
                          <Badge size='sm' className='min-w-20'>
                            {i.studentClass.name} {i.studentClass.grade}
                          </Badge>
                          <Badge size='sm' color='yellow' className='min-w-20'>
                            Total {i.attendanceLogs.length}
                          </Badge>
                        </Group>
                      </Group>
                      <Text fz='xs' c='dimmed' className='truncate max-w-xs'>
                        #{i.uid}
                      </Text>
                    </Stack>
                  </Group>
                  <Button
                    className='self-end sm:self-center'
                    variant='subtle'
                    compact
                    radius='xl'
                    onClick={() => {
                      setSelectedStudent(i);
                      disclosureModal.open();
                    }}>
                    <Group spacing={8} noWrap>
                      <Text fz='xs'>More info</Text>
                      <IconArrowRight size={14} />
                    </Group>
                  </Button>
                </Flex>
              </Card>
            ))
          ) : (
            <Box className='text-center'>
              <IconDeviceDesktopSearch color='gray' size={40} />
              <Text color='dimmed'>No students found</Text>
            </Box>
          )}
        </Box>
      </Stack>

      {selectedStudent && (
        <CustomModal
          modalTitle='Attendance Details  '
          displayValue={openedModal}
          closeAction={() => disclosureModal.close()}>
          <Stack spacing='none'>
            <Group spacing='xs' className='pt-2 pb-1' noWrap>
              <IconSchool size={20} className='min-w-4' />
              <Stack spacing='none' className='truncate'>
                <Tooltip
                  position='top-start'
                  label={`${selectedStudent.name}`}
                  classNames={{
                    tooltip: 'break-words whitespace-normal max-w-3/5',
                  }}>
                  <Text fw={600} className='truncate'>
                    {selectedStudent.name}
                  </Text>
                </Tooltip>
                <Text fz='xs' c='dimmed' className='truncate'>
                  #{selectedStudent.uid}
                </Text>
              </Stack>
            </Group>
            <Group spacing={5} className='self-end'>
              <Badge>
                {selectedStudent.studentClass.name} {selectedStudent.studentClass.grade}
              </Badge>
              <Badge color='yellow'>{selectedStudent.attendanceLogs.length} log(s)</Badge>
            </Group>
            <Stack spacing='xs' className='mt-3'>
              {selectedStudent.attendanceLogs.map((log, index) => (
                <Card
                  withBorder
                  key={log.id}
                  sx={{
                    backgroundColor:
                      theme.colorScheme == 'dark'
                        ? theme.colors.dark[7]
                        : theme.colors.gray[1],
                  }}
                  className='shadow-sm'>
                  <div className='flex w-full gap-4'>
                    <Text>{index + 1}</Text>
                    <Divider orientation='vertical' />
                    <div className='flex flex-row flex-wrap justify-between w-full items-center text-sm gap-1'>
                      <Text className='w-44'>
                        {dfs.format(log.date, 'EEEE, dd MMM yyyy')}
                      </Text>
                      <Badge color='teal' className='px-2'>
                        <Group spacing={5}>
                          <IconClock size={14} />
                          <Text>{dfs.format(log.date, 'H:mm')}</Text>
                        </Group>
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </Stack>
          </Stack>
        </CustomModal>
      )}
    </MainLayout>
  );
}
