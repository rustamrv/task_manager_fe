import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '../ui/Select';
import { useUsers } from '../../hooks/UseUsers';
import { BackendError } from '../../interfaces/Interface';
import ModalComponent from '../ui/ModalComponent';
import { Task } from '@api/types/TaskTypes';
import { useUpdateTaskMutation } from '@api/endpoints/TaskApi';

import { formatDateToLocal } from '@utils/date/format-date';

interface EditTaskFormProps {
  task: Task;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  refetch: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  task,
  refetch,
  isEditModalOpen,
  setIsEditModalOpen,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { users } = useUsers();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    dueDate: formatDateToLocal(task.dueDate),
    status: task.status,
    assignee: task.assignee?._id,
  });

  const [updateTaskMutation] = useUpdateTaskMutation();

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTaskMutation({
        id: task.id,
        task: formData,
      }).unwrap();
      refetch();
      setIsEditModalOpen(false);
    } catch (error_) {
      const error = error_ as BackendError;
      console.error('Failed to update task:', error);
      setError(error?.data?.error || 'Failed to update the task. Try again.');
    }
  };

  return (
    <ModalComponent
      isOpen={isEditModalOpen}
      onOpenChange={setIsEditModalOpen}
      title="Edit Task"
      description="Update the task details below."
    >
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter task description"
            required
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="to-do">To-do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assignee">Assignee</Label>
          <Select
            value={formData.assignee}
            onValueChange={(value) => handleInputChange('assignee', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an assignee" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="default">
            Save
          </Button>
        </div>
      </form>
    </ModalComponent>
  );
};

export default EditTaskForm;
