import { mg } from '@/config/mg';

/**
 * Updates the total_articles count for a collection hierarchy
 * This function calculates and updates the count for the collection and all its parent collections
 */
export async function update_collection_article_count(collectionId: any) {
    try {
        const collection = await mg.Collection.findById(collectionId);
        if (!collection) return;

        // Calculate total articles for this collection
        const total_articles = await calculate_collection_article_count(collectionId);

        // Update this collection's count
        await mg.Collection.findByIdAndUpdate(collectionId, {
            total_articles: total_articles
        });

        // If this collection has a parent, update parent counts recursively
        if (collection.parent_collection) {
            await update_collection_article_count(collection.parent_collection);
        }
    } catch (error) {
        console.error('Error updating collection article count:', error);
    }
}

/**
 * Calculates the total number of articles in a collection hierarchy
 * Includes articles directly in the collection and all sub-collections
 */
async function calculate_collection_article_count(collectionId: any): Promise<number> {
    try {
        // Count articles directly in this collection
        const direct_articles = await mg.Article.countDocuments({
            collection_id: collectionId,
            is_published: true
        });

        // Find all sub-collections
        const sub_collections = await mg.Collection.find({
            parent_collection: collectionId,
            is_published: true
        }).select('_id');

        let subArticles = 0;

        // Recursively count articles in sub-collections
        for (const subCollection of sub_collections) {
            subArticles += await calculate_collection_article_count(subCollection._id);
        }

        return direct_articles + subArticles;
    } catch (error) {
        console.error('Error calculating collection article count:', error);
        return 0;
    }
}

/**
 * Initializes article counts for all collections
 * Use this function to populate the total_articles field for existing collections
 */
export async function initialize_all_collection_counts() {
    try {
        console.log('🔄 Initializing article counts for all collections...');

        const collections = await mg.Collection.find({}).sort({ level: -1 }); // Start from deepest level

        for (const collection of collections) {
            const total_articles = await calculate_collection_article_count(collection._id);
            await mg.Collection.findByIdAndUpdate(collection._id, {
                total_articles: total_articles
            });
            console.log(`✅ Updated ${collection.title}: ${total_articles} articles`);
        }

        console.log('🎉 All collection article counts initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing collection counts:', error);
    }
}
