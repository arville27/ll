import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { Student, StudentClass } from '@prisma/client';
import { IconDeviceDesktopSearch, IconSchool, IconSearch } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function StudentListDetail({
  studentClass,
}: {
  studentClass?: StudentClass & { students: Student[] };
}) {
  const router = useRouter();
  const theme = useMantineTheme();
  const [searchKey, setSearchKey] = useState('');
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
        <ScrollArea h={400} pr='lg' my='lg'>
          <Stack spacing='sm'>
            {studentClass.students.length === 0 ? (
              <Box className='text-center m-10'>
                <IconDeviceDesktopSearch color='gray' size={40} />
                <Text>No students found</Text>
              </Box>
            ) : (
              studentClass.students
                .filter(
                  (student) =>
                    student.uid.toLowerCase().includes(searchKey) ||
                    student.name.toLowerCase().includes(searchKey)
                )
                .map((student, index) => (
                  <>
                    <Card
                      key={student.uid}
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
                      <Group className='w-full' position='apart' px='sm'>
                        <Stack spacing='none'>
                          <Text fz='sm' className='truncate w-[7rem]'>
                            {student.name}
                          </Text>
                          <Text fz='xs' c='dimmed' className='truncate w-[7rem]'>
                            #{student.uid}
                          </Text>
                        </Stack>
                        <Button
                          variant='subtle'
                          size='xs'
                          px='xs'
                          onClick={() => router.push(`/student?q=${student.name}`)}>
                          More info
                        </Button>
                      </Group>
                    </Card>
                  </>
                ))
            )}
          </Stack>
        </ScrollArea>
      ) : (
        <Text align='center' c='dimmed' p={30}>
          Select class to see student list detail
        </Text>
      )}
    </Stack>
  );
}
