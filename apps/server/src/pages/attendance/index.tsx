import { Layout } from '@ll/common';

export default function AttendancePage() {
  return (
    <Layout
      navbarProp={{
        links: [
          { label: 'Home', link: '/' },
          { label: 'Students', link: '/student' },
          { label: 'Attendance Logs', link: '/attendance' },
        ],
      }}>
      <div>Hello</div>
    </Layout>
  );
}
