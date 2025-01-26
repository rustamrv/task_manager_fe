import React, { Suspense, lazy } from 'react';
import Layout from '@components/layout/Layout';

const TaskStatsWidget = lazy(
  () => import('../components/statistics/TaskStatsWidget')
);
const TaskCompletionChart = lazy(
  () => import('../components/statistics/TaskCompletionChart')
);

const TaskReport: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading Task Stats Widget...</div>}>
        <TaskStatsWidget />
      </Suspense>
      <Suspense fallback={<div>Loading Task Completion Chart...</div>}>
        <TaskCompletionChart />
      </Suspense>
    </Layout>
  );
};

export default TaskReport;
