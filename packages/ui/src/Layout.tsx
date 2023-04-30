import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { NavigationBar, NavigationBarProps } from './NavigationBar';
import { Notifications } from '@mantine/notifications';

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
  footer?: ReactNode;
  navbarProp: NavigationBarProps;
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  footer,
  children,
  navbarProp,
  ...layoutAttribute
}) => {
  {
    /* <Notifications position="top-right" limit={3} /> */
  }
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <NavigationBar {...navbarProp} />
      <main {...layoutAttribute}>
        <Notifications zIndex={200} position="top-right" />
        {children}
      </main>
      <footer className="w-full flex justify-center">{footer}</footer>
    </div>
  );
};