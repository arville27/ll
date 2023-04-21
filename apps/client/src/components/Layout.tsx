import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { HeaderSimple } from './HeaderSimple';

const links = [
  { label: 'Scan', link: '/' },
  { label: 'Settings', link: '/settings' },
];

interface Props extends HTMLAttributes<HTMLElement> {
  footer?: ReactNode;
}

const Layout: React.FC<PropsWithChildren<Props>> = ({
  footer,
  children,
  ...layoutAttribute
}) => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <HeaderSimple links={links} />
      <main {...layoutAttribute}>{children}</main>
      {footer && <footer className="w-full flex justify-center">{footer}</footer>}
    </div>
  );
};

export default Layout;
