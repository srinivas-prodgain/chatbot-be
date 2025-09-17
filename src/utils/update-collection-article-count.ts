import { mg } from '@/config/mg';

/**
 * Collection Article Count Utilities
 * 
 * Performance Optimizations Applied:
 * 1. Replaced recursive N+1 queries with MongoDB $graphLookup aggregation
 * 2. Used bulk operations instead of sequential database updates
 * 3. Implemented parallel processing for multiple collection calculations
 * 
 * Previous Issues Fixed:
 * - N+1 query problem in recursive collection traversal
 * - Sequential database updates causing performance bottlenecks
 */

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
 * Calculates the total number of articles in a collection hierarchy using MongoDB aggregation
 * Includes articles directly in the collection and all sub-collections
 * Optimized to avoid N+1 query problems by using aggregation pipelines
 */
async function calculate_collection_article_count(collectionId: any): Promise<number> {
    try {
        // Get all descendant collections in the hierarchy using aggregation
        const descendant_collections_pipeline = [
            {
                $match: { _id: collectionId }
            },
            {
                $graphLookup: {
                    from: 'collections',
                    startWith: '$_id',
                    connectFromField: '_id',
                    connectToField: 'parent_collection',
                    as: 'descendants',
                    restrictSearchWithMatch: { is_published: true }
                }
            },
            {
                $project: {
                    all_collection_ids: {
                        $concatArrays: [
                            ['$_id'], // Include the root collection
                            '$descendants._id' // Include all descendant collections
                        ]
                    }
                }
            }
        ];

        const hierarchy_result = await mg.Collection.aggregate(descendant_collections_pipeline);

        if (!hierarchy_result.length) {
            return 0;
        }

        const all_collection_ids = hierarchy_result[0].all_collection_ids;

        // Count all published articles in the entire hierarchy using a single query
        const total_articles = await mg.Article.countDocuments({
            collection_id: { $in: all_collection_ids },
            is_published: true
        });

        return total_articles;
    } catch (error) {
        console.error('Error calculating collection article count:', error);
        return 0;
    }
}

/**
 * Initializes article counts for all collections using batch operations
 * Use this function to populate the total_articles field for existing collections
 * Optimized to avoid sequential database updates by using bulk operations
 */
export async function initialize_all_collection_counts() {
    try {
        console.log('🔄 Initializing article counts for all collections...');

        const collections = await mg.Collection.find({}).sort({ level: -1 }); // Start from deepest level

        // Calculate counts for all collections in parallel
        const count_promises = collections.map(async (collection) => {
            const total_articles = await calculate_collection_article_count(collection._id);
            return {
                collection_id: collection._id,
                title: collection.title,
                total_articles
            };
        });

        const collection_counts = await Promise.all(count_promises);

        // Prepare bulk update operations
        const bulk_operations = collection_counts.map(({ collection_id, total_articles }) => ({
            updateOne: {
                filter: { _id: collection_id },
                update: { $set: { total_articles } }
            }
        }));

        // Execute bulk update
        if (bulk_operations.length > 0) {
            await mg.Collection.bulkWrite(bulk_operations);
        }

        // Log results
        collection_counts.forEach(({ title, total_articles }) => {
            console.log(`✅ Updated ${title}: ${total_articles} articles`);
        });

        console.log('🎉 All collection article counts initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing collection counts:', error);
    }
}
