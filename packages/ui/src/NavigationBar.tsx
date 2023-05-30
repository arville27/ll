import {
  Burger,
  Container,
  Group,
  Header,
  Menu,
  Text,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { ThemeSwitch } from './ThemeSwitch';
import littleLearnerLogo from './assets/logo.png';

const useStyles = createStyles((theme) => ({
  link: {
    'display': 'flex',
    'gap': '0.5rem',
    'alignItems': 'center',
    'lineHeight': 1,
    'padding': '8px 12px',
    'borderRadius': theme.radius.sm,
    'textDecoration': 'none',
    'color': theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    'fontSize': theme.fontSizes.sm,
    'fontWeight': 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

export interface NavigationBarProps {
  links: { link: string; label: string; icon?: ReactNode }[];
}

export function NavigationBar({ links }: NavigationBarProps) {
  const router = useRouter();
  const theme = useMantineTheme();

  const { classes, cx } = useStyles();
  const [opened, setOpened] = useState(false);

  const items = links.map((item) => (
    <Link
      key={item.link}
      href={item.link}
      className={cx(classes.link, {
        [classes.linkActive]: router.pathname === item.link,
      })}>
      {item.icon}
      {item.label}
    </Link>
  ));
  return (
    <Header height={60} className='z-[100] sticky top-0'>
      <Container size='xl' className='flex justify-between items-center h-full'>
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
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[0]
                  : theme.colors.gray[7],
            }}>
            Little Learners Attendance System
          </Text>
        </Group>
        <Group spacing={8} className='hidden sm:flex'>
          {items}
          <ThemeSwitch size='lg' />
        </Group>

        <Menu opened={opened} onChange={setOpened} shadow='md' width={200}>
          <Menu.Target>
            <Burger opened={opened} className={classes.burger} size='sm' />
          </Menu.Target>

          <Menu.Dropdown>
            {items}

            <Menu.Divider />

            <Menu.Label>Others</Menu.Label>
            <Menu.Label>
              <Group align='center'>
                <IconEye size={14} />
                <Text fz='xs'>Dark mode</Text>
                <ThemeSwitch size='md' />
              </Group>
            </Menu.Label>
          </Menu.Dropdown>
        </Menu>
      </Container>
    </Header>
  );
}
