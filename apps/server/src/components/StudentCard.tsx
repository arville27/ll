import { useSelectedStudentStore } from '@/store/useSelectedStudent';
import {
  Box,
  Button,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { Student } from '@prisma/client';
import { IconCake, IconEdit, IconSquareRoundedX, IconUser } from '@tabler/icons-react';

export function StudentCard({
  data,
  refetch,
  editAction,
  deleteAction,
}: {
  data: Student;
  refetch: () => void;
  editAction: () => void;
  deleteAction: () => void;
}) {
  const theme = useMantineTheme();

  const setSelectedStudent = useSelectedStudentStore((state) => state.setSelectedStudent);

  return (
    <Card
      withBorder
      sx={{
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      }}
      className='shadow-sm'>
      <Group key={data.uid} onClick={() => setSelectedStudent(data)} spacing='md' noWrap>
        <Box
          sx={{
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[2],
          }}
          className='shrink-0 w-[5rem] aspect-square rounded-full justify-center items-center hidden sm:flex'>
          <IconUser size={50} />
        </Box>

        <Flex className='w-full flex-col gap-1 overflow-hidden'>
          <Stack spacing='none'>
            <Tooltip
              label={data.name}
              position='top-start'
              classNames={{
                tooltip: 'text-wrap whitespace-normal max-w-4/5',
              }}>
              <Text lineClamp={1} className='overflow-hidden text-ellipsis' lh='1.25'>
                {data.name}
              </Text>
            </Tooltip>
            <Text fz='sm' px='3px'>
              #{data.uid}
            </Text>
          </Stack>

          <Flex className='flex-col sm:flex-row' justify='space-between' gap='sm'>
            <Group spacing='xs' align='center'>
              <IconCake width={13}></IconCake>
              <Text c='dimmed' fz='0.75rem'>
                {data.birthDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Group>

            <Group>
              <Button
                leftIcon={<IconEdit size='20' />}
                color='blue'
                size='xs'
                p={10}
                variant='outline'
                onClick={() => {
                  setSelectedStudent(data);
                  editAction();
                }}>
                Edit
              </Button>
              <Button
                leftIcon={<IconSquareRoundedX size='20' />}
                color='red'
                size='xs'
                p={10}
                onClick={() => {
                  setSelectedStudent(data);
                  deleteAction();
                }}>
                Delete
              </Button>
            </Group>
          </Flex>
        </Flex>
      </Group>
    </Card>
  );
}
