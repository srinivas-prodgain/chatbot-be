export const processing_status = ['processing', 'completed', 'failed', 'pending'] as const;
export type TProcessingStatus = (typeof processing_status)[number];

type TApiError = {
    message: string;
    status_code: number;
    stack?: string;
    validation_error?: {
        fields: string[];
        details: {
            field: string;
            message: string;
            code: string;
        }[];
    };
};

export type { TApiError };