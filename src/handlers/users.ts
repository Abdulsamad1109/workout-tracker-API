import { Request, Response } from "express";

export function getAllUsers(req: Request, res: Response) {
    res.send("All users are here");
}

export function getUserById(req: Request, res: Response) {
    const userId = req.params.id;
    res.send(`User with ID: ${userId} is here`);
}

export function createUser(req: Request, res: Response) {
    
}