import express from 'express';
import userRouter from './routes/users';
import { query, validationResult } from 'express-validator';
import { swaggerSpec } from './congfig/swagger';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';



export function createApp() {
    const app = express();

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    app.use('/api/users', userRouter);

    app.use(cors());

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