import { Inter } from 'next/font/google';
import Layout from '@/components/Layout';
import { trpc } from '@/hooks/trpc';
import { TableStudents } from '@/components/TableStudents';

export default function Home() {
  const { data: todayAttendanceLogs } = trpc.getTodayAttendanceLog.useQuery();

  if (!todayAttendanceLogs) {
    return <div>Loading...</div>;
  }

  let items;
  const logs: { name: string; clockIn: number }[] = [];
  if (todayAttendanceLogs.length === 0) {
    items = <div>No Data</div>;
  } else {
    items = todayAttendanceLogs.map((log) =>
      // <div key={log.id}>
      //   <div>{log.student.name}</div>
      //   <div>{log.date.toString()}</div>
      // </div>
      logs.push({ name: log.student.name, clockIn: log.date.getTime() })
    );
  }

  return (
    <Layout>
      <div className="w-full flex justify-center mt-10">
        <TableStudents data={logs} />
      </div>
    </Layout>
  );
}
