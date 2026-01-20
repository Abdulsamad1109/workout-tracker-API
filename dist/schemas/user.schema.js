"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const zod_1 = require("zod");
exports.userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z
            .string()
            .trim()
            .min(1, "First name cannot be empty")
            .regex(/^[a-zA-Z\s]+$/, "First name must contain only letters")
            .transform((val) => val.toLowerCase()),
        lastName: zod_1.z
            .string()
            .trim()
            .min(1, "Last name cannot be empty")
            .regex(/^[a-zA-Z\s]+$/, "Last name must contain only letters")
            .transform((val) => val.toLowerCase()),
        email: zod_1.z
            .email()
            .trim()
            .transform((val) => val.toLowerCase()),
        password: zod_1.z
            .string()
            .min(5, "Password must be at least 5 characters")
    })
});
//# sourceMappingURL=user.schema.js.map