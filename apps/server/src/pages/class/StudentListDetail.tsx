import {
  Box,
  Button,
  Card,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Student, StudentClass } from '@prisma/client';
import { IconDeviceDesktopSearch, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function StudentListDetail({
  studentClass,
}: {
  studentClass?: StudentClass & { students: Student[] };
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const [searchKey, setSearchKey] = useState('');
  const [debouncedSearchKey] = useDebouncedValue(searchKey.toLowerCase(), 50);

  useEffect(() => {
    setSearchKey('');
  }, [studentClass]);

  return (
    <Stack>
      <TextInput
        className='text-xl'
        icon={<IconSearch size={14} />}
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        placeholder='Search student by uid or name'
        radius='md'
        size='sm'
      />
      {studentClass ? (
        <ScrollArea pr='lg' h={400}>
          {studentClass.students.length === 0 ? (
            <Box className='text-center m-10'>
              <IconDeviceDesktopSearch color='gray' size={40} />
              <Text>No students found</Text>
            </Box>
          ) : (
            <Stack spacing='sm'>
              {studentClass.students
                .filter(
                  (student) =>
                    student.uid.toLowerCase().includes(debouncedSearchKey) ||
                    student.name.toLowerCase().includes(debouncedSearchKey)
                )
                .map((student, index) => (
                  <Card
                    withBorder
                    key={student.id}
                    py='sm'
                    radius='md'
                    sx={{
                      backgroundColor:
                        theme.colorScheme == 'dark'
                          ? theme.colors.dark[7]
                          : theme.colors.gray[1],
                    }}
                    className='flex items-center gap-3 shadow-sm'>
                    <Text className='min-w-[1.5rem]'>{index + 1}</Text>
                    <Divider orientation='vertical' />
                    <Group className='w-full' position='apart'>
                      <Stack spacing='none'>
                        <Text fz='sm' className='truncate w-[7rem]'>
                          {student.name}
                        </Text>
                        <Text fz='xs' c='dimmed' className='truncate w-[7rem]'>
                          #{student.uid}
                        </Text>
                      </Stack>
                      <Button
                        radius='xl'
                        variant='subtle'
                        size='xs'
                        px='xs'
                        onClick={() => router.push(`/student?q=${student.name}`)}>
                        More info
                      </Button>
                    </Group>
                  </Card>
                ))}
            </Stack>
          )}
        </ScrollArea>
      ) : (
        <Text align='center' c='dimmed' p={30}>
          Select class to see student list detail
        </Text>
      )}
    </Stack>
  );
}
