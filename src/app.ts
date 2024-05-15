import express, { Application } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import indexRoutes from './routes';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorFirstCallback';

dotenv.config();

const app: Application = express();
const server: http.Server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(indexRoutes);
app.use(cookieParser());
app.use(errorHandler);

export default server;
