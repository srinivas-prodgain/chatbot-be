import { Request, Response } from 'express';
import { z } from 'zod';

import { mg } from '@/configs/mg';
import { USER_THEMES, USER_LANGUAGES } from '@/constants/user';
import { z_object_id } from '@/utils/schema';
import { throw_error } from '@/utils/throw-error';


export const create_user = async (req: Request, res: Response) => {

    const { preferences } = z_create_user_req_body.parse(req.body);
    const { user_id } = z_create_user_req_query.parse(req.query);

    const user = await mg.User.findOne({ _id: user_id });
    if (user) {
        throw_error('User already exists', 400);
    }

    await mg.User.create({ _id: user_id, preferences });

    res.status(200).json({
        message: 'User created successfully'
    })
}

const z_create_user_req_query = z.object({
    user_id: z_object_id
});

const z_create_user_req_body = z.strictObject({
    preferences: z.object({
        theme: z.enum(USER_THEMES),
        language: z.enum(USER_LANGUAGES)
    }).optional()
})


