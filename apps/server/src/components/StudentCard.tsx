import { trpc } from '@/hooks/trpc';
import { useSelectedStudentStore } from '@/store/useSelectedStudent';
import { Box, Button, Flex, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { Student } from '@prisma/client';
import { IconCake, IconEdit, IconSquareRoundedX, IconUser } from '@tabler/icons-react';

export function StudentCard({
  data,
  refetch,
  editAction,
}: {
  data: Student;
  refetch: () => void;
  editAction: () => void;
}) {
  const theme = useMantineTheme();

  const setSelectedStudent = useSelectedStudentStore((state) => state.setSelectedStudent);

  const deleteStudentMutation = trpc.student.deleteStudentByUid.useMutation({
    onSettled: () => refetch(),
  });

  return (
    <Group
      key={data.uid}
      p="md"
      sx={{
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1],
        borderRadius: '8px',
      }}
      onClick={() => setSelectedStudent(data)}>
      <Box
        bg={theme.colors.gray[theme.fn.primaryShade()]}
        sx={{
          border: `solid 1px ${theme.colors.dark[theme.fn.primaryShade()]}`,
          borderRadius: '50%',
        }}>
        <IconUser width={70} height={70} className="p-2" />
      </Box>

      <Stack justify="space-between" spacing="md" className="flex-grow-1">
        <Stack spacing="none">
          <Text fz="xl" lh="0.7">
            {data.name}
          </Text>
          <Text fz="sm" px="3px">
            #{data.uid}
          </Text>
        </Stack>

        <Flex justify="space-between">
          <Group spacing="xs" align="center">
            <IconCake width={13}></IconCake>
            <Text c="dimmed" fz="0.75rem">
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
              leftIcon={<IconEdit size="20" />}
              //   bg={theme.colors.blue[theme.fn.primaryShade()]}
              color="blue"
              size="xs"
              p={10}
              variant="outline"
              onClick={() => {
                setSelectedStudent(data);
                editAction();
              }}>
              Edit
            </Button>
            <Button
              leftIcon={<IconSquareRoundedX size="20" />}
              // bg={theme.colors.red[theme.fn.primaryShade()]}
              color="red"
              size="xs"
              p={10}
              onClick={() => {
                deleteStudentMutation.mutateAsync({
                  uid: data.uid,
                });
              }}>
              Delete
            </Button>
          </Group>
        </Flex>
      </Stack>
    </Group>
  );
}
