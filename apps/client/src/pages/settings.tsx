import Layout from '@/components/Layout';
import { createStyles, Card, Group, Text, Input, Stack, Button } from '@mantine/core';
import { useState } from 'react';
import { IconSettings } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  item: {
    paddingTop: theme.spacing.sm,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  title: {
    lineHeight: 1,
  },
}));

function SettingsPage() {
  const { classes } = useStyles();
  const [customServerUrl, setCustomServerUrl] = useState('');

  return (
    <Layout className="flex justify-center">
      <div className="mt-20">
        <Group mb="lg">
          <IconSettings />
          <Stack spacing={5}>
            <Text fz="lg" fw={500} className={classes.title}>
              Settings
            </Text>
            <Text fz="xs" c="dimmed">
              It's just a setting page bro..
            </Text>
          </Stack>
        </Group>
        <Card withBorder radius="md" p="xl" className={classes.card} w={600}>
          <Stack>
            <Group position="apart">
              <div>
                <Text>Custom server</Text>
                <Text size="xs" color="dimmed">
                  Use custom server
                </Text>
              </div>
              <Input
                value={customServerUrl}
                autoComplete="none"
                onChange={(e) => setCustomServerUrl(e.target.value)}
                placeholder="localhost:3000"
                radius="xl"
                size="sm"
                w={300}
              />
            </Group>
            <Group position="apart" className={classes.item}>
              <div>
                <Text>Kill your friend</Text>
                <Text size="xs" color="dimmed">
                  Don't click this button
                </Text>
              </div>
              <Button>Kill!</Button>
            </Group>
          </Stack>
        </Card>
      </div>
    </Layout>
  );
}

export default SettingsPage;
