import mongoose from 'mongoose';
import { connect_to_db } from '../config/db';
import { seedAuthors } from './author-seed';
import { seedNews } from './news-seed';
import { seedCollections } from './collection-seed';
import { seedArticles } from './article-seed';

async function runMasterSeed() {
    try {
        console.log('🚀 Starting master seed process...');
        console.log('This will seed authors, collections, articles, and news in the correct order.\n');

        // Connect to database
        await connect_to_db();

        // Seed authors first (required for articles and news references)
        console.log('📝 Step 1: Seeding authors...');
        const authors = await seedAuthors();
        console.log(`✅ ${authors.length} authors created successfully!\n`);

        // Seed collections second (required for articles)
        console.log('📁 Step 2: Seeding collections...');
        const collections = await seedCollections();
        console.log(`✅ ${collections.length} collections created successfully!\n`);

        // Seed articles third (requires both authors and collections)
        console.log('📄 Step 3: Seeding articles...');
        const articles = await seedArticles();
        console.log(`✅ ${articles.length} articles created successfully!\n`);

        // Finally seed news articles
        console.log('📰 Step 4: Seeding news articles...');
        const news = await seedNews();
        console.log(`✅ ${news.length} news articles created successfully!\n`);

        console.log('🎉 Master seed process completed successfully!');
        console.log(`📊 Summary: ${authors.length} authors + ${collections.length} collections + ${articles.length} articles + ${news.length} news articles = ${authors.length + collections.length + articles.length + news.length} total records created`);

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
