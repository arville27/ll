import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { NavigationBar, NavigationBarProps } from './NavigationBar';
import { Notifications } from '@mantine/notifications';
import Head from 'next/head';

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
  footer?: ReactNode;
  pageTitle: string;
  navbarProp: NavigationBarProps;
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  footer,
  children,
  pageTitle = 'Little Learners Attendance System',
  navbarProp,
  ...layoutAttribute
}) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div className='min-h-screen grid grid-rows-[auto_1fr_auto]'>
        <NavigationBar {...navbarProp} />
        <main {...layoutAttribute}>
          <Notifications zIndex={200} position='top-right' />
          {children}
        </main>
        <footer className='w-full flex justify-center'>{footer}</footer>
      </div>
    </>
  );
};
