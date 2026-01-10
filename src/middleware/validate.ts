import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validate = <T extends ZodType>(schema: T) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });

            // Extract and assign the validated data back to req
            const validated = result as { 
                body?: any; 
                query?: any; 
                params?: any 
            };
            
            if (validated.body) req.body = validated.body;
            if (validated.query) req.query = validated.query;
            if (validated.params) req.params = validated.params;
            
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