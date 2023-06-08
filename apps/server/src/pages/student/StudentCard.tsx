import {
  Badge,
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
      className=' shadow-sm'>
      <Flex className='flex-col gap-1 overflow-hidden'>
        <Box>
          <Text className='font-semibold break-words' color='blue' lh='1.25'>
            {student.name}
          </Text>
          <Text fz='xs' px='3px' className='break-words'>
            #{student.uid}
          </Text>
        </Box>
        <Badge size='sm' radius='md' className='w-fit'>
          {student.studentClass.className}
        </Badge>
        <Flex className='flex-col gap-3 sm:flex-row justify-between'>
          <Group spacing='xs' align='center'>
            <IconCake size={10}></IconCake>
            <Text c='dimmed' fz='0.75rem'>
              {student.birthDate.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </Group>
          <Group className='self-end'>
            <Button
              leftIcon={<IconEdit size='14' />}
              color='blue'
              size='xs'
              variant='outline'
              onClick={editAction}>
              Edit
            </Button>
            <Button
              leftIcon={<IconSquareRoundedX size='14' />}
              color='red'
              size='xs'
              onClick={deleteAction}>
              Delete
            </Button>
          </Group>
        </Flex>
      </Flex>
    </Card>
  );
}
