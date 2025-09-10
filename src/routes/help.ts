import { async_handler } from "../middleware/global-error-handler";
import { Router } from "express";
import { get_all_collections } from "../controllers/help/get-all-collections";
import { get_collection_by_id } from "../controllers/help/get-collection-by-id";
import { get_article_by_id } from "../controllers/help/get-article-by-id";
import { submit_article_reaction } from "../controllers/help/submit-article-reaction";
import { get_articles_by_search } from "../controllers/help/get-articles-by-search";
import { get_top_articles } from "../controllers/help/get-top-articles";

const router = Router();

router.get('/collections', async_handler(get_all_collections));
router.get('/collections/:collection_id', async_handler(get_collection_by_id));
router.get('/articles/top', async_handler(get_top_articles));
router.get('/articles/search', async_handler(get_articles_by_search));
router.get('/articles/:article_id', async_handler(get_article_by_id));
router.post('/articles/:article_id/reaction', async_handler(submit_article_reaction));

export const help_router = router;