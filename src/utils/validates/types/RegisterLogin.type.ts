import { z } from 'zod';
import { loginSchema, registerSchema } from '../RegisterLogin';

export type RegisterFormInputs = z.infer<typeof registerSchema>;

export type LoginFormInputs = z.infer<typeof loginSchema>;
