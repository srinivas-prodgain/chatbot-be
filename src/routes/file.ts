import { Router } from 'express';

import { handle_upload } from '@/controllers/file/upload-file';
import { upload_middleware } from '@/middleware/file-upload';

const router = Router();

router.post('/upload',
    upload_middleware.single('file'),
    handle_upload
);

export { router as file_routes }; 
