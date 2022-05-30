import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import router from './router';
import addContext from './middleware/addContext';
import { AppDataSource } from './data/dataSource';

async function startServer() {
    const app = express();
    app.use(express.json());
    app.use(addContext);
    app.use(router);

    await AppDataSource.initialize().catch(e => {
        console.log('Error connecting to DB');
        throw e;
    })
    console.log('DB connected');
    
    const PORT = process.env.PORT || 8012;
    app.listen(PORT, () => {
        console.log(`Express server is listening at ${PORT}`);
    });
}

startServer();