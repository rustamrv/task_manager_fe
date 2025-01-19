import { z } from 'zod';

export const addTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  dueDate: z.string().nonempty('Due date is required'),
  status: z.enum(['to-do', 'in-progress', 'done'], {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
  assignee: z.string().nonempty('Please select an assignee'),
});
