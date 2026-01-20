import { Request, Response } from "express-serve-static-core";
import { CreateUserInput } from "../schemas/user.schema";
import { UpdateUserDTO } from "../dto/UpdateUser.dto";
export declare function createUser(req: Request<{}, {}, CreateUserInput>, res: Response): Promise<Response<any, Record<string, any>, number>>;
export declare function getAllUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>, number>>;
export declare function getUserById(req: Request<{
    id: string;
}, {}, {}, {}>, res: Response): Promise<Response<any, Record<string, any>, number>>;
export declare function updateUser(req: Request<{
    id: string;
}, {}, UpdateUserDTO, {}>, res: Response): Promise<Response<any, Record<string, any>, number>>;
//# sourceMappingURL=users.d.ts.map