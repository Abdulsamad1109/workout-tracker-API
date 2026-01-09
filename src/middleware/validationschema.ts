import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        firstName: z
            .string()
            .min(1, "First name cannot be empty")
            .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters")
            .trim(),

        lastName: z
            .string()
            .min(1, "Last name cannot be empty")
            .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters")
            .trim(),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Must be a valid email")
            .toLowerCase()
            .trim(),

        password: z
            .string()
            .min(5, "Password must be at least 5 characters")
    })
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];