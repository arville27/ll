import { Group, Text, useMantineTheme } from '@mantine/core';
import Image from 'next/image';
import littleLearnerLogo from './assets/logo.png';

export function Brand() {
  const theme = useMantineTheme();

  return (
    <Group>
      <Image
        priority
        src={littleLearnerLogo}
        height={40}
        width={40}
        alt='Little Learner Logo'
      />
      <Text
        className='fw-600 tracking-wide'
        sx={{
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        }}>
        Little Learners
        <span className='hidden md:inline'> Attendance System</span>
      </Text>
    </Group>
  );
}
