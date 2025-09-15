import { Router } from "express";

import { get_all_news } from "../controllers/news/get-all-news";
import { get_news_by_id } from "../controllers/news/get-news-by-id";
import { submit_news_reaction } from "../controllers/news/submit-news-reaction";

const router = Router();

router.get('/', get_all_news);

router.get('/:_id', get_news_by_id);

router.post('/:_id/reaction', submit_news_reaction);

export { router as news_router };
