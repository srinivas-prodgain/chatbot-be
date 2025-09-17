import { Router } from "express";

import { get_posts } from "@/controllers/post/get-posts";

const router = Router();

router.get('/', get_posts);

export { router as post_router };