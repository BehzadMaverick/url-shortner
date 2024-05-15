import express, { Application } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import indexRoutes from './routes';
import Socket from './sockets'
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorFirstCallback';

dotenv.config();

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
  cookie: true
});
new Socket(io).initializeSocket();

app.use(express.json());
app.use(cors());
app.use(indexRoutes);
app.use(cookieParser());
app.use(errorHandler);

export default server;
