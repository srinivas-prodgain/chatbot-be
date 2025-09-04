import mongoose from 'mongoose';
import { connect_to_db } from '../config/db';
import { seedAuthors } from './author-seed';
import { seedNews } from './news-seed';

async function runMasterSeed() {
    try {
        console.log('🚀 Starting master seed process...');
        console.log('This will seed both authors and news articles in the correct order.\n');

        // Connect to database
        await connect_to_db();

        // Seed authors first (required for news references)
        console.log('📝 Step 1: Seeding authors...');
        const authors = await seedAuthors();
        console.log(`✅ ${authors.length} authors created successfully!\n`);

        // Then seed news articles
        console.log('📰 Step 2: Seeding news articles...');
        const news = await seedNews();
        console.log(`✅ ${news.length} news articles created successfully!\n`);

        console.log('🎉 Master seed process completed successfully!');
        console.log(`📊 Summary: ${authors.length} authors + ${news.length} news articles = ${authors.length + news.length} total records created`);

    } catch (error) {
        console.error('❌ Error in master seed process:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the master seed function
runMasterSeed();
