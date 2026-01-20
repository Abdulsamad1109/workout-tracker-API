import { z } from 'zod';
export declare const userValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        firstName: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        lastName: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        email: z.ZodPipe<z.ZodEmail, z.ZodTransform<string, string>>;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateUserInput = z.infer<typeof userValidationSchema>['body'];
//# sourceMappingURL=user.schema.d.ts.map