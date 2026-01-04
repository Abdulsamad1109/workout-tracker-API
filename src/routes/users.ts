import { Router } from "express";
import { createUser, getAllUsers, getUserById } from "../handlers/users";
import { checkSchema, validationResult } from "express-validator";
import { userValidationShema } from "../validators/validationschema";
import { validate } from "../validators/validate";

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
 *         description: Validation error
 */
router.post("/", checkSchema(userValidationShema), validate, createUser);

export default router;