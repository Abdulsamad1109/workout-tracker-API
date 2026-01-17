import express from 'express';
import cors from 'cors';
import userRouter from './routes/users';
import authRouter from './routes/auth';
import { query, validationResult } from 'express-validator';
import { swaggerSpec } from './congfig/swagger';
import swaggerUi from 'swagger-ui-express';




export function createApp() {
    const app = express();

    app.use(cors());

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    app.use('/api/users', userRouter);

    app.use('/api/auth', authRouter);

    app.get('/greet', query('person').notEmpty().escape(), (req, res) => {
        const result = validationResult(req);

        console.log('req.query.person:', req.query.person);
        console.log('Type:', typeof req.query.person);

        if (result.isEmpty()) {
            return res.send(`Hello, ${req.query.person}!`);
        }

        res.send({ errors: result.array() });
        });

    return app;
}