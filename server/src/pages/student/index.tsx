import Head from 'next/head';
import { Inter } from 'next/font/google';
import { trpc } from '@/hooks/trpc';
import { FormEvent, useState } from 'react';
import { Button, Input } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import Link from 'next/link';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(new Date());
  const [uid, setUid] = useState('');
  // const [data, setData] = useState<Student[]>([]);

  const addStudentMutation = trpc.addStudent.useMutation({
    onSettled: () => refetch(),
  });

  const { data, isLoading, refetch } = trpc.getAllStudent.useQuery();

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  async function submitHandler() {
    if (!birthDate || !name || !uid) return;

    const input = {
      name: name,
      birthDate: birthDate.getTime(),
      uid: uid,
    };
    const response = await addStudentMutation.mutateAsync(input);
  }

  return (
    <Layout>
      <div className="p-5">
        <h1>Add New Student</h1>
        <div className="flex gap-5 flex-col">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            radius="xl"
            size="md"
          />
          <DateInput
            value={birthDate}
            onChange={(e) => setBirthDate(e)}
            label="Date input"
            placeholder="Date input"
            radius="xl"
            size="md"
            maxDate={new Date()}
          />
          <Input
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="StudentId"
            radius="xl"
            size="md"
          />
          <Button onClick={submitHandler}>Submit</Button>
        </div>
      </div>
      <h1 className="text-xl m-4 font-semibold underline">Student List</h1>
      <div className="flex flex-col-reverse gap-3 m-3">
        {data.map((student) => (
          <div key={student.id} className="border-b-4">
            <div>
              StudentID : <span>{student.uid}</span>
            </div>
            <div>
              Name : <span>{student.name}</span>
            </div>
            <div>
              BirthDate : <span>{student.birthDate.toString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
