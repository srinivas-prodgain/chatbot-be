import { async_handler } from "../middleware/global-error-handler";
import { Router } from "express";
import { get_all_news } from "../controllers/news/get-all-news";
import { get_news_by_id } from "../controllers/news/get-news-by-id";

const router = Router();

router.get('/', async_handler(get_all_news));
router.get('/:id', async_handler(get_news_by_id));

export const news_router = router;
