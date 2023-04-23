import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { NavigationBar, NavigationBarProps } from './NavigationBar';

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
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <NavigationBar {...navbarProp} />
      <main {...layoutAttribute}>{children}</main>
      {footer && <footer className="w-full flex justify-center">{footer}</footer>}
    </div>
  );
};
