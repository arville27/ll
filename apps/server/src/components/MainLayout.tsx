import { Layout } from '@ll/common';
import { IconHome, IconSchool, IconArticle } from '@tabler/icons-react';
import { HTMLAttributes, PropsWithChildren } from 'react';

const MainLayout: React.FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({
  children,
  ...layoutAttribute
}) => {
  return (
    <Layout
      navbarProp={{
        links: [
          { label: 'Home', link: '/', icon: <IconHome size={20} /> },
          {
            label: 'Student',
            link: '/student',
            icon: <IconSchool size={20} />,
          },
          {
            label: 'Attendance Log',
            link: '/attendance',
            icon: <IconArticle size={20} />,
          },
        ],
      }}
      {...layoutAttribute}
    >
      {children}
    </Layout>
  );
};

export default MainLayout;
