"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
const userEntity_1 = require("../entities/userEntity");
const hashpassword_1 = require("../helper.ts/hashpassword");
const data_source_1 = require("../data-source");
//TypeORM repository
const userRepository = data_source_1.AppDataSource.getRepository(userEntity_1.User);
async function createUser(req, res) {
    try {
        const data = req.body;
        // Check user existence
        const findUser = await userRepository.findOne({
            where: { email: data.email }
        });
        if (findUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }
        // Hash password
        data.password = (0, hashpassword_1.hashpassword)(data.password);
        // Create new user
        const newUser = userRepository.create(data);
        await userRepository.save(newUser);
        // Remove password from response
        const { password, ...userResponseWithoutPassword } = newUser;
        return res.status(201).json({
            message: "User created successfully",
            user: userResponseWithoutPassword
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getAllUsers(req, res) {
    try {
        const users = await userRepository.find();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getUserById(req, res) {
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
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        // Find user
        const user = await userRepository.findOne({
            where: { id },
        });
        // If user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // If email is being updated, check if new email already exists
        if (data.email && data.email !== user.email) {
            const emailExists = await userRepository.findOne({
                where: { email: data.email }
            });
            if (emailExists) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }
        }
        // If password is being updated, hash it
        if (data.password) {
            data.password = (0, hashpassword_1.hashpassword)(data.password);
        }
        // Update user fields
        Object.assign(user, data);
        // Save updated user
        await userRepository.save(user);
        // Remove password from response
        const { password, ...userResponse } = user;
        return res.status(200).json({
            message: "User updated successfully",
            user: userResponse
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
//# sourceMappingURL=users.js.map