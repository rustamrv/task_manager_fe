import { z } from 'zod';
import { editTaskSchema } from '../edit-task';

export type EditTaskFormInputs = z.infer<typeof editTaskSchema>;
