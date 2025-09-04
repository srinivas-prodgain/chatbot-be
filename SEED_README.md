# Database Seeding Guide

This guide explains how to populate your database with sample data.

## Posts Seeding

The posts seed script will create 10 diverse posts in your database with the following categories:
- Product announcements
- System updates  
- Events
- Feature releases
- General announcements

### Running the Seed Script

1. **Make sure your database is running** and the connection string is properly configured in your `.env` file.

2. **Run the seed command:**
   ```bash
   npm run seed:posts
   ```

### What the script does:

1. Connects to your MongoDB database
2. Clears existing posts (optional - you can comment out this line in the script)
3. Inserts 10 new sample posts
4. Displays a summary of created posts
5. Closes the database connection

### Sample Data Includes:

- **AI-Powered Chat Assistant** (product)
- **System Maintenance Scheduled** (announcement)
- **Virtual Tech Conference 2024** (event)
- **Enhanced Security Features** (update)
- **Real-time Collaboration Feature** (feature)
- **Mobile App Release** (product)
- **Privacy Policy Update** (announcement)
- **Developer Workshop** (event)
- **Performance Improvements** (update)
- **Advanced Analytics Dashboard** (feature)

Each post includes:
- Title and description
- High-quality stock images
- Relevant tags
- Action links
- Appropriate categories

### Customizing the Data

You can modify the posts data in `/src/seeds/post-seed.ts` to fit your specific needs. Make sure to follow the Post schema requirements:

- `title`: string (required)
- `description`: string (required)
- `imageUrl`: string (required)
- `linkUrl`: string (required) 
- `linkText`: string (default: 'Learn More')
- `category`: enum ['product', 'announcement', 'event', 'update', 'feature']
- `isActive`: boolean (default: true)
- `tags`: string array

### Troubleshooting

- **Database connection error**: Verify your `DB_URL` in the `.env` file
- **Permission errors**: Ensure your database user has write permissions
- **Duplicate key errors**: The script clears existing posts by default, but if you've disabled that, ensure no conflicts exist
