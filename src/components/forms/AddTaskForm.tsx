import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@components/ui/Dialog';
import { Button } from '@components/ui/Button';
import { Label } from '@components/ui/Label';
import { Input } from '@components/ui/Input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@components/ui/Select';
import { useUsers } from '../../hooks/UseUsers';
import { useAddTaskMutation } from '@api/endpoints/TaskApi';
import { CreateTaskError } from '../../interfaces/Interface';

interface AddTaskFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  refetch: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  refetch,
}) => {
  const [error, setError] = useState<string | null>(null);
  const { users } = useUsers();
  const [addTaskMutation] = useAddTaskMutation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
    assignee: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addTaskMutation(formData).unwrap();
      await refetch();
      setIsDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        status: '',
        assignee: '',
      });
    } catch (error_) {
      const error = error_ as CreateTaskError;
      const backendErrors = error?.data?.errors || [];
      const errorMessage = backendErrors.map((err: any) => err.msg).join(', ');
      setError(errorMessage || 'Failed to add a task. Try again.');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-full max-w-md p-4 sm:p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new task.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddTask} className="flex flex-col gap-4">
          {/* Поля формы */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              required
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleChange({
                  target: { name: 'status', value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
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
              onValueChange={(value) =>
                handleChange({
                  target: { name: 'assignee', value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
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
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
