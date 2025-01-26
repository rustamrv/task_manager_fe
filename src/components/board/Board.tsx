import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@components/ui/Button';
import { useColumns } from '../../hooks/UseColumn';
import AddTaskForm from '../forms/AddTaskForm';
import TaskColumn from '../taskColumn/TaskColumn';

const Board: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { columns, isLoading, isError, refetch } = useColumns();

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error loading tasks.</p>;

  return (
    <section className="flex flex-col mt-16 lg:mt-0">
      <div className="flex flex-col sm:flex-row justify-between items-center border-gray-300 pb-4 mb-6 bg-white sticky">
        <h1 className="text-xl sm:text-2xl font-bold">Tasks</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-sm sm:text-base px-4 py-2"
        >
          + Add New Task
        </Button>
      </div>
      <AddTaskForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <DndProvider backend={HTML5Backend}>
        <div className="overflow-x-auto w-full">
          <div className="flex gap-6 min-w-max md:w-full">
            {Object.keys(columns).map((status: string, index: number) => (
              <TaskColumn
                key={index}
                status={status}
                tasks={columns}
                refetch={refetch}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </section>
  );
};

export default Board;
