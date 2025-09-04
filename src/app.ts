import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env';
import { user_router } from './routes/user';
import { global_error_handler } from './middleware/global-error-handler';
import { throw_error } from './utils/throw-error';

const app: Application = express();

app.use(cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));
app.use(express.json());

app.use('/user', user_router);


app.use('/', (req: Request, res: Response) => {
    res.send('Chatbot Backend Server is running');
});


// 404 handler
app.use((req: Request, res: Response) => {
    throw_error({ message: `The requested route ${req.originalUrl} does not exist`, status_code: 404 });
});

app.use(global_error_handler);

export default app;
