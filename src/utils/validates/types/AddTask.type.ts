import { z } from 'zod';
import { addTaskSchema } from '../AddTask';

export type AddTaskFormInputs = z.infer<typeof addTaskSchema>;
