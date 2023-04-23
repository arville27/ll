import littleLearnerLogo from './assets/logo.png';
import { Container, Group, Header, Text, createStyles } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ThemeSwitch } from './ThemeSwitch';

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

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
}));

export interface NavigationBarProps {
  links: { link: string; label: string }[];
}

export function NavigationBar({ links }: NavigationBarProps) {
  const router = useRouter();
  const { classes, cx } = useStyles();

  const items = links.map((item) => (
    <Link
      key={item.link}
      href={item.link}
      className={cx(classes.link, {
        [classes.linkActive]: router.pathname === item.link,
      })}>
      {item.label}
    </Link>
  ));

  return (
    <Header height={60}>
      <Container size="xl" className={classes.header}>
        <Group>
          <Image
            priority
            src={littleLearnerLogo}
            height={40}
            width={40}
            alt="Little Learner Logo"
          />
          <Text className={`${classes.logo} fw-600 tracking-wide text-md`}>
            Little Learners
          </Text>
        </Group>
        <Group spacing={8} className={classes.links}>
          {items}
          <ThemeSwitch />
        </Group>
      </Container>
    </Header>
  );
}
