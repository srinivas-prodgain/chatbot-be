import { Request, Response } from "express";

export type TrequestResponse = {
    req: Request;
    res: Response;
}