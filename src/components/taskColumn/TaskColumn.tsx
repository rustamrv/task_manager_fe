import React, { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from '../taskCard/TaskCard';
import { useUpdateTaskMutation } from '@api/endpoints/TaskApi';
import { DraggedTask, GetTask } from '@api/types/TaskTypes';
import TaskPreview from '@components/taskPreview/TaskPreview';
import { ScrollArea } from '@components/ui/ScrollArea';

interface TaskColumnProps {
  status: string;
  tasks: GetTask;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks }) => {
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

      let updatedCard = movedCard; // Initialize updatedCard outside the conditional block

      if (newStatus === task.status) {
        // Reorder within the same column
        sourceCards.splice(newIndex, 0, movedCard);
        updatedTasks[task.status] = sourceCards;
      } else {
        // Move to a different column
        updatedCard = { ...movedCard, status: newStatus }; // Update status when moving
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

      handleDropTask(item, status);

      updateTask(item, hoverTask.index, status);
      setHoverTask(null);
    },
    hover: (item: DraggedTask, monitor) => {
      const hoverPosition = monitor.getClientOffset();

      if (!hoverPosition || !containerRef.current) return;

      const hoverBoundingRect = containerRef.current.getBoundingClientRect();

      // Position of the mouse relative to the top of the column
      const hoverClientY = hoverPosition.y - hoverBoundingRect.top;

      // Dynamic task height (passed from state or props)
      const taskHeight = 50; // Default to 50px if not set

      // Calculate hover index
      const hoverIndex = Math.min(
        Math.max(0, Math.floor((hoverClientY + taskHeight) / 4 / taskHeight)),
        localTasks[status]?.length || 0 // Clamp within valid task indices
      );

      // Avoid unnecessary updates if the hover index hasn't changed
      if (hoverTask?.index === hoverIndex && hoverTask?.status === status)
        return;

      // Update hover task
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
  }, [tasks]);

  drop(containerRef);

  return (
    <div
      ref={containerRef}
      className={`w-auto  min-w-[295px] flex flex-col p-6 overflow-y-auto h-[calc(100vh-64px)] ${
        isOver ? 'bg-blue-100' : 'bg-gray-50'
      }`}
    >
      <ScrollArea className="h-full overflow-y-auto">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{status}</h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mr-4">
            {localTasks[status]?.length || 0}
          </span>
        </header>
        <div className="flex flex-col gap-4">
          {localTasks[status]?.map((task, index) => (
            <React.Fragment key={task.id}>
              {hoverTask && hoverTask.index === index && (
                <TaskPreview task={hoverTask} />
              )}
              <TaskCard key={task.id} task={task} index={index} />
            </React.Fragment>
          ))}
          {hoverTask && hoverTask.index === localTasks[status]?.length && (
            <TaskPreview task={hoverTask} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskColumn;
