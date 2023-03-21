import { PropsWithChildren, ReactNode, useState } from 'react';
import { HeaderSimple } from './HeaderSimple';

const links = [
  { label: 'Scan', link: '/' },
  { label: 'Settings', link: '/settings' },
];

type Props = {
  footer: ReactNode;
};

const Layout: React.FC<PropsWithChildren<Props>> = ({ children, footer }) => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <HeaderSimple links={links} />
      <main className="container mx-auto">{children}</main>
      {footer && <footer className="w-full flex justify-center">{footer}</footer>}
    </div>
  );
};

export default Layout;
