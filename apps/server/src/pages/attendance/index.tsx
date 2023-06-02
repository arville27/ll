import CustomModal from '@/components/CustomModal';
import MainLayout from '@/components/MainLayout';
import { trpc } from '@/hooks/trpc';
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  LoadingOverlay,
  Stack,
  Text,
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
import { useState } from 'react';

function SummaryCard({ count, itemName }: { count: number; itemName: string }) {
  const theme = useMantineTheme();
  return (
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

  const today = new Date();

  const [selectedStudent, setSelectedStudent] = useState<
    Student & { attendanceLogs: AttendanceLog[]; studentClass: StudentClass }
  >();
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [openedModal, disclosureModal] = useDisclosure(false);

  const { data } = trpc.getAttendanceLogPerStudent.useQuery(
    startDate
      ? {
          startDate: startDate,
          endDate: endDate,
        }
      : undefined
  );

  return (
    <MainLayout className='relative h-full w-full pt-12'>
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
                if (e) setStartDate(e);
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
                if (e) setEndDate(e);
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
                const firstDayOfMonth = new Date();
                firstDayOfMonth.setDate(1);
                setStartDate(firstDayOfMonth);
                setEndDate(today);
              }}
              compact
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
                <Group position='apart'>
                  <Stack>
                    <Group spacing='xs'>
                      <IconPointFilled size={10} />
                      <Text fw={500}>{i.name}</Text>
                      <Badge>{i.studentClass.className}</Badge>
                      <Badge color='yellow'>Total {i.attendanceLogs.length}</Badge>
                    </Group>
                  </Stack>
                  <Group>
                    <Button
                      variant='subtle'
                      radius='xl'
                      onClick={() => {
                        setSelectedStudent(i);
                        disclosureModal.open();
                      }}>
                      <Group spacing={8}>
                        <Text fz='xs'>More info</Text>
                        <IconArrowRight size={14} />
                      </Group>
                    </Button>
                  </Group>
                </Group>
              </Card>
            ))
          ) : (
            <Box className='text-center'>
              <IconDeviceDesktopSearch color='gray' size={40} />
              <Text>No students found</Text>
            </Box>
          )}
        </Box>
      </Stack>

      {selectedStudent && (
        <CustomModal
          modalTitle={
            <Group spacing='lg' className='pt-2 pb-1'>
              <IconSchool size={20} />
              <Text fw={600}>{selectedStudent.name}</Text>
              <Group spacing={5}>
                <Badge>{selectedStudent.studentClass.className}</Badge>
                <Badge color='yellow'>
                  Total {selectedStudent.attendanceLogs.length}
                </Badge>
              </Group>
            </Group>
          }
          displayValue={openedModal}
          closeAction={() => disclosureModal.close()}>
          <Stack spacing='xs'>
            {selectedStudent.attendanceLogs.map((log, index) => (
              <Card shadow='sm' key={log.id}>
                <div className='flex w-full gap-4'>
                  <Text>{index + 1}</Text>
                  <Divider orientation='vertical' />
                  <div className='flex justify-between w-full items-center text-sm'>
                    <Text>{dfs.format(log.date, 'EEEE, dd MMM yyyy')}</Text>
                    <Badge color='teal'>
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
        </CustomModal>
      )}
    </MainLayout>
  );
}
