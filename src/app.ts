import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env';
import { user_router } from './routes/user';
import { global_error_handler } from './middleware/global-error-handler';
import { throw_error } from './utils/throw-error';
import { post_router } from './routes/post';
import { news_router } from './routes/news';
import { help_router } from './routes/help';
import { chat_router } from './routes/chat';

const app: Application = express();

app.use(cors({
    origin: [
        env.frontendUrl,
        /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,  // Allow local network IPs
        /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/, // Allow 10.x.x.x network
        /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}(:\d+)?$/ // Allow 172.16-31.x.x
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('combined'));
app.use(express.json());

app.use('/user', user_router);
app.use('/post', post_router);
app.use('/news', news_router);
app.use('/help', help_router);
app.use('/chat', chat_router);


// app.use('/', (req: Request, res: Response) => {
//     res.send('Chatbot Backend Server is running');
// });


// 404 handler
app.use((req: Request, res: Response) => {
    throw_error({ message: `The requested route ${req.originalUrl} does not exist`, status_code: 404 });
});

app.use(global_error_handler);

export default app;
