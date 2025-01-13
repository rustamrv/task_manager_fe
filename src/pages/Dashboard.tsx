import React from 'react';
import Board from '@components/board/Board';
import Navbar from '@components/navbar/Navbar';

const Dashboard: React.FC = () => {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Board />
    </section>
  );
};

export default Dashboard;
