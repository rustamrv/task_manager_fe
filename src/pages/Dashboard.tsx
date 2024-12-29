import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import Board from '@/components/board/Board';

const Dashboard: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen p-4 lg:p-8 gap-4 lg:gap-8">
      {/* Navbar */}
      <Navbar className="border-2 border-gray-300 shadow-md rounded-lg lg:p-6 lg:mt-6 lg:mb-6 lg:ml-6 lg:h-[calc(100vh-64px)] p-4" />

      {/* Main Content */}
      <Board />
    </section>
  );
};

export default Dashboard;
