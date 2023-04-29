import {
  Switch,
  Group,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export function ThemeSwitch({
  size,
}: {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group position="center">
      <Switch
        checked={colorScheme === 'dark'}
        onChange={() => toggleColorScheme()}
        size={size}
        onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
        offLabel={
          <IconMoonStars color={theme.colors.gray[6]} size={20} stroke={1.5} />
        }
      />
    </Group>
  );
}
