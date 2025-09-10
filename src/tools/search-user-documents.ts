import { tool } from 'ai';
import { z } from 'zod';

import { document_embeddings_mongodb_service } from '../classes/document-embeddings-mongodb-service';


export const search_user_documents = tool({
    description: 'Search through user uploaded documents and files for relevant information based on a query',
    inputSchema: z.object({
        query: z.string().describe('The search query to find relevant content in user documents'),
        user_id: z.string().describe('The ID of the user whose documents to search'),
    }),
    execute: async ({ query, user_id }) => {
        try {
            // Use the actual document search service
            const searchResults = await document_embeddings_mongodb_service.search_similar_documents({
                query,
                user_id,
                max_results: 5
            });

            if (!searchResults || searchResults.length === 0 || !searchResults[0] || searchResults[0].length === 0) {
                return {
                    success: true,
                    message: `No relevant documents found for query: "${query}". Make sure you have uploaded documents that contain information related to your question.`,
                    documents: []
                };
            }

            const documents = searchResults[0]; // Extract the content array

            return {
                success: true,
                message: `Found ${documents.length} relevant document excerpt(s) matching your query: "${query}"`,
                documents: documents
            };
        } catch (error) {
            console.error('Error searching user documents:', error);
            return {
                success: false,
                message: 'An error occurred while searching your documents. Please try again.',
                documents: []
            };
        }
    },
});