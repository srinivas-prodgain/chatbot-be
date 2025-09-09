import { Router } from "express";
import { async_handler } from "../middleware/global-error-handler";
import { create_conversation } from "../controllers/conversations/create-conversation";
import { get_conversation_by_id } from "../controllers/conversations/get-conversation-by-id";
import { get_all_conversations } from "../controllers/conversations/get-all-conversations";

const router = Router();

// POST /api/conversation - Create a new conversation
router.post('/', async_handler(create_conversation));

// POST /api/conversation/all - Get all conversations for a user (with pagination)
router.post('/all', async_handler(get_all_conversations));

// GET /api/conversation/:id - Get a specific conversation by ID with all messages
router.get('/:id', async_handler(get_conversation_by_id));

export const conversation_router = router;
