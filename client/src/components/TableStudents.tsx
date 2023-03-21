import { Table, Anchor, ScrollArea, createStyles } from '@mantine/core';
import { useState } from 'react';

interface TableStudentsProps {
  data: {
    name: string;
    clockIn: number;
  }[];
}

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export function TableStudents({ data }: TableStudentsProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row) => {
    return (
      <tr key={row.name}>
        <td>
          <Anchor<'a'> size="sm" onClick={(event) => event.preventDefault()}>
            {row.name}
          </Anchor>
        </td>
        <td>{new Date(row.clockIn).toLocaleString()}</td>
      </tr>
    );
  });

  return (
    <ScrollArea
      sx={{ height: 300, maxWidth: 700 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table sx={{ minWidth: 400, maxWidth: 700 }} verticalSpacing="xs">
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr>
            <th>Student's name</th>
            <th>Clock In</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </ScrollArea>
  );
}
