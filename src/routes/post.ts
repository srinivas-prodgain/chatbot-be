import { Router } from "express";

import { async_handler } from "../middleware/global-error-handler";
import { get_posts } from "../controllers/post/get-posts";

const router = Router();

router.get('/', async_handler(get_posts));

export { router as post_router };