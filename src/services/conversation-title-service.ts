import { generateText } from 'ai';

import { model } from './ai';

const TITLE_SYSTEM_PROMPT = `You create concise, engaging titles for AI chat conversations. Summarize the exchange in six words or fewer. Output plain text with no surrounding quotes or trailing punctuation.`;
const MAX_TITLE_LENGTH = 100;

type TGenerateConversationTitleArgs = {
    user_message: string;
    ai_message: string;
};

const sanitize_title = (title: string): string => {
    const [first_line = ''] = (title ?? '').split('\n');
    const no_quotes = first_line.replace(/["'`]/g, '');
    const trimmed = no_quotes.trim().replace(/[.!?]+$/u, '').trim();
    return trimmed.slice(0, MAX_TITLE_LENGTH);
};

export const generate_conversation_title = async ({ user_message, ai_message }: TGenerateConversationTitleArgs): Promise<string | undefined> => {
    const user_content = (user_message ?? '').trim();
    const ai_content = (ai_message ?? '').trim();

    if (!user_content) {
        return undefined;
    }

    try {
        const { text } = await generateText({
            model,
            messages: [
                { role: 'system', content: TITLE_SYSTEM_PROMPT },
                { role: 'user', content: `User: ${user_content}\nAssistant: ${ai_content}` }
            ],
            maxOutputTokens: 50
        });

        const cleaned = sanitize_title(text);
        if (cleaned) {
            return cleaned;
        }
    } catch (error) {
        console.error('Failed to generate conversation title', error);
    }

    const fallback = sanitize_title(user_content.slice(0, MAX_TITLE_LENGTH));
    return fallback || undefined;
};
