import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from '@/components/taskCard/TaskCard';
import { GetTask, Task } from '../../api/types/TaskTypes';
import { useUpdateTaskMutation } from '../../api/endpoints/TaskApi';

interface TaskColumnProps {
  status: string;
  tasks: GetTask[];
  refetch: () => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks, refetch }) => {
  const [localTasks, setLocalTasks] = useState(tasks) as any;

  const [updateTaskMutation] = useUpdateTaskMutation();

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDropTask = async (task: Task, newStatus: string) => {
    try {
      await updateTaskMutation({
        id: task.id,
        task: { status: newStatus },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Error updating task status:', error);
      refetch();
    }
  };

  const moveTask = (
    dragIndex: number,
    hoverIndex: number,
    sourceStatus: string,
    targetStatus: string
  ) => {
    setLocalTasks((prevTasks: any) => {
      const updatedTasks = { ...prevTasks };

      const sourceCards = [...(updatedTasks[sourceStatus] || [])];
      const targetCards = [...(updatedTasks[targetStatus] || [])];

      const [movedCard] = sourceCards.splice(dragIndex, 1);

      if (sourceStatus === targetStatus) {
        sourceCards.splice(hoverIndex, 0, movedCard);
        updatedTasks[sourceStatus] = sourceCards;
      } else {
        const updatedCard = { ...movedCard, status: targetStatus };
        targetCards.push(updatedCard);

        updatedTasks[sourceStatus] = sourceCards;
        updatedTasks[targetStatus] = targetCards;

        handleDropTask(movedCard, targetStatus);
      }

      return updatedTasks;
    });
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: any) => {
      const movedTask = { ...item };
      if (movedTask.status !== status) {
        handleDropTask(movedTask, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const revertTask = (taskId: string, originalStatus: string) => {
    setLocalTasks((prevTasks: any) => {
      const updatedTasks = { ...prevTasks };

      Object.keys(updatedTasks).forEach((status) => {
        const taskIndex = updatedTasks[status]?.findIndex(
          (task: any) => task.id === taskId
        );

        if (taskIndex !== -1) {
          const [revertedTask] = updatedTasks[status].splice(taskIndex, 1);

          if (!updatedTasks[originalStatus]) {
            updatedTasks[originalStatus] = [];
          }

          revertedTask.status = originalStatus;
          updatedTasks[originalStatus].push(revertedTask);
        }
      });

      return updatedTasks;
    });
  };

  return (
    <div
      ref={drop}
      className={`flex flex-col gap-4 border rounded-lg p-4 shadow-md min-w-[150px] ${
        isOver ? 'bg-blue-100' : 'bg-gray-50'
      }`}
    >
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{status}</h2>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
          {localTasks[status]?.length || 0}
        </span>
      </header>
      <div className="flex flex-col gap-4">
        {localTasks[status]?.length > 0 ? (
          localTasks[status].map((task: Task, index: number) => (
            <TaskCard
              key={index}
              task={task}
              index={index}
              status={status}
              moveTask={moveTask}
              revertTask={revertTask}
              refetch={refetch}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks</p>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
