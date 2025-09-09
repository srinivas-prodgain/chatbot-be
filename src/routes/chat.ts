import { async_handler } from "../middleware/global-error-handler";
import { Router } from "express";
import { stream_chat } from "../controllers/chat/stream-chat";

const router = Router();

// POST /api/chat/stream - Stream chat responses using SSE
router.post('/stream', async_handler(stream_chat));

export const chat_router = router;