import { Router } from "express";

import { async_handler } from "../middleware/global-error-handler";
import { create_conversation } from "../controllers/conversations/create-conversation";
import { get_conversation_by_id } from "../controllers/conversations/get-conversation-by-id";
import { get_all_conversations } from "../controllers/conversations/get-all-conversations";

const router = Router();

router.post('/', async_handler(create_conversation));

router.get('/', async_handler(get_all_conversations));

router.get('/:_id', async_handler(get_conversation_by_id));

export { router as conversation_router };