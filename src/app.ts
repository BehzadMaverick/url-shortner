import express, { Application } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Application = express();
const server: http.Server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

export default server;
