import { Input } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { HeaderSimple } from '../components/HeaderSimple';
import { TableStudents } from '../components/TableStudents';
import Image from 'next/image';
import LittleLearnerLogo from '../assets/logo.png';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';

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

  const footer = (
    <div className="w-full flex justify-center">
      <div className="w-full justify-center flex">
        <TableStudents data={data} />
      </div>
    </div>
  );

  return (
    <Layout footer={footer}>
      <div className="flex items-center flex-col">
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
              onChange={(e) => setStudent(e.target.value)}
              icon={<IconAt />}
              placeholder="Student ID"
              radius="xl"
              size="md"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default App;
