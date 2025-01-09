import React from 'react'; 
import Board from '@/components/board/Board';
import Navbar from '@/components/navbar/Navbar';

const Dashboard: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8">
      {/* Navbar */}
      <Navbar className="border border-gray-300 shadow-md rounded-lg p-4 lg:p-6 lg:mt-6 lg:mb-6 lg:ml-6 lg:h-[calc(100vh-64px)] h-auto" />

      {/* Main Content */}
      <div className="flex-1">
        <Board />
      </div>
    </section>
  );
};

export default Dashboard;
