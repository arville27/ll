import MainLayout from '@/components/MainLayout';
import { trpc } from '@/hooks/trpc';
import {
  Box,
  Button,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const [cred, setCred] = useState({
    username: '',
    password: '',
  });
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess() {
      router.push('/');
    },
    onError(e) {
      notifications.show({
        title: <span className='text-red-6'>Failed to Delete Student</span>,
        message: e.message,
        color: 'red',
        bg: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.red[0],
      });
    },
  });

  return (
    <MainLayout className='mt-32'>
      <Box className='mx-auto w-sm'>
        <Title align='center' fw={900}>
          Sign In
        </Title>

        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate(cred);
            }}>
            <TextInput
              onChange={(e) => setCred((c) => ({ ...c, username: e.target.value }))}
              value={cred.username}
              label='Username'
              placeholder='you@mantine.dev'
              required
            />
            <PasswordInput
              onChange={(e) => setCred((c) => ({ ...c, password: e.target.value }))}
              value={cred.password}
              label='Password'
              placeholder='Your password'
              required
              mt='md'
            />
            <Button type='submit' fullWidth mt='xl'>
              Sign in
            </Button>
          </form>
        </Paper>
      </Box>
    </MainLayout>
  );
}
