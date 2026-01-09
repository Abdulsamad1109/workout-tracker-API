import { z } from 'zod';

export const userValidationSchema = z.object({
    body: z.object({
        firstName: z
            .string()
            .trim()
            .min(1, "First name cannot be empty")
            .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters"),

        lastName: z
            .string()
            .trim()
            .min(1, "Last name cannot be empty")
            .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters"),

       email: z
            .email()
            .toLowerCase(),
            // .trim()
            // .min(1, "Email is required")
            // .refine(
            // (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            // { message: "Must be a valid email" }
            // )
            // .transform((val) => val.toLowerCase()),

        password: z
            .string()
            .min(5, "Password must be at least 5 characters")
    })
});

export type CreateUserInput = z.infer<typeof userValidationSchema>['body'];