import { PropsWithChildren, ReactNode } from 'react';
import { HeaderSimple } from './HeaderSimple';

const links = [
  { label: 'Home', link: '/' },
  { label: 'Manage Student', link: '/student' },
  { label: 'Attendance', link: '/attendance' },
];

type Props = {
  footer?: ReactNode;
};

const Layout: React.FC<PropsWithChildren<Props>> = ({ children, footer }) => {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">
      <HeaderSimple links={links} />
      <main className="mx-auto">{children}</main>
      {footer && (
        <footer className="w-full flex justify-center">{footer}</footer>
      )}
    </div>
  );
};

export default Layout;
