import { trpc } from '@/hooks/trpc';
import { useSearchKeyStore } from '@/store/useSearchKeyStore';
import { useSelectedStudentStore } from '@/store/useSelectedStudent';
import { Button, Flex, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalendarDown, IconId, IconIdBadge, IconMan } from '@tabler/icons-react';
import { IconCalendarEvent } from '@tabler/icons-react';
import { IconIdBadge2 } from '@tabler/icons-react';
import { IconCalendarCog } from '@tabler/icons-react';
import {
  IconCalendar,
  IconCalendarBolt,
  IconCalendarCheck,
  IconCalendarPlus,
} from '@tabler/icons-react';
import { useState } from 'react';

class StudentInput {
  uid = '';
  name = '';
  birthDate: Date | null = null;
}

interface Payload {
  uid: string;
  name: string;
  birthDate: number;
}

export function AddStudent({ refetch }: { refetch: () => void }) {
  const theme = useMantineTheme();

  const setSearchKey = useSearchKeyStore((state) => state.setSearchKey);
  const selectedStudent = useSelectedStudentStore((state) => state.selectedStudent);

  const [input, setInput] = useState<StudentInput>(new StudentInput());

  const addStudentMutation = trpc.student.addStudent.useMutation({
    onSettled: () => {
      // Reset input and search bar value
      setInput(new StudentInput());
      setSearchKey('');

      // Refetch student list
      refetch();
    },
  });

  function submitHandler() {
    if (input.uid.length === 0 || input.name.length === 0 || !input.birthDate) return;

    const payload: Payload = { ...input, birthDate: input.birthDate.getTime() };

    addStudentMutation.mutateAsync(payload);
  }

  if (selectedStudent) {
    input.uid = selectedStudent.uid;
    input.name = selectedStudent.name;
    input.birthDate = selectedStudent.birthDate;
  }

  return (
    <Flex
      direction="column"
      gap="xl"
      align="center"
      mx="auto"
      w="100%"
      className="px-[3rem] py-5">
      <Text
        ta="center"
        sx={{
          fontSize: '20px',
          lineHeight: '28px',
          fontWeight: 'bold',
        }}>
        {!selectedStudent ? 'Add New Student' : 'Edit Student Profile'}
      </Text>
      <Stack align="stretch" spacing="md" w="100%">
        <TextInput
          icon={<IconIdBadge size="1.2rem" />}
          label="UID"
          value={input.uid}
          variant="filled"
          required
          onChange={(e) => setInput({ ...input, uid: e.target.value })}
          placeholder="Student ID"
          radius="md"
          size="sm"
        />
        <TextInput
          icon={<IconId size="1.2rem" />}
          label="Name"
          value={input.name}
          variant="filled"
          required
          onChange={(e) => setInput({ ...input, name: e.target.value })}
          placeholder="Name"
          radius="md"
          size="sm"
        />
        <DateInput
          icon={<IconCalendarEvent size="1.2rem" />}
          label="Birth Date"
          value={input.birthDate}
          variant="filled"
          required
          onChange={(e) => setInput({ ...input, birthDate: e })}
          placeholder="Birth date"
          radius="md"
          size="sm"
          maxDate={new Date()}
        />
      </Stack>
      <Button
        w={150}
        color={theme.colors.blue[theme.fn.primaryShade()]}
        gradient={{ from: 'indigo', to: 'cyan' }}
        variant="gradient"
        size="sm"
        onClick={submitHandler}>
        Submit
      </Button>
    </Flex>
  );
}
