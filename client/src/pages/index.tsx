import LittleLearnerLogo from '@/assets/logo.png';
import Layout from '@/components/Layout';
import { TableStudents } from '@/components/TableStudents';
import { Input } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import Image from 'next/image';
import { FormEvent, useEffect, useRef, useState } from 'react';

function App() {
  const [student, setStudent] = useState('');
  const [data, setData] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('keypress', () => inputRef.current.focus());
  }, []);

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setData([...data, { name: student, clockIn: new Date().getTime() }]);
    setStudent('');
  }

  return (
    <Layout>
      <div className="flex items-center flex-col mt-20">
        <Image
          className="mb-5"
          priority
          src={LittleLearnerLogo}
          height={192}
          width={192}
          alt="Little Learner Logo"
        />
        <div className="w-[33rem]">
          <form onSubmit={submitHandler}>
            <Input
              ref={inputRef}
              value={student}
              autoComplete="none"
              onChange={(e) => setStudent(e.target.value)}
              icon={<IconAt />}
              placeholder="Student ID"
              radius="xl"
              size="md"
            />
          </form>
        </div>
        <div className="w-full flex justify-center mt-10">
          <TableStudents data={data} />
        </div>
      </div>
    </Layout>
  );
}

export default App;
