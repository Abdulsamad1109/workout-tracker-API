"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const data_source_1 = require("../data-source");
const userEntity_1 = require("../entities/userEntity");
const hashpassword_1 = require("../helper.ts/hashpassword");
const jwt_1 = require("../utils/jwt");
//TypeORM repository
const userRepository = data_source_1.AppDataSource.getRepository(userEntity_1.User);
const login = async (req, res) => {
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
        const validPassword = await (0, hashpassword_1.comparePassword)(password, user.password);
        console.log("password from request:", password);
        console.log("password in database:", user.password);
        console.log("validPassword result:", validPassword);
        if (!validPassword) {
            res.status(401).json({ error: 'Invalid credentialss' });
            return;
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
        });
        res.status(200).send({
            message: 'Login successful',
            token
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ error: 'Server error' });
    }
};
exports.login = login;
//# sourceMappingURL=auth.js.map