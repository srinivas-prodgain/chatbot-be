
import { async_handler } from "../middleware/global-error-handler";
import { Router } from "express";
import { create_user } from "../controllers/user/create-user";
const router = Router();


router.post('/create-user', async_handler(create_user));

export const user_router = router;