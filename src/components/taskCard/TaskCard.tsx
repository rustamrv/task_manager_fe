import React, { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import ModalComponent from '@/components/ui/ModalComponent';
import { Task } from '../../interfaces/Task';
import {
  useDeleteTaskMutation,
  useGetAllUsersQuery,
  useUpdateTaskMutation,
} from '../../api/apiSlice';
import { format } from 'date-fns';
import { BackendError } from '../../interfaces/Types';

interface TaskCardProps {
  task: Task;
  refetch: () => void;
}

const formatDateToLocal = (date: string | Date) => {
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, refetch }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: usersInit } = useGetAllUsersQuery();
  const [users] = useState(usersInit || []);

  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [updateTaskMutation] = useUpdateTaskMutation();

  const [formData, setFormData] = useState({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: formatDateToLocal(task.dueDate),
    status: task.status,
    assignee: task.assignee,
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTaskMutation({ id: formData.id, task: formData }).unwrap();
      refetch();
      setIsEditModalOpen(false);
    } catch (error_) {
      const error = error_ as BackendError;
      console.error('Failed to update task:', error);
      setError(
        error?.data?.error || 'Failed to update the task. Try again.'
      );
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskMutation(id);
      refetch();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  dragRef(ref);

  return (
    <div
      ref={ref}
      className={`border rounded-lg p-4 shadow-sm flex flex-col gap-2 transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-500">{task.description}</p>
      <p className="text-sm text-gray-500">
        {format(new Date(task.dueDate), 'dd/MM/yyyy')}
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
              value={formData.assignee._id}
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
          <Button
            variant="destructive"
            onClick={() => handleDeleteTask(task.id)}
          >
            Delete
          </Button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default TaskCard;
