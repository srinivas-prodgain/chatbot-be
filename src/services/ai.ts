import { openai } from '@ai-sdk/openai';
import { VoyageAIClient } from 'voyageai';

// The OpenAI provider automatically uses OPENAI_API_KEY environment variable
export const model = openai('gpt-4o-mini');


type TGetEmbeddingArgs = {
    text: string;
};

const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY! });

export const get_embedding = async ({ text }: TGetEmbeddingArgs): Promise<number[] | undefined> => {
    const results = await client.embed({
        input: text,
        model: "voyage-3-large",
        outputDimension: 1024
    });
    return results?.data?.[0]?.embedding;
};
