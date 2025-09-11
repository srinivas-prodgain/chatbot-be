import express, {
    Request,
    Response,
    NextFunction,
    json,
    urlencoded
} from 'express';


import cors from 'cors';
import morgan from 'morgan';

import env from './config/env';

import { user_router } from './routes/user';
import { global_error_handler } from './middleware/global-error-handler';
import { throw_error } from './utils/throw-error';
import { post_router } from './routes/post';
import { news_router } from './routes/news';
import { collection_router } from './routes/collection';
import { chat_router } from './routes/chat';
import { file_routes } from './routes/file';
import { conversation_router } from './routes/conversation';
import { article_router } from './routes/article';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(json({ limit: '50mb' }))
app.use(urlencoded({ limit: '50mb', extended: true }))
app.use(morgan('dev'))

app.use('/api/v1/user', user_router);
app.use('/api/v1/post', post_router);
app.use('/api/v1/news', news_router);
app.use('/api/v1/collection', collection_router);
app.use('/api/v1/article', article_router);
app.use('/api/v1/chat/stream', chat_router);
app.use('/api/v1/conversation', conversation_router);
app.use('/api/v1/file', file_routes);

// 404 handler
app.use((req: Request, res: Response) => {
    throw_error({ message: `The requested route ${req.originalUrl} does not exist`, status_code: 404 });
});

app.use(global_error_handler);

export default app;
