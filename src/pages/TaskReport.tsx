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
    <section className="flex flex-col lg:flex-row min-h-screen p-4 lg:p-8 gap-4 lg:gap-8">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <section className="flex-grow flex flex-col p-4 lg:ml-72 lg:p-6 overflow-y-auto">
        <div className="p-6">
          <Suspense fallback={<div>Loading Task Stats Widget...</div>}>
            <TaskStatsWidget />
          </Suspense>
          <Suspense fallback={<div>Loading Task Completion Chart...</div>}>
            <TaskCompletionChart />
          </Suspense>
        </div>
      </section>
    </section>
  );
};

export default TaskReport;
