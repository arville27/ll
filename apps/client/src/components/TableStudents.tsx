import { ScrollArea, Table, Tooltip, createStyles } from '@mantine/core';
import { useState } from 'react';

interface TableStudentsProps {
  data: {
    name: string;
    clockIn: number;
  }[];
}

const useStyles = createStyles((theme) => ({
  header: {
    'position': 'sticky',
    'top': 0,
    'backgroundColor':
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    'transition': 'box-shadow 150ms ease',

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

  contentLimit: {
    maxWidth: 135,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export function TableStudents({ data }: TableStudentsProps) {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const rows = data.map((row, i) => {
    return (
      <tr key={i}>
        <td className='max-w-[135px]'>
          <Tooltip
            position='top-start'
            label={row.name}
            classNames={{
              tooltip: 'text-wrap whitespace-normal max-w-4/5',
            }}>
            <div className='truncate'>{row.name}</div>
          </Tooltip>
        </td>
        <td className={classes.contentLimit}>
          {new Date(row.clockIn).toLocaleTimeString()}
        </td>
      </tr>
    );
  });

  return (
    <ScrollArea
      sx={{ height: '100%', paddingRight: 25 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table sx={{ minWidth: 300, maxWidth: 700 }} verticalSpacing='xs' highlightOnHover>
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