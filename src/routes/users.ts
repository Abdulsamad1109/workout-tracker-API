import { Router } from "express";
import { createUser, getAllUsers, getUserById } from "../handlers/users";
import { validate } from "../middleware/validate";
import { userValidationSchema } from "../schemas/user.schema";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);


/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad Request
 */
router.post("/", validate(userValidationSchema),  createUser);

export default router;