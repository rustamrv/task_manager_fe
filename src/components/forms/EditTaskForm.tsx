import React from 'react';
import { useForm } from 'react-hook-form';
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
import { TaskError } from '../../interfaces/Errors';
import ModalComponent from '../ui/ModalComponent';
import { Task, TaskStatus } from '@api/types/TaskTypes';
import { useUpdateTaskMutation } from '@api/endpoints/TaskApi';
import { formatDateToLocal } from '@utils/date/FormDate';
import { zodResolver } from '@hookform/resolvers/zod';
import { editTaskSchema } from '@utils/validates/EditTask';
import { EditTaskFormInputs } from '@utils/validates/types/EditTask.type';
import ReactQuill from 'react-quill';

interface EditTaskFormProps {
  task: Task;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  task,
  isEditModalOpen,
  setIsEditModalOpen,
}) => {
  const { users } = useUsers();
  const [updateTaskMutation] = useUpdateTaskMutation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: formatDateToLocal(task.dueDate),
      status: task.status as TaskStatus,
      assignee: task.assignee?._id,
    },
  });

  const onSubmit = async (formData: EditTaskFormInputs) => {
    try {
      await updateTaskMutation({
        id: task.id,
        task: formData,
      }).unwrap();
      ///
      setIsEditModalOpen(false);
    } catch (error_) {
      const error = error_ as TaskError;
      const backendErrors = error?.data?.errors || [];

      if (backendErrors.length > 0) {
        backendErrors.forEach((err) => {
          setError(err.field as keyof typeof formData, {
            type: 'server',
            message: err.msg,
          });
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'Failed to update the task. Try again.',
        });
      }
    }
  };

  return (
    <ModalComponent
      isOpen={isEditModalOpen}
      onOpenChange={setIsEditModalOpen}
      title="Edit Task"
      description="Update the task details below."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            {...register('title')}
            placeholder="Enter task title"
            className="w-full"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <ReactQuill
            theme="snow"
            value={task.description}
            onChange={(value) => setValue('description', value)}
          />

          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input type="date" {...register('dueDate')} className="w-full" />
          {errors.dueDate && (
            <p className="text-red-500">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            onValueChange={(value) => setValue('status', value as TaskStatus)}
            value={watch('status')}
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
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="assignee">Assignee</Label>
          <Select
            onValueChange={(value) => setValue('assignee', value)}
            value={watch('assignee')}
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
          {errors.assignee && (
            <p className="text-red-500">{errors.assignee.message}</p>
          )}
        </div>

        {errors.root && <p className="text-red-500">{errors.root.message}</p>}

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
