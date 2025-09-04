# Database Seeding

This directory contains seed files for populating the database with sample data.

## Available Seed Files

### 1. Author Seed (`author-seed.ts`)
Seeds the database with author records containing:
- ✅ **name**: Author's full name
- ✅ **email**: Unique email address  
- ✅ **profileImage**: Profile image URL
- ✅ **bio**: Author biography (up to 500 characters)
- ✅ **role**: Author's role/title
- ✅ **socialLinks**: LinkedIn and Twitter URLs
- ✅ **isActive**: Active status flag
- ✅ **timestamps**: Created/updated timestamps

**Sample data**: 8 diverse authors with realistic profiles

### 2. News Seed (`news-seed.ts`)
Seeds the database with news articles containing:
- ✅ **title**: Article title
- ✅ **slug**: URL-friendly slug (auto-generated)
- ✅ **content**: Full article content
- ✅ **imageUrl**: Main article image
- ✅ **thumbnailUrl**: Thumbnail image
- ✅ **author**: Reference to Author model
- ✅ **category**: News category (ai-news, company-news, product-update, industry, technology, announcement)
- ✅ **tags**: Array of relevant tags
- ✅ **publishedAt**: Publication date
- ✅ **isPublished**: Publication status
- ✅ **isFeatured**: Featured article flag
- ✅ **readTime**: Estimated reading time (auto-calculated)
- ✅ **timestamps**: Created/updated timestamps

**Sample data**: 8 comprehensive news articles across different categories

### 3. Master Seed (`master-seed.ts`)
Runs both author and news seeds in the correct order.

## Usage

### Individual Seeds

```bash
# Seed authors only
npx ts-node src/seeds/author-seed.ts

# Seed news only (requires authors to exist)
npx ts-node src/seeds/news-seed.ts
```

### Master Seed (Recommended)

```bash
# Seed everything in correct order
npx ts-node src/seeds/master-seed.ts
```

## Features

- **Automatic slug generation** from article titles
- **Read time estimation** based on content length (200 words/minute)
- **Author-news relationship** with proper ObjectId references
- **Data validation** using Mongoose schemas
- **Comprehensive logging** with progress indicators
- **Error handling** with detailed error messages
- **Database cleanup** option (clear existing data before seeding)

## Schema Coverage

Both seed files include ALL fields from their respective Mongoose schemas:

### Author Schema ✅ Complete
- All required fields populated
- Optional fields (bio, socialLinks) included
- Proper data types and validation

### News Schema ✅ Complete  
- All required fields populated
- Proper category enum values
- Author references with valid ObjectIds
- Calculated fields (slug, readTime)
- Mixed content types (strings, arrays, booleans, dates)

## Notes

- Seeds will clear existing data by default (can be disabled)
- Authors must be seeded before news (due to foreign key relationship)
- All sample data uses realistic, professional content
- Images sourced from Unsplash with proper dimensions
- Timestamps are varied to simulate realistic publication schedules
