import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useColumns } from '../../hooks/UseColumn';
import TaskColumn from '../taskColumn/TaskColumn';
import AddTaskForm from '@components/forms/AddTaskForm';
import SearchBar from '@components/search/SearchBar';
import LoadingSpinner from '@components/loader/Loader';

const Board: React.FC = () => {
  const { columns, isLoading, isError, refetch, searchTasks, isFetching } =
    useColumns();

  if (isError)
    return <p className="text-center text-red-500">Error loading tasks.</p>;

  return (
    <section className="flex-col mt-16 lg:mt-0">
      <div className="flex flex-col sm:flex-row justify-between items-center border-gray-300 pb-4 mb-6 bg-white sticky">
        <h1 className="text-xl sm:text-2xl font-bold">Tasks</h1>
        <AddTaskForm />
      </div>

      {isLoading && <LoadingSpinner />}

      <div className="mb-4">
        <SearchBar onSearch={searchTasks} />
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="overflow-x-auto w-full flex gap-6">
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
