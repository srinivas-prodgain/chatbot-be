import { Router } from "express";

import { async_handler } from "../middleware/global-error-handler";
import { get_all_news } from "../controllers/news/get-all-news";
import { get_news_by_id } from "../controllers/news/get-news-by-id";
import { submit_news_reaction } from "../controllers/news/submit-news-reaction";

const router = Router();

router.get('/', async_handler(get_all_news));

router.get('/:_id', async_handler(get_news_by_id));

router.post('/:_id/reaction', async_handler(submit_news_reaction));

export { router as news_router };
