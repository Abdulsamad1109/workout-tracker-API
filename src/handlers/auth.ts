import { Request, Response } from "express-serve-static-core";
import { AppDataSource } from "../data-source";
import { User } from "../entities/userEntity";
import { comparePassword } from "../helper.ts/hashpassword";
import { generateToken } from "../utils/jwt";


//TypeORM repository
const userRepository = AppDataSource.getRepository(User);

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(401).send({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const validPassword = comparePassword(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    res.status(200).send({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};