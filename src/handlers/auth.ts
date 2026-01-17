import { Request, Response } from "express-serve-static-core";
import { AppDataSource } from "../data-source";
import { User } from "../entities/userEntity";
import { comparePassword } from "../helper.ts/hashpassword";
import { generateToken } from "../utils/jwt";
import { LoginDTO } from "../dtos/login.dto";


//TypeORM repository
const userRepository = AppDataSource.getRepository(User);

export const login = async (req: Request<{}, {}, LoginDTO, {}>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user by email
    const user = await userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password']
      });
    if (!user) {
      res.status(401).send({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const validPassword = await comparePassword(password, user.password);
    console.log("password from request:", password);
    console.log("password in database:", user.password);
    console.log("validPassword result:", validPassword);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentialss' });
      return;
    }

    // Generate token
    const token = generateToken({
      id: user.id,
    });

    res.status(200).send({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ error: 'Server error' });
  }
};