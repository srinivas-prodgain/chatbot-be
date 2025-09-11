
import { Router } from "express";

import { async_handler } from "../middleware/global-error-handler";
import { create_user } from "../controllers/user/create-user";

const router = Router();

router.post('/', async_handler(create_user));

export { router as user_router };