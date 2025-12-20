import express, { Request, Response } from 'express';
import userRouter from './routes/users';



export function createApp() {
    const app = express();

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    
    app.use('/api/users', userRouter);
    
    return app;
}