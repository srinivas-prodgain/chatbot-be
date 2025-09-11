import { Router } from "express";

import { async_handler } from "../middleware/global-error-handler";
import { get_all_collections } from "../controllers/collection/get-all-collections";
import { get_collection_by_id } from "../controllers/collection/get-collection-by-id";

const router = Router();

router.get('/', async_handler(get_all_collections));

router.get('/:_id', async_handler(get_collection_by_id));

export { router as collection_router };