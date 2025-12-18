import express, { Request, Response } from 'express';
import userRouter from './routes/users';


const app = express();

const PORT = process.env.PORT || 3000;

app.use('/api/users', userRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

