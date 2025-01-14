import React, { useMemo, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@components/ui/Button';
import { useColumns } from '../../hooks/UseColumn';
import AddTaskForm from '../forms/AddTaskForm';
import TaskColumn from '../taskColumn/TaskColumn';

const Board: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { columns, isLoading, isError, refetch } = useColumns();
  const cards = useMemo(() => columns || [{}], [columns]);

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error loading tasks.</p>;

  return (
    <section className="flex-grow flex flex-col lg:ml-72 p-6 w-full gap-6 lg:gap-8 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-4 mb-6">
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
        refetch={refetch}
      />

      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-wrap gap-4 overflow-y-auto">
          {Object.keys(cards).map((status: string, index: number) => (
            <TaskColumn
              key={index}
              status={status}
              tasks={cards}
              refetch={refetch}
            />
          ))}
        </div>
      </DndProvider>
    </section>
  );
};

export default Board;
