import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@components/ui/Button';
import { Task } from '../../api/types/TaskTypes';
import EditTaskForm from '../forms/EditTaskForm';
import { formatDateToLocal } from '@utils/date/FormDate';
import DeleteTaskForm from '@components/forms/DeleteTaskForm';
import parse from 'html-react-parser';

interface TaskCardProps {
  task: Task;
  index: number;
  refetch: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, refetch }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { ...task, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className={`border rounded-lg p-4 shadow-sm flex flex-col gap-2 transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-500">{parse(task.description)}</p>
      <p className="text-sm text-gray-500">
        {task.dueDate ? formatDateToLocal(task.dueDate) : ''}
      </p>
      <p className="text-sm text-gray-500">{task.status}</p>
      <p className="text-sm text-gray-500">
        {task.assignee?.username || 'Unassigned'}
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="default"
          className="w-full sm:w-auto"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </Button>
      </div>

      <EditTaskForm
        task={task}
        refetch={refetch}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />

      <DeleteTaskForm
        id={task.id}
        refetch={refetch}
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />
    </div>
  );
};

export default TaskCard;
