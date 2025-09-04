import { z } from 'zod';
import { mg } from '../../config/mg';
import { throw_error } from '../../utils/throw-error';
import { themes, languages } from '../../models/user';
import { TrequestResponse } from '../../types/shared';


export const create_user = async ({ req, res }: TrequestResponse) => {

    const { user_id, preferences } = create_user_schema.parse(req.body);

    const user = await mg.User.findOne({ _id: user_id });
    if (user) {
        throw_error({ message: 'User already exists', status_code: 400 });
    }

    await mg.User.create({ _id: user_id, preferences });

    res.status(200).json({
        message: 'User created successfully'
    })
}

const create_user_schema = z.strictObject({
    user_id: z.string(),
    preferences: z.object({
        theme: z.enum(themes),
        language: z.enum(languages)
    }).optional()
})


