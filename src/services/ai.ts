import { openai } from '@ai-sdk/openai';
// The OpenAI provider automatically uses OPENAI_API_KEY environment variable
export const model = openai('gpt-4o-mini');
