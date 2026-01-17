import { Request, Response } from "express-serve-static-core";
import { User } from "../entities/userEntity";
import { CreateUserInput } from "../schemas/user.schema";
import { hashpassword } from "../helper.ts/hashpassword";
import { AppDataSource } from "../data-source";


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
            return res.status(409).json({ 
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
        
        return res.status(201).json({
            message: "User created successfully",
            user: userResponseWithoutPassword
        });
        
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ 
            message: "Internal server error" 
        });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {

        const users = await userRepository.find();
        
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ 
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
            return res.status(404).json({ 
                message: "User not found" 
            });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ 
            message: "Internal server error" 
        });
    }
} 

export async function updateUser(
    req: Request<{ id: string }, {}, {}>, 
    res: Response
    ) {
        try {

        const { id } = req.params;
        
        const user = await userRepository.findOne({
            where: { id },
        });
        
        if (!user) {
            return res.status(404).json({ 
                message: "failed to update " 
            });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ 
            message: "Internal server error" 
        });
    }
    
}