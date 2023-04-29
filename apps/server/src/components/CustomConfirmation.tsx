import {
  Button,
  Group,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import CustomModal from './CustomModal';

interface Props {
  title: string;
  message: string;
  displayValue: boolean;
  closeAction: () => void;
  acceptAction: () => void;
}

const CustomConfirmation = ({
  title,
  message,
  displayValue,
  closeAction,
  acceptAction,
}: Props) => {
  const theme = useMantineTheme();
  return (
    <CustomModal
      modalTitle={<Text fw={600}>{title}</Text>}
      displayValue={displayValue}
      closeAction={closeAction}
    >
      <Stack>
        <span>{message}</span>
        <Group className="self-end">
          <Button
            bg={theme.colors.blue[theme.fn.primaryShade()]}
            onClick={() => {
              acceptAction();
              closeAction();
            }}
          >
            Yes
          </Button>
          <Button
            bg={theme.colors.red[theme.fn.primaryShade()]}
            onClick={() => closeAction()}
          >
            No
          </Button>
        </Group>
      </Stack>
    </CustomModal>
  );
};

export default CustomConfirmation;
