import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from '@/components/taskCard/TaskCard';
import { Task } from '../../interfaces';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (id: string) => void;
  onDropTask: (draggedTask: Task) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  onUpdateTask,
  onDeleteTask,
  onDropTask,
}) => {
  const [, dropRef] = useDrop(() => ({
    accept: 'TASK',
    drop: (draggedTask: Task) => {
      onDropTask(draggedTask);
    },
  }));

  return (
    <div
      ref={dropRef}
      className="flex flex-col gap-4 border rounded-lg p-4 h-full min-w-[300px] w-[350px] bg-gray-50 shadow-md"
    >
      <header className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </header>
      <div className="flex flex-col gap-4">
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            task={task}
            onUpdate={(updatedTask) => onUpdateTask(updatedTask)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
