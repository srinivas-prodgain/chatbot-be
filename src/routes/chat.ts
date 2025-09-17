import { Router } from "express";

import { stream_chat } from "@/controllers/chat/stream-chat";

const router = Router();

router.post('/:_id', stream_chat);

export { router as chat_router };