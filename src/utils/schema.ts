import { Types } from 'mongoose'
import { z } from 'zod'

export const z_object_id = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
    .transform((val) => new Types.ObjectId(val))

export const z_pagination = (page = '1', limit = '20') =>
    z.object({
        page: z
            .string()
            .optional()
            .default(page)
            .transform(Number)
            .refine((val) => val >= 1, {
                message: 'Page number must be greater than or equal to 1'
            }),
        limit: z
            .string()
            .optional()
            .default(limit)
            .transform(Number)
            .refine((val) => val >= 1, {
                message: 'Limit must be greater than or equal to 1'
            })
    })
