import React, { useState } from 'react';
import { DndProvider} from 'react-dnd';
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
    <section className="flex-grow flex flex-col lg:ml-12 p-6 overflow-y-auto">
      <div className="flex flex-col sm:flex-col justify-between items-start sm:items-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Tasks</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="mt-4 sm:mt-0 bg-blue-500 text-white hover:bg-blue-600"
        >
          + Add New Task
        </Button>
      </div>
      <AddTaskForm
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      <DndProvider backend={HTML5Backend}>
        <div className="flex  gap-6 overflow-x-auto w-full">
          {Object.keys(columns).map((status: string, index: number) => (
            <TaskColumn
              key={index}
              status={status}
              tasks={columns}
              refetch={refetch}
            />
          ))}
        </div>
      </DndProvider>
    </section>
  );
};

export default Board;
