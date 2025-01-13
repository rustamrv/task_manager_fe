import { z } from 'zod';
import { loginSchema, registerSchema } from '../register-login';

export type RegisterFormInputs = z.infer<typeof registerSchema>;

export type LoginFormInputs = z.infer<typeof loginSchema>;
