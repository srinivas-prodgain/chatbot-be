
import { Router } from "express";

import { create_user } from "@/controllers/user/create-user";

const router = Router();

router.post('/', create_user);

export { router as user_router };