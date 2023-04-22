import { Modal, createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  displayValue: boolean;
  closeAction: () => void;
}

const useStyles = createStyles((theme) => ({
  modalHeader: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.indigo[1],
  },
  modalBody: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.indigo[1],
  },
}));

const CustomModal: React.FC<PropsWithChildren<Props>> = ({
  children,
  displayValue,
  closeAction,
  ...layoutAttribute
}) => {
  const { classes, theme } = useStyles();

  return (
    <Modal
      opened={displayValue}
      onClose={closeAction}
      overlayProps={{
        blur: 1,
      }}
      centered
      radius="lg"
      transitionProps={{
        transition: 'fade',
        duration: 200,
        timingFunction: 'linear',
      }}
      classNames={{
        header: classes.modalHeader,
        body: classes.modalBody,
      }}
      {...layoutAttribute}>
      {children}
    </Modal>
  );
};
export default CustomModal;
