import { NextFunction, Request, Response } from 'express'

import env from '../config/env';

import { extract_user_agent_info } from '../utils/functions'

export const success_handler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const original_json = res.json

    res.json = function (json: any): Response {
        if (env.is_prod === true || Number(res.statusCode) < 400) {
            const device_info = extract_user_agent_info(req)

            const ip = env.is_dev
                ? 'localhost'
                : req.ip ||
                req.socket.remoteAddress ||
                (Array.isArray(req.headers['x-forwarded-for'])
                    ? req.headers['x-forwarded-for'][0]
                    : req.headers['x-forwarded-for']) ||
                'unknown'

            console.log({
                message: json.message || 'Successful request',
                app: 'API',
                meta: {
                    req: {
                        path: `[${req.method}] ${req.path}`,
                        query: req.query,
                        body: req.body,
                        ip,
                        user_id: 'NA'
                    },
                    res: {
                        status: res.statusCode,
                        json
                    },
                    device_info: env.is_prod ? device_info : undefined
                }
            })
        }

        return original_json.call(this, json)
    }

    next()
}
