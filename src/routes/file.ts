import express, { Router } from 'express';

import { handle_upload } from '../controllers/file/upload-file';
import { upload_middleware } from '../middleware/file-upload';
import { async_handler } from '../middleware/global-error-handler';



const router: Router = express.Router();


router.post('/upload',
    upload_middleware.single('file'),
    async_handler(handle_upload)
);

export const file_routes = router; 
