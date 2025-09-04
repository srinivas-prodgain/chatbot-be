import mongoose from 'mongoose';
import { Post } from '../models/post';
import { connect_to_db } from '../config/db';

const postsData = [
    {
        title: "Introducing AI-Powered Chat Assistant",
        description: "Experience the future of customer support with our new AI-powered chat assistant. Get instant, intelligent responses to your queries 24/7. Our advanced natural language processing ensures accurate and helpful interactions every time.",
        imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/ai-chat-assistant",
        linkText: "Try AI Assistant",
        category: "product",
        isActive: true,
        tags: ["AI", "chatbot", "customer-support", "automation"]
    },
    {
        title: "System Maintenance Scheduled",
        description: "We will be performing scheduled maintenance on our servers this Sunday from 2:00 AM to 6:00 AM UTC. During this time, some services may be temporarily unavailable. We apologize for any inconvenience.",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/maintenance-schedule",
        linkText: "View Details",
        category: "announcement",
        isActive: true,
        tags: ["maintenance", "system-update", "downtime"]
    },
    {
        title: "Virtual Tech Conference 2024",
        description: "Join us for the biggest virtual technology conference of the year! Connect with industry leaders, attend innovative workshops, and discover the latest trends in AI, blockchain, and cloud computing.",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/tech-conference-2024",
        linkText: "Register Now",
        category: "event",
        isActive: true,
        tags: ["conference", "technology", "virtual-event", "networking"]
    },
    {
        title: "Enhanced Security Features Released",
        description: "We've rolled out enhanced security features including two-factor authentication, advanced encryption, and real-time threat detection. Your data security is our top priority.",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/security-update",
        linkText: "Learn More",
        category: "update",
        isActive: true,
        tags: ["security", "encryption", "2FA", "privacy"]
    },
    {
        title: "Real-time Collaboration Feature",
        description: "Collaborate with your team in real-time like never before! Share documents, edit simultaneously, and communicate seamlessly with our new collaboration tools designed for modern remote teams.",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/collaboration-tools",
        linkText: "Explore Features",
        category: "feature",
        isActive: true,
        tags: ["collaboration", "real-time", "teamwork", "productivity"]
    },
    {
        title: "Mobile App Now Available",
        description: "Download our brand new mobile app and take your experience on the go! Available for both iOS and Android with all the features you love, optimized for mobile devices.",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/mobile-app",
        linkText: "Download App",
        category: "product",
        isActive: true,
        tags: ["mobile-app", "iOS", "android", "download"]
    },
    {
        title: "Data Privacy Policy Update",
        description: "We've updated our data privacy policy to ensure better transparency and user control. Review the changes to understand how we protect and handle your personal information.",
        imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/privacy-policy",
        linkText: "Read Policy",
        category: "announcement",
        isActive: true,
        tags: ["privacy", "policy", "data-protection", "transparency"]
    },
    {
        title: "Developer Workshop: Building with APIs",
        description: "Join our hands-on workshop for developers! Learn how to integrate our APIs into your applications, best practices for API usage, and get direct support from our engineering team.",
        imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/developer-workshop",
        linkText: "Join Workshop",
        category: "event",
        isActive: true,
        tags: ["developer", "workshop", "API", "integration"]
    },
    {
        title: "Performance Improvements Deployed",
        description: "We've deployed significant performance improvements across the platform. Experience faster load times, smoother interactions, and improved overall system responsiveness.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/performance-update",
        linkText: "View Metrics",
        category: "update",
        isActive: true,
        tags: ["performance", "optimization", "speed", "improvement"]
    },
    {
        title: "Advanced Analytics Dashboard",
        description: "Get deeper insights into your data with our new advanced analytics dashboard. Features include custom reporting, data visualization, and predictive analytics powered by machine learning.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        linkUrl: "https://example.com/analytics-dashboard",
        linkText: "Explore Dashboard",
        category: "feature",
        isActive: true,
        tags: ["analytics", "dashboard", "data-visualization", "machine-learning"]
    }
];

async function seedPosts() {
    try {
        console.log('🌱 Starting post seeding process...');

        // Connect to database
        await connect_to_db();

        // Clear existing posts (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing posts...');
        await Post.deleteMany({});

        // Insert new posts
        console.log('📝 Inserting new posts...');
        const createdPosts = await Post.insertMany(postsData);

        console.log(`✅ Successfully created ${createdPosts.length} posts!`);

        // Display created posts summary
        console.log('\n📋 Created Posts Summary:');
        createdPosts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title} (${post.category})`);
        });

        console.log('\n🎉 Post seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding posts:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Run the seed function
// seedPosts();
