import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { generateErrorMessage } from 'zod-error';

// import { log } from '@sales-os/logger'
import type { TApiError } from '@/types/shared';
import CustomError from '@/utils/CustomError';

export const error_handler = (
    err: Error | ZodError | CustomError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let custom_error: TApiError = err as TApiError

    if (err instanceof ZodError) {
        custom_error = { ...handle_zod_error(err), stack: err.stack }
    }

    send_error_as_response(custom_error, req, res)
}

const handle_zod_error = (err: ZodError): TApiError => {
    const invalid_fields = err.issues.map((error) => error.path.join('.'))

    const formatted_message = generateErrorMessage(err.issues, {
        maxErrors: 1,
        path: {
            enabled: false
        },
        code: {
            enabled: false
        },
        message: {
            enabled: true,
            label: ''
        }
    })

    return {
        message:
            formatted_message ||
            'Invalid input. Please check your entries and try again.',
        status_code: 400,
        validation_error: {
            fields: invalid_fields,
            details: err.issues.map((error) => ({
                field: error.path.join('.'),
                message: error.message,
                code: error.code
            }))
        }
    }
}

const send_error_as_response = (
    err: TApiError,
    req: Request,
    res: Response
): void => {
    const error_response: TApiError = {
        message: err.message || 'Unknown error occurred',
        status_code: err.status_code || 500,
        stack: err.stack,
        validation_error: err.validation_error
    }

    // const device_info = extract_user_agent_info(req)

    // const ip = IS_DEV
    //     ? 'localhost'
    //     : req.ip ||
    //     req.socket.remoteAddress ||
    //     (Array.isArray(req.headers['x-forwarded-for'])
    //         ? req.headers['x-forwarded-for'][0]
    //         : req.headers['x-forwarded-for']) ||
    //     'unknown'

    // const should_notify_slack =
    //     error_response.status_code >= 500 || error_response.status_code === 429

    // console.error({
    //     message: error_response.message,
    //     app: 'API',
    //     notify_on_slack: should_notify_slack,
    //     meta: {
    //         req: {
    //             path: `[${req.method}] ${req.path}`,
    //             query: req.query,
    //             body: req.body,
    //             ip,
    //             user_id: req.user?._id.toString() || 'NA'
    //         },
    //         res: {
    //             status: error_response.status_code,
    //             json: {
    //                 message: error_response.message,
    //                 validation_error: error_response.validation_error
    //             }
    //         },
    //         stack: error_response.stack,
    //         device_info: IS_PROD ? device_info : undefined
    //     }
    // })

    res.status(error_response.status_code).json(error_response)
}
