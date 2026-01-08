import { Router } from "express";
import { createUser, getAllUsers, getUserById } from "../handlers/users";
import { checkSchema } from "express-validator";
import { userValidationSchema } from "../middleware/validationschema";
import { validate } from "../middleware/validate";

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
router.post("/", checkSchema(userValidationSchema), validate, createUser);

export default router;