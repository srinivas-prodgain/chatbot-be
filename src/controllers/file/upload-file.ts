import { mg } from '../../config/mg';
import { Request, Response } from 'express';
import { TProcessingStatus } from '../../types/shared';
import { throw_error } from '../../utils/throw-error';
import { process_file_in_background } from '../../utils/upload-file-in-background';
import { z } from 'zod';

export type TUploadResponse = {
    file_id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    user_id: string;
    status: TProcessingStatus;
    message: string;
}


export const handle_upload = async (req: Request, res: Response) => {

    if (!req.file) {
        throw_error('No file uploaded', 400);
    }

    const { user_id } = z_upload_file_req_query.parse(req.query);


    const document_file = await mg.DocumentFile.create({
        file_name: req.file.originalname,
        file_size: req.file.size,
        file_type: req.file.mimetype,
        user_id,
        upload_date: new Date(),
        processing_status: 'pending',
        chunk_count: 0
    });



    res.status(200).json({
        message: 'File uploaded successfully. Processing will begin shortly.'
    })

    process_file_in_background({
        file_path: req.file.path,
        file_id: document_file._id.toString(),
        file_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        user_id
    }).catch(error => {
        throw_error(`File upload failed: ${error}`, 500);
    });

};


const z_upload_file_req_query = z.object({
    user_id: z.string().min(1, 'User ID is required')
}); 