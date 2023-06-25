import { Modal, createStyles } from '@mantine/core';
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  modalTitle?: ReactNode;
  displayValue: boolean;
  closeAction: () => void;
}

const useStyles = createStyles((theme) => ({
  modalHeader: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.white,
    zIndex: 0,
  },
  modalBody: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.white,
  },
}));

const CustomModal: React.FC<PropsWithChildren<Props>> = ({
  children,
  modalTitle,
  displayValue,
  closeAction,
  ...layoutAttribute
}) => {
  const { classes, theme } = useStyles();

  return (
    <Modal
      title={modalTitle}
      opened={displayValue}
      onClose={closeAction}
      overlayProps={{
        blur: 1,
      }}
      centered
      radius='md'
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
