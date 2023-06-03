import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { Student, StudentClass } from '@prisma/client';
import { IconCake, IconEdit, IconSquareRoundedX } from '@tabler/icons-react';

export default function StudentCard({
  student,
  editAction,
  deleteAction,
}: {
  student: Student & { studentClass: StudentClass };
  editAction: () => void;
  deleteAction: () => void;
}) {
  const theme = useMantineTheme();

  return (
    <Card
      withBorder
      sx={{
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      }}
      className='shadow-sm'>
      <Flex className='w-full flex-col gap-1 overflow-hidden'>
        <Flex className='justify-between'>
          <Stack spacing='none'>
            <Group spacing='xs' align='center'>
              <Tooltip
                label={student.name}
                position='top-start'
                classNames={{
                  tooltip: 'text-wrap whitespace-normal max-w-4/5',
                }}>
                <Text
                  lineClamp={1}
                  className='overflow-hidden text-ellipsis font-semibold'
                  color='blue'
                  lh='1.25'>
                  {student.name}
                </Text>
              </Tooltip>
            </Group>
            <Text fz='xs' px='3px'>
              #{student.uid}
            </Text>
          </Stack>
          <Badge size='sm' radius='md'>
            {student.studentClass.className}
          </Badge>
        </Flex>

        <Flex className='flex-col sm:flex-row' justify='space-between' gap='sm'>
          <Group spacing='xs' align='center'>
            <IconCake width={13}></IconCake>
            <Text c='dimmed' fz='0.75rem'>
              {student.birthDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Group>

          <Group>
            <Button
              leftIcon={<IconEdit size='14' />}
              color='blue'
              size='xs'
              p={10}
              variant='outline'
              onClick={editAction}>
              Edit
            </Button>
            <Button
              leftIcon={<IconSquareRoundedX size='14' />}
              color='red'
              size='xs'
              p={10}
              onClick={deleteAction}>
              Delete
            </Button>
          </Group>
        </Flex>
      </Flex>
    </Card>
  );
}
