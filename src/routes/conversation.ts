import { Router } from "express";

import { create_conversation } from "@/controllers/conversations/create-conversation";
import { get_conversation_by_id } from "@/controllers/conversations/get-conversation-by-id";
import { get_all_conversations } from "@/controllers/conversations/get-all-conversations";
import { delete_conversation } from "@/controllers/conversations/delete-conversation";

const router = Router();

// router.post('/', create_conversation);

router.get('/', get_all_conversations);

router.get('/:_id', get_conversation_by_id);

router.delete('/:_id', delete_conversation);

export { router as conversation_router };
