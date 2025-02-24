import React from 'react';
import Layout from '@components/layout/Layout';
import Board from '@components/board/Board';
import { TaskProvider } from '@components/context/TaskContext';

const Dashboard: React.FC = () => {
  return (
    <TaskProvider>
      <Layout>
        <Board />
      </Layout>
    </TaskProvider>
  );
};

export default Dashboard;
