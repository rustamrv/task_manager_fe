import React from 'react';
import Navbar from '@components/navbar/Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section className="flex flex-col lg:flex-row min-h-screen w-full max-w-full">
      <section className="lg:w-72 w-full fixed lg:relative top-0 left-0 z-50 lg:h-auto">
        <Navbar />
      </section>

      <main className="flex-grow flex flex-col overflow-auto lg:ml-36 lg:mt-8 p-6 lg:w-full">
        {children}
      </main>
    </section>
  );
};

export default Layout;
