import { Router } from "express";

import { get_article_by_id } from "../controllers/help/get-article-by-id";
import { submit_article_reaction } from "../controllers/help/submit-article-reaction";
import { get_articles_by_search } from "../controllers/help/get-articles-by-search";
import { get_top_articles } from "../controllers/help/get-top-articles";
import { async_handler } from "../middleware/global-error-handler";


const router = Router();

router.get('/top', async_handler(get_top_articles));

router.get('/', async_handler(get_articles_by_search));

router.get('/:_id', async_handler(get_article_by_id));

router.post('/:_id/reaction', async_handler(submit_article_reaction));

export { router as article_router };