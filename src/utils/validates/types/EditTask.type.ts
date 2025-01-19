import { z } from 'zod';
import { editTaskSchema } from '../EditTask';

export type EditTaskFormInputs = z.infer<typeof editTaskSchema>;
