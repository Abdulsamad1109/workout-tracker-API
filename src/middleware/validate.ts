import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validate = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
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