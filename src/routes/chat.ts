import { Router } from "express";

import { async_handler } from "../middleware/global-error-handler";
import { stream_chat } from "../controllers/chat/stream-chat";

const router = Router();

router.post('/:_id', async_handler(stream_chat));

export { router as chat_router };