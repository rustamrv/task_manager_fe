import React, { useState } from 'react';
import ModalComponent from '@/components/ui/modalComponent';
import { Button } from '@/components/ui/button';
import { useDrag } from 'react-dnd';
import DynamicForm from '../form/DynamicForm';
import { Task } from '../../interfaces';
import { useGetAllUsersQuery } from '../../api/apiSlice';

interface TaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [, dragRef] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status },
  }));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: usersInit } = useGetAllUsersQuery();
  const [users, setUsers] = useState(usersInit || []);

  const handleUpdate = async (formData: any) => {
    try {
      await onUpdate({ ...formData, id: task.id });
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error('Failed to update task:', error);
      setError(
        error.data ? error.data.error : 'Failed to update the task. Try again.'
      );
    }
  };

  const taskFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      value: task.title,
      placeholder: 'Title',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      value: task.description,
      placeholder: 'Description',
      required: true,
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      type: 'date',
      value: task.dueDate,
      placeholder: 'Select a deadline',
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      value: task.status,
      options: ['to-do', 'in-progress', 'done'],
      placeholder: 'Select a status',
      required: true,
    },
    {
      name: 'assignee',
      label: 'Assignee',
      type: 'select',
      placeholder: 'Assignee',
      value: task.assignee._id, 
      options: users.map((user) => ({
        label: user.username,
        value: user._id,
      })),
      required: true,
    },
  ] as any;

  return (
    <div
      ref={dragRef}
      className="border rounded-lg p-4 shadow-sm flex flex-col gap-2"
    >
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-500">{task.description}</p>
      <p className="text-sm text-gray-500">
        {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-500">{task.status}</p>
      <p className="text-sm text-gray-500">{task.assignee.username}</p>
      <div className="flex gap-2">
        <Button variant="default" onClick={() => setIsEditModalOpen(true)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </Button>
      </div>

      {/* Edit Modal */}
      <ModalComponent
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Task"
        description="Update the task details below."
      >
        <DynamicForm
          fields={taskFields}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
          submitLabel="Save"
          error={error}
        />
      </ModalComponent>

      {/* Delete Modal */}
      <ModalComponent
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default TaskCard;
