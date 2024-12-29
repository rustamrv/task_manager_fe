import React, { useEffect, useState } from 'react';
import TaskColumn from '../taskColumn/TaskColumn';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

import { Task } from '../../interfaces/Task';
import {
  useAddTaskMutation,
  useGetAllTasksQuery,
  useGetAllUsersQuery,
  useUpdateTaskMutation,
} from '../../api/apiSlice';
import { Label } from '../ui/label';
import { Input } from '../ui/Input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '../ui/Select';
import { CreateTaskError } from '../../interfaces/Types';

const Board: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: columnsInit,
    isLoading,
    isError,
    refetch,
  } = useGetAllTasksQuery();
  const { data: usersInit } = useGetAllUsersQuery();
  const [addTaskMutation] = useAddTaskMutation();
  const [updateTaskMutation] = useUpdateTaskMutation();

  const [columns, setColumns] = useState(columnsInit || []);
  const [users, setUsers] = useState(usersInit || []);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
    assignee: '',
  });

  useEffect(() => {
    if (columnsInit) {
      setColumns(columnsInit);
    }
  }, [columnsInit]);

  useEffect(() => {
    if (usersInit) {
      setUsers(usersInit);
    }
  }, [usersInit]);

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

  const handleDropTask = async (task: Task, targetColumn: string) => {
    try {
      let updateStatus = 'to-do';
      switch (targetColumn) {
        case 'To do':
          updateStatus = 'to-do';
          break;
        case 'In progress':
          updateStatus = 'in-progress';
          break;
        case 'Done':
          updateStatus = 'done';
          break;
      }

      await updateTaskMutation({
        id: task.id,
        task: {
          status: updateStatus,
        },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error loading tasks.</p>;

  return (
    <section className="flex-grow flex flex-col lg:ml-72 p-6 overflow-y-auto">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              + Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new task.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddTask} className="flex flex-col gap-4">
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
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-grow gap-4 overflow-y-auto">
          {columns.map((column) => (
            <TaskColumn
              title={column.title}
              tasks={column.tasks}
              refetch={refetch}
              onDropTask={(draggedTask) =>
                handleDropTask(draggedTask, column.title)
              }
            />
          ))}
        </div>
      </DndProvider>
    </section>
  );
};

export default Board;
