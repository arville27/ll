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
        placeholder='Search by student id or name'
        radius='md'
        size='sm'
      />
      {studentClass ? (
        <div className='overflow-y-auto max-h-sm lg:max-h-md'>
          {studentClass.students.filter(
            (student) =>
              student.uid.toLowerCase().includes(debouncedSearchKey) ||
              student.name.toLowerCase().includes(debouncedSearchKey)
          ).length === 0 ? (
            <Box className='text-center m-10'>
              <IconDeviceDesktopSearch color='gray' size={40} />
              <Text>No students found</Text>
            </Box>
          ) : (
            <Stack spacing='sm' className='pr-2'>
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
                    radius='md'
                    sx={{
                      backgroundColor:
                        theme.colorScheme == 'dark'
                          ? theme.colors.dark[7]
                          : theme.colors.gray[1],
                    }}
                    className=' shadow-sm py-3 px-4 max-w-md'>
                    <Flex align='center' className='gap-3'>
                      <Text fz='xs'>{index + 1}</Text>
                      <Divider orientation='vertical' />
                      <Flex className='truncate w-full flex-nowrap flex-col sm:flex-row sm:justify-between'>
                        <div className='truncate'>
                          <Text fz='sm' className='truncate'>
                            {student.name}
                          </Text>
                          <Text fz='xs' c='dimmed' className='truncate'>
                            #{student.uid}
                          </Text>
                        </div>
                        <Button
                          radius='xl'
                          variant='subtle'
                          size='xs'
                          compact
                          className='px-3 self-end sm:self-center'
                          onClick={() => router.push(`/student?q=${student.name}`)}>
                          More info
                        </Button>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
            </Stack>
          )}
        </div>
      ) : (
        <Text align='center' c='dimmed' p={30}>
          Select class to see student list detail
        </Text>
      )}
    </Stack>
  );
}
