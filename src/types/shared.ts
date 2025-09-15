import { Request, Response } from "express";

export type TrequestResponse = {
    req: Request;
    res: Response;
}

export const processing_status = ['processing', 'completed', 'failed', 'pending'] as const;
export type TProcessingStatus = (typeof processing_status)[number];


import { TPaginationResponse } from './pagination';

type TApiPromise<TData = undefined> = Promise<TApiSuccess<TData>> | Promise<TApiError>;
type TApiSuccess<TData = undefined> = {
    message: string;
    data?: TData;
    pagination?: TPaginationResponse;
};
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

export type { TApiError, TApiPromise, TApiSuccess };
