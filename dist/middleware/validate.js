"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const result = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            // Extract and assign the validated data back to req
            const validated = result;
            if (validated.body)
                req.body = validated.body;
            if (validated.query)
                req.query = validated.query;
            if (validated.params)
                req.params = validated.params;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    errors: error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message
                    }))
                });
            }
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map