import { Request, Response } from "express-serve-static-core";
import { User } from "../entities/userEntity";
import { CreateUserInput } from "../schemas/user.schema";
import { hashpassword } from "../helper.ts/hashpassword";
import { AppDataSource } from "../data-source";
import { UpdateUserDTO } from "../dto/UpdateUser.dto";


    //TypeORM repository
    const userRepository = AppDataSource.getRepository(User);

export async function createUser(req: Request<{}, {}, CreateUserInput>, res: Response) {
    try {
        const data = req.body;
        
        // Check user existence
        const findUser = await userRepository.findOne({ 
            where: { email: data.email } 
        });
        
        if(findUser) {
            return res.status(409).send({ 
                message: "Email already exists" 
            });
        }
        
        // Hash password
        data.password = hashpassword(data.password);
        
        // Create new user
        const newUser = userRepository.create(data);
        await userRepository.save(newUser);
        
        // Remove password from response
        const { password, ...userResponseWithoutPassword } = newUser;
        
        return res.status(201).send({
            message: "User created successfully",
            user: userResponseWithoutPassword
        });
        
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send({ 
            message: "Internal server error" 
        });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {

        const users = await userRepository.find();
        
        return res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send({ 
            message: "Internal server error" 
        });
    }
}

export async function getUserById(
    req: Request<{ id: string }, {}, {}, {}>,
    res: Response
    ) {
    try {

        const { id } = req.params;
        
        const user = await userRepository.findOne({
            where: { id },
        });
        
        if (!user) {
            return res.status(404).send({ 
                message: "User not found" 
            });
        }
        
        return res.status(200).send(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).send({ 
            message: "Internal server error" 
        });
    }
} 

export async function updateUser(
    req: Request<{}, {}, UpdateUserDTO, {}>, 
    res: Response
) {
    try {
        if (!req.user?.id) return res.status(401).send({ message: "Unauthorized" });
        const { id } = req.user;
        const data = req.body;
        
        // Find user
        const user = await userRepository.findOne({
            where: { id },
        });
        
        // If user exists
        if (!user) {
            return res.status(404).send({ 
                message: "User not found" 
            });
        }
        
        // If email is being updated, check if new email already exists
        if (data.email && data.email !== user.email) {
            const emailExists = await userRepository.findOne({
                where: { email: data.email }
            });
            
            if (emailExists) {
                return res.status(409).send({ 
                    message: "Email already exists" 
                });
            }
        }
        
        // If password is being updated, hash it
        if (data.password) {
            data.password = hashpassword(data.password);
        }
        
        // Update user fields
        Object.assign(user, data);
        
        // Save updated user
        await userRepository.save(user);
        
        // Remove password from response
        const { password, ...userResponse } = user;
        
        return res.status(200).send({
            message: "User updated successfully",
            user: userResponse
        });
        
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).send({ 
            message: "Internal server error" 
        });
    }
}

export async function deleteUser(
    req: Request<{ id: string }, {}, {}, {}>, 
    res: Response) {
        try {
            const { id } = req.params;
            
            const user = await userRepository.findOne({
                where: { id },
            });
            
            if (!user) {
                return res.status(404).send({ 
                    message: "User not found" 
                });
            }
            
            await userRepository.remove(user);
            
            return res.status(200).send({
                message: "User deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).send({ 
                message: "Internal server error" 
            });
        }
    }