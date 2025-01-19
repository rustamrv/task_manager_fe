import { useForm } from 'react-hook-form';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskError } from 'src/interfaces/Interface';
import { addTaskSchema } from '@utils/validates/add-task';
import { AddTaskFormInputs } from '@utils/validates/types/add-task.type';

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
  const { users } = useUsers();
  const [addTaskMutation] = useAddTaskMutation();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<AddTaskFormInputs>({
    resolver: zodResolver(addTaskSchema),
  });

  const onSubmit = async (data: AddTaskFormInputs) => {
    try {
      await addTaskMutation(data).unwrap();
      await refetch();
      setIsDialogOpen(false);
      reset();
    } catch (error_) {
      const error = error_ as TaskError;
      const backendErrors = error?.data?.errors || [];

      if (backendErrors.length > 0) {
        backendErrors.forEach((err) => {
          setError(err.field as keyof typeof data, {
            type: 'server',
            message: err.msg,
          });
        });
      } else {
        setError('root', {
          type: 'server',
          message: 'Failed to add task. Try again.',
        });
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-full max-w-md p-4 sm:p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new task
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              {...register('title')}
              placeholder="Enter title"
              className="w-full"
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              {...register('description')}
              placeholder="Enter description"
              className="w-full"
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
              onValueChange={(value) =>
                setValue('status', value as 'to-do' | 'in-progress' | 'done')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
            <Select onValueChange={(value) => setValue('assignee', value)}>
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
