// TaskColumn Component
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import TaskCard from '@/components/taskCard/TaskCard';
import { Task } from '../../api/types/TaskTypes';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  refetch: () => void;
  moveCard: (
    dragIndex: number,
    hoverIndex: number,
    sourceStatus: string,
    targetStatus: string
  ) => void;
  onDropTask: (draggedTask: Task, targetStatus: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  refetch,
  moveCard,
  onDropTask,
}) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  return (
    <div
      className={`flex flex-col gap-4 border rounded-lg p-4 shadow-md bg-gray-50 min-w-[150px]`}
    >
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
          {localTasks.length}
        </span>
      </header>
      <div className="flex flex-col gap-4">
        {localTasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            moveCard={moveCard}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
