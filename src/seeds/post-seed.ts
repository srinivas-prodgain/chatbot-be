import mongoose from 'mongoose';
import { Post } from '../models/post';
import { connect_to_db } from '../config/db';

const postsData = [
    {
        title: "AI Strategy",
        description: "Generative AI can feel overwhelming without the right guidance. We analyze your operations, identify high-impact opportunities, and create a clear roadmap that aligns AI capabilities with your business goals - all while considering your budget and existing processes.",
        imageUrl: "https://res.cloudinary.com/dwhuwudg9/image/upload/v1757082216/Screenshot_2025-09-05_at_19.36.32_xq3qop.png",
        linkUrl: "https://www.prodgain.ai/#ai-strategy",
        linkText: "Learn More",
        category: "service",
        isActive: true,
        tags: ["AI", "strategy", "roadmap", "consulting"]
    },
    {
        title: "Model Finetuning",
        description: "Off-the-shelf models rarely meet all your needs. Our experts handle everything from data curation to finetuning with specialized techniques like synthetic data generation and hyperparameter tuning. The result is custom AI solutions optimized for your unique challenges.",
        imageUrl: "https://res.cloudinary.com/dwhuwudg9/image/upload/v1757082217/Screenshot_2025-09-05_at_19.52.32_yk4jot.png",
        linkUrl: "https://www.prodgain.ai/#model-finetuning",
        linkText: "Learn More",
        category: "service",
        isActive: true,
        tags: ["AI", "model", "finetuning", "customization"]
    },
    {
        title: "AI Integration",
        description: "Organizations often lack the bandwidth and expertise to integrate AI solutions with their existing systems. We bridge this gap by handling the end-to-end integration process, from building proof-of-concepts to production deployment, while ensuring compliance with your security.",
        imageUrl: "https://res.cloudinary.com/dwhuwudg9/image/upload/v1757082217/Screenshot_2025-09-05_at_19.52.40_jykwjl.png",
        linkUrl: "https://www.prodgain.ai/#ai-integration",
        linkText: "Learn More",
        category: "service",
        isActive: true,
        tags: ["AI", "integration", "deployment", "security"]
    },
    {
        title: "Generative AI Ops",
        description: "Maintaining AI systems requires continuous monitoring and updates to keep up with rapid technological changes. We provide ongoing operational support, performance optimization, and system updates - effectively future-proofing your AI investments while you focus on.",
        imageUrl: "https://res.cloudinary.com/dwhuwudg9/image/upload/v1757082218/Screenshot_2025-09-05_at_19.52.46_cucxl1.png",
        linkUrl: "https://www.prodgain.ai/#generative-ai-ops",
        linkText: "Learn More",
        category: "service",
        isActive: true,
        tags: ["AI", "operations", "maintenance", "optimization"]
    },
    {
        title: "SalesOS",
        description: "Unlock the hidden value in your unstructured sales data. We analyze communications across all channels - calls, meetings, emails, and chats - to surface meaningful patterns and opportunities. Our solutions seamlessly integrate with your existing tools, including CRM systems, email services, and internal platforms.",
        imageUrl: "https://res.cloudinary.com/dwhuwudg9/image/upload/v1757082083/Screenshot_2025-09-05_at_19.47.10_liojd3.png",
        linkUrl: "https://www.prodgain.ai/#salesos",
        linkText: "Learn More",
        category: "product",
        isActive: true,
        tags: ["sales", "AI", "conversation analysis", "CRM", "revenue intelligence"],
    },
    {
        title: "ResearchOS",
        description: "Transform your research workflow with AI-powered automation. Our solutions intelligently process and analyze content across internet-wide data sources, your private databases, unstructured documents and external APIs. We synthesize this vast information into clear, actionable insights tailored to your needs.",
        imageUrl: "https://res.cloudinary.com/dwhuwudg9/image/upload/v1757082083/Screenshot_2025-09-05_at_19.47.42_xabm0x.png",
        linkUrl: "https://www.prodgain.ai/#researchos",
        linkText: "Learn More",
        category: "product",
        isActive: true,
        tags: ["research", "AI", "automation", "document processing", "knowledge base"],
    },
    {
        title: "ComplianceOS",
        description: "Ensure consistency and compliance across all content with AI-driven oversight. Our solution understands your unique brand guidelines, quality standards, style requirements, and compliance frameworks. We build specialized AI agents that automatically verify and validate content against these parameters, streamlining your quality control process.",
        imageUrl: "https://res.cloudinary.com/dwhuwudg9/image/upload/v1757082083/Screenshot_2025-09-05_at_19.47.53_c557o3.png",
        linkUrl: "https://www.prodgain.ai/#complianceos",
        linkText: "Learn More",
        category: "product",
        isActive: true,
        tags: ["compliance", "AI", "quality control", "brand consistency", "automation"],
    },
    {
        title: "MarketingOS",
        description: "Optimize your content for the new generation of AI-powered search engines. We help you understand and adapt to how platforms like SearchGPT, Copilot, and Perplexity process and rank content.",
        imageUrl: "https://res.cloudinary.com/dwhuwudg9/image/upload/v1757082084/Screenshot_2025-09-05_at_19.47.58_o2coyx.png",
        linkUrl: "https://www.prodgain.ai/#marketingos",
        linkText: "Learn More",
        category: "product",
        isActive: true,
        tags: ["marketing", "AI", "SEO", "content optimization", "search engines"],
    }
]

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
seedPosts();
