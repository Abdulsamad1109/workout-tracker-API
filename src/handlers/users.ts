import { Request, Response } from "express";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { CreateUserQueryParams } from "../types/query-params";
import { User } from "../types/response";

export function getAllUsers(req: Request, res: Response) {
    res.send("All users are here");
}

export function getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    res.send(`User with ID: ${userId} is here`);
}

export function createUser(
    req: Request<{},{}, CreateUserDto, CreateUserQueryParams>,
    res: Response<User>)
    {
    res.status(201).send({
        id: req.body.id,
        email: req.body.email,
        username: req.body.username
    });
}