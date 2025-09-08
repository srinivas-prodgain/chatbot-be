import { mg } from '../../config/mg';
import { TrequestResponse } from '../../types/shared';
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


export const handle_upload = async ({ req, res }: TrequestResponse) => {


    if (!req.file) {
        throw_error({ message: 'No file uploaded', status_code: 400 });
        return;
    }

    const user_id = upload_file_schema.parse(req.body).user_id;


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
        throw_error({ message: `File upload failed: ${error}`, status_code: 500 });
    });

};


const upload_file_schema = z.object({
    user_id: z.string()
}); 