import { useState } from 'react';
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Text,
  Anchor,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ThemeSwitch } from './ThemeSwitch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { link } from 'fs';

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  logo: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    padding: '8px 12px',
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
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  // const items = links.map((item) => (
  //   <Link
  //     key={item.link}
  //     href={item.link}
  //     onClick={() => setActive(item.link)}
  //     className={cx(classes.link, { [classes.linkActive]: active === item.link })}>
  //     {item.label}
  //   </Link>
  // ));

  return (
    <Header height={60} mb={120}>
      <Container className={classes.header}>
        <Text className={classes.logo}>Little learners</Text>
        <Group spacing={8} className={classes.links}>
          {/* {items} */}
          <ThemeSwitch />
        </Group>
      </Container>
    </Header>
  );
}
