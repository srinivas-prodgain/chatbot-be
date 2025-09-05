import mongoose from 'mongoose';
import { connect_to_db } from '../config/db';
import { seedAuthors } from './author-seed';
import { seedCollections } from './collection-seed';
import { seedArticles } from './article-seed';

async function runHelpSeed() {
    try {
        console.log('🚀 Starting help content seed process...');
        console.log('This will seed authors, collections, and articles for the help system.\n');

        // Connect to database
        await connect_to_db();

        // Seed authors first (required for articles)
        console.log('📝 Step 1: Seeding authors...');
        const authors = await seedAuthors();
        console.log(`✅ ${authors.length} authors created successfully!\n`);

        // Seed collections second
        console.log('📁 Step 2: Seeding collections with hierarchical structure...');
        const collections = await seedCollections();
        console.log(`✅ ${collections.length} collections created successfully!\n`);

        // Seed articles third (requires both authors and collections)
        console.log('📄 Step 3: Seeding help articles...');
        const articles = await seedArticles();
        console.log(`✅ ${articles.length} articles created successfully!\n`);

        console.log('🎉 Help content seed process completed successfully!');
        console.log(`📊 Summary: ${authors.length} authors + ${collections.length} collections + ${articles.length} articles = ${authors.length + collections.length + articles.length} total help records created`);

        // Display hierarchy overview
        console.log('\n📋 Collection Hierarchy Overview:');
        const rootCollections = collections.filter(c => c.level === 0);
        console.log(`└── Root Collections: ${rootCollections.length}`);

        const level1Collections = collections.filter(c => c.level === 1);
        console.log(`└── Sub Collections: ${level1Collections.length}`);

        const level2Collections = collections.filter(c => c.level === 2);
        console.log(`└── Sub-Sub Collections: ${level2Collections.length}`);

        console.log(`└── Total Articles: ${articles.length}`);

    } catch (error) {
        console.error('❌ Error in help seed process:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the help seed function
runHelpSeed();
