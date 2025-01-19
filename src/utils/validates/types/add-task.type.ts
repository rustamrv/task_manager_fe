import { z } from 'zod';
import { addTaskSchema } from '../add-task';

export type AddTaskFormInputs = z.infer<typeof addTaskSchema>;
