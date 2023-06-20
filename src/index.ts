import express, { Application } from 'express';

import { connectDB } from './config/db'; 

const app: Application = express();

app.use(express.json());

await connectDB();

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