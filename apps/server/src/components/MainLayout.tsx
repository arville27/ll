import { trpc } from '@/hooks/trpc';
import { Layout } from '@ll/common';
import {
  IconHome,
  IconSchool,
  IconArticle,
  IconChalkboard,
  IconLogout,
} from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { HTMLAttributes, PropsWithChildren } from 'react';

const MainLayout: React.FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({
  children,
  ...layoutAttribute
}) => {
  const router = useRouter();
  const logoutMutation = trpc.logout.useMutation({
    onSuccess() {
      router.push('/login');
    },
  });
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
            label: 'Class',
            link: '/class',
            icon: <IconChalkboard size={20} />,
          },
          {
            label: 'Attendance Log',
            link: '/attendance',
            icon: <IconArticle size={20} />,
          },
        ],
        logout: (
          <IconLogout
            className='cursor-pointer'
            onClick={() => logoutMutation.mutate()}
          />
        ),
      }}
      {...layoutAttribute}>
      {children}
    </Layout>
  );
};

export default MainLayout;
