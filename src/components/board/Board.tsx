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
import { useAddTaskMutation } from '../../api/endpoints/TaskApi';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '../ui/Select';
import { CreateTaskError } from '../../interfaces/Types';
import { useColumns } from '../../hooks/UseColumn';
import { useUsers } from '../../hooks/UseUsers';

const Board: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: '',
    assignee: '',
  });

  const { columns, isLoading, isError, refetch } = useColumns();
  const { users } = useUsers();
  const [addTaskMutation] = useAddTaskMutation();

  const [cards, setCards] = useState([{}]);

  useEffect(() => {
    if (columns) {
      setCards(columns);
    }
  }, [columns]);

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

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error loading tasks.</p>;

  return (
    <section className="flex-grow flex flex-col lg:ml-72 p-6 w-full gap-6 lg:gap-8 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0 bg-blue-500 text-white hover:bg-blue-600">
              + Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md p-4 sm:p-6 rounded-lg shadow-lg">
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
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-wrap gap-4 overflow-y-auto">
          {Object.keys(cards).map((status: string) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={cards}
              refetch={refetch}
            />
          ))}
        </div>
      </DndProvider>
    </section>
  );
};

export default Board;
