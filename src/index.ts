import express, { Application } from 'express';
import dotenv from "dotenv";

import { errorHandler } from './utils/errorHandler';
import { connectDB } from './config/db'; 
import userRouter from './routes/user.route';

dotenv.config();

await connectDB();

const app: Application = express();

app.use(express.json());

// API Routes
app.use('/api/user', userRouter);

app.use(errorHandler);

const startServer = (port: string | number) => {
    try {
        app.listen(port, (): void => {
            console.log(`Server started on port ${port}`)
        })
    } catch (error) {
        console.error(`
            Error occured while starting server: ${error}
        `)
        process.exit(1);
    }
}

startServer(process.env.PORT || 8080);