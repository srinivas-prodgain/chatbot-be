import { Router } from 'express';

import { handle_upload } from '../controllers/file/upload-file';
import { upload_middleware } from '../middleware/file-upload';
import { async_handler } from '../middleware/global-error-handler';

const router = Router();

router.post('/upload',
    upload_middleware.single('file'),
    async_handler(handle_upload)
);

export { router as file_routes }; 
