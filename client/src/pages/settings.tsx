import { Input } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { HeaderSimple } from '../components/HeaderSimple';
import { TableStudents } from '../components/TableStudents';
import Image from 'next/image';
import LittleLearnerLogo from '../assets/logo.png';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';

function SettingsPage() {
  return (
    <Layout footer={<div></div>}>
      <div>Hello world</div>
    </Layout>
  );
}

export default SettingsPage;
