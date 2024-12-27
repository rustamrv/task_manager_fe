import React from 'react';
import Navbar from '../components/navbar/Navbar';
import TasksHome from '../components/task/Task';

const Dashboard: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen p-8 gap-8">
      {/* Navbar */}
      <Navbar className="border-2 border-gray-300 shadow-md rounded-lg lg:p-6 lg:mt-6 lg:mb-6 lg:ml-6 lg:h-[calc(100vh-64px)]" />

      {/* Main Content */}
      <section className="flex-grow flex flex-col lg:ml-72 p-6 overflow-y-auto">
        <TasksHome />
      </section>
    </section>
  );
};

export default Dashboard;
