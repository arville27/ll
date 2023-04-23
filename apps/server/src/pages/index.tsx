import { TableStudents } from '@/components/TableStudents';
import { trpc } from '@/hooks/trpc';
import { Layout } from '@ll/common';

export default function HomePage() {
  const { data: todayAttendanceLogs } = trpc.attendance.getTodayAttendanceLog.useQuery();

  if (!todayAttendanceLogs) {
    return <div>Loading...</div>;
  }

  let items;
  const logs: { name: string; clockIn: number }[] = [];
  if (todayAttendanceLogs.length === 0) {
    items = <div>No Data</div>;
  } else {
    items = todayAttendanceLogs.map((log) =>
      logs.push({ name: log.student.name, clockIn: log.date.getTime() })
    );
  }

  return (
    <Layout
      navbarProp={{
        links: [
          { label: 'Home', link: '/' },
          { label: 'Students', link: '/student' },
          { label: 'Attendance Logs', link: '/attendance' },
        ],
      }}>
      <div className="w-full flex justify-center mt-10">
        <TableStudents data={logs} />
      </div>
    </Layout>
  );
}
