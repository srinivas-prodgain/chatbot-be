import { Router } from "express";

import { get_article_by_id } from "@/controllers/article/get-article-by-id";
import { submit_article_reaction } from "@/controllers/article/submit-article-reaction";
import { get_articles_by_search } from "@/controllers/article/get-articles-by-search";
import { get_top_articles } from "@/controllers/article/get-top-articles";


const router = Router();

router.get('/top', get_top_articles);

router.get('/', get_articles_by_search);

router.get('/:_id', get_article_by_id);

router.post('/:_id/reaction', submit_article_reaction);

export { router as article_router };