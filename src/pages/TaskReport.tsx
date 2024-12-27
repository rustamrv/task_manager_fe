import React, { Suspense, lazy} from 'react';
import Navbar from '@/components/navbar/Navbar';

const TaskStatsWidget = lazy(() => import('../components/statistics/TaskStatsWidget'));
 const TaskCompletionChart = lazy(() => import('../components/statistics/TaskCompletionChart'));

const TaskReport: React.FC = () => {

  return (
    <section className="flex flex-col lg:flex-row min-h-screen p-8 gap-8">
      {/* Navbar */}
      <Navbar className="border-2 border-gray-300 shadow-md rounded-lg lg:p-6 lg:mt-6 lg:mb-6 lg:ml-6 lg:h-[calc(100vh-64px)]" />

      {/* Main Content */}
      <section className="flex-grow flex flex-col lg:ml-72 p-6 overflow-y-auto">
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
