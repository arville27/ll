import {
  Burger,
  Button,
  Container,
  Group,
  Header,
  Menu,
  Text,
  createStyles,
} from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { Brand } from './Brand';
import { ThemeSwitch } from './ThemeSwitch';

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
    [theme.fn.largerThan('lg')]: {
      display: 'none',
    },
  },
}));

export interface NavigationBarProps {
  links: { link: string; label: string; icon?: ReactNode }[];
  logout?: { icon: ReactNode; label: string; callback: () => void };
}

export function NavigationBar({ links, logout }: NavigationBarProps) {
  const router = useRouter();

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
        <Brand />
        <Group spacing={8} className='hidden lg:flex'>
          {items}
          {logout && (
            <Button variant='subtle' onClick={logout.callback} className={classes.link}>
              {logout.icon}
            </Button>
          )}
          <ThemeSwitch size='lg' />
        </Group>

        <Menu opened={opened} onChange={setOpened} shadow='md' width={200}>
          <Menu.Target>
            <Burger opened={opened} className={classes.burger} size='sm' />
          </Menu.Target>

          <Menu.Dropdown>
            {items}

            {logout && (
              <>
                <Menu.Divider />
                <Menu.Label
                  className={`${classes.link} cursor-pointer`}
                  onClick={logout.callback}>
                  {logout.icon}
                  {logout.label}
                </Menu.Label>
              </>
            )}
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
