import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/users/createUser.dto";
import { CreateUserQueryParams } from "../types/query-params";
import { User } from "../types/response";


export function createUser(
    req: Request<{},{}, CreateUserDto, CreateUserQueryParams>,
    res: Response<User>
    ) {
    const { firstName, lastName, email, password } = req.body;
    const newUser = {
        firstName,
        lastName,
        email,
        password
    };
    const {password:_, ...userWithoutPassword} = newUser; // Exclude password from response
    return res.status(201).send(userWithoutPassword);
}

export function getAllUsers(req: Request, res: Response) {
    res.send([]);
}

export function getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    res.send(`User with ID: ${userId} is here`);
}