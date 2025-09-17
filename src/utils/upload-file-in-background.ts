import fs from 'fs';

import { document_embeddings_mongodb_service } from '@/classes/document-embeddings-mongodb-service';
import { mg } from '@/config/mg';

export type TProcessFileInBackgroundArgs = {
    file_path: string;
    file_id: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    user_id: string;
}

export const process_file_in_background = async ({ file_path, file_id, file_name, file_size, mime_type, user_id }: TProcessFileInBackgroundArgs): Promise<void> => {
    try {
        console.log(`Starting background processing for file: ${file_name} (ID: ${file_id})`);

        await mg.DocumentFile.findOneAndUpdate(
            { _id: file_id },
            { processing_status: 'processing' }
        );

        await document_embeddings_mongodb_service.process_and_store_document({
            file_path,
            file_name,
            file_size,
            mime_type,
            file_id,
            user_id
        });

        console.log(`Background processing completed for file: ${file_name}`);

    } catch (error: unknown) {
        const error_message = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Background processing failed for file ${file_name}:`, error);

        await mg.DocumentFile.findOneAndUpdate(
            { _id: file_id },
            {
                processing_status: 'failed',
                error_message: error_message
            }
        );
    } finally {
        if (fs.existsSync(file_path)) {
            fs.unlinkSync(file_path);
            console.log(`Cleaned up temporary file: ${file_path}`);
        }
    }
};