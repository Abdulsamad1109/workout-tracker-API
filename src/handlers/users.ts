import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { CreateUserQueryParams } from "../types/query-params";
import { User } from "../types/response";
import { request } from "express";

export function getAllUsers(req: Request, res: Response) {
    res.send([]);
}

export function getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    res.send(`User with ID: ${userId} is here`);
}

export function createUser(
    req: Request<{},{}, CreateUserDto, CreateUserQueryParams>,
    res: Response<User>)
    {
    
    return res.status(201).send({
        id: req.body.id,
        email: req.body.email,
        username: req.body.username
    });
}