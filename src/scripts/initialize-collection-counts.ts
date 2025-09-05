import mongoose from 'mongoose';
import { connect_to_db } from '../config/db';
import { initializeAllCollectionCounts } from '../utils/update-collection-article-count';

async function runInitialization() {
    try {
        console.log('🚀 Starting collection article count initialization...');

        // Connect to database
        await connect_to_db();

        // Initialize all collection counts
        await initializeAllCollectionCounts();

        console.log('✅ Collection article count initialization completed successfully!');

    } catch (error) {
        console.error('❌ Error during initialization:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the initialization
runInitialization();
