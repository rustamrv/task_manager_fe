import React, { Suspense, lazy } from 'react';
import Navbar from '@components/navbar/Navbar';

const TaskStatsWidget = lazy(
  () => import('../components/statistics/TaskStatsWidget')
);
const TaskCompletionChart = lazy(
  () => import('../components/statistics/TaskCompletionChart')
);

const TaskReport: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen w-full max-w-full p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 sm:p-6 lg:p-8 lg:ml-12">
        <Suspense fallback={<div>Loading Task Stats Widget...</div>}>
          <TaskStatsWidget />
        </Suspense>
        <Suspense fallback={<div>Loading Task Completion Chart...</div>}>
          <TaskCompletionChart />
        </Suspense>
      </div>
    </section>
  );
};

export default TaskReport;
