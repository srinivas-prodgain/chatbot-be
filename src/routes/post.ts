import { async_handler } from "../middleware/global-error-handler";
import { Router } from "express";
import { get_posts } from "../controllers/post/get-posts";

const router = Router();

router.get('/get-posts', async_handler(get_posts));

export const post_router = router;