import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from '@/components/taskCard/TaskCard';
import { Task } from '../../api/types/TaskTypes';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  refetch: () => void;
  onDropTask: (draggedTask: Task, targetStatus: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  refetch,
  onDropTask,
}) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (draggedTask: Task) => onDropTask(draggedTask, title),
  });

  return (
    <div
      ref={drop}
      className="flex flex-col gap-4 border rounded-lg p-4 shadow-md bg-gray-50 min-w-[150px] sm:min-w-[200px] lg:min-w-[250px] xl:min-w-[300px]"
    >
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold sm:text-xl lg:text-2xl">
          {title}
        </h2>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </header>
      <div className="flex flex-col gap-4">
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} refetch={refetch} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
