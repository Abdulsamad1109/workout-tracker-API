import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
export declare const validate: <T extends ZodType>(schema: T) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validate.d.ts.map