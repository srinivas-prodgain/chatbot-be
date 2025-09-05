import { z } from 'zod';
import { TrequestResponse } from '../../types/shared';
import { streamText } from 'ai';
import { model } from '../../services/ai';


export const stream_chat = async ({ req, res }: TrequestResponse) => {

    const { message } = chatRequestSchema.parse(req.body);

    const result = streamText({
        model,
        messages: [{ role: 'user', content: message }],
        maxOutputTokens: 1000,
    });

    result.pipeTextStreamToResponse(res);
};

const chatRequestSchema = z.strictObject({
    message: z.string(),
});