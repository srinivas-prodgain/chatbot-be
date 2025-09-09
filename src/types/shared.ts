import { Request, Response } from "express";

export type TrequestResponse = {
    req: Request;
    res: Response;
}

export const processing_status = ['processing', 'completed', 'failed', 'pending'] as const;
export type TProcessingStatus = (typeof processing_status)[number];
