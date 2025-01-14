import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import TaskCard from '../taskCard/TaskCard';
import { useUpdateTaskMutation } from '@api/endpoints/TaskApi';
import { DraggedTask, GetTask, Task } from '@api/types/TaskTypes';
import TaskPreview from '@components/taskPreview/TaskPreview';

interface TaskColumnProps {
  status: string;
  tasks: GetTask;
  refetch: () => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks, refetch }) => {
  const [localTasks, setTasks] = useState<GetTask>(tasks); 

  const [updateTaskMutation] = useUpdateTaskMutation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverTask, setHoverTask] = useState<DraggedTask | null>(null); // Task for preview

  const handleDropTask = async (task: DraggedTask, newStatus: string) => {
    try {
      await updateTaskMutation({
        id: task.id,
        task: { status: newStatus, position: hoverTask?.index },
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const updateTask = async (
    task: DraggedTask,
    newIndex: number,
    newStatus: string
  ) => {
    setTasks((prev) => {
      const updatedTasks = { ...prev };

      const sourceCards = [...(updatedTasks[task.status] || [])];
      const targetCards = [...(updatedTasks[newStatus] || [])];

      if (task.index < 0 || task.index >= sourceCards.length) return prev;

      // Remove the task from the source column
      const [movedCard] = sourceCards.splice(task.index, 1);

      if (newStatus === task.status) {
        // Reorder within the same column
        sourceCards.splice(newIndex, 0, movedCard);
        updatedTasks[task.status] = sourceCards;
      } else {
        // Move to a different column
        const updatedCard = { ...movedCard, status: newStatus };
        targetCards.splice(newIndex, 0, updatedCard);
        updatedTasks[task.status] = sourceCards;
        updatedTasks[newStatus] = targetCards;
      }

      return updatedTasks;
    });
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: DraggedTask, monitor) => {
      if (monitor.didDrop()) return;
      if (!hoverTask) return;

      if (item.status !== status) {
        handleDropTask(item, status);
      }
      
      updateTask(item, hoverTask.index, status);
      setHoverTask(null);
    },
    hover: (item: DraggedTask, monitor) => {
      const hoverPosition = monitor.getClientOffset();

      if (!hoverPosition || !containerRef.current) return;
      const hoverBoundingRect = containerRef.current?.getBoundingClientRect();

      const dragIndex = item.index;
      const sourceStatus = item.status;
      const targetStatus = status;

      // Позиция мыши относительно верхней границы колонки
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Средняя высота задачи в колонке
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Рассчитываем индекс задачи для hover
      const hoverIndex = Math.min(
        Math.max(0, Math.floor(hoverClientY / 50)), // 50 - высота одной задачи
        localTasks[status]?.length || 0
      );

      // Проверяем, нужно ли обновлять hoverTask
      if (dragIndex === hoverIndex && sourceStatus === targetStatus) return;

      // Избегаем обновлений, если курсор находится выше или ниже области задачи
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      // Обновляем превью
      setHoverTask({ ...item, index: hoverIndex });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (!isOver) {
      setHoverTask(null);
    }
  }, [isOver]);

  useEffect(() => {
    setTasks(tasks);
  } , [tasks]); 

  return (
    <div
      ref={(node) => {
        drop(node);
        containerRef.current = node;
      }}
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
      <div className="flex flex-col gap-4 relative">
        {localTasks[status]?.map((task, index) => (
          <React.Fragment key={task.id}>
            {hoverTask && hoverTask.index === index && (
              <TaskPreview task={hoverTask} />
            )}
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              refetch={refetch}
            />
          </React.Fragment>
        ))}
        {hoverTask && hoverTask.index === localTasks[status]?.length && (
          <TaskPreview task={hoverTask} />
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
