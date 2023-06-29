import Head from 'next/head';
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { NavigationBar, NavigationBarProps } from './NavigationBar';

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
  footer?: ReactNode;
  pageTitle?: string;
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
        <main {...layoutAttribute}>{children}</main>
        <footer className='w-full flex justify-center'>{footer}</footer>
      </div>
    </>
  );
};
