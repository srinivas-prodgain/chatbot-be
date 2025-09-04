import mongoose from 'mongoose';
import { News } from '../models/news';
import { Author } from '../models/author';
import { connect_to_db } from '../config/db';
import { seedAuthors } from './author-seed';

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

// Helper function to estimate read time based on content length
const estimateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

const newsData = [
    {
        title: "Revolutionary AI Breakthrough in Natural Language Processing",
        content: "Researchers at leading technology institutes have achieved a groundbreaking advancement in natural language processing that could revolutionize how we interact with AI systems. The new model demonstrates unprecedented understanding of context, nuance, and human intent, marking a significant leap forward in artificial intelligence capabilities. This breakthrough addresses long-standing challenges in machine comprehension, including understanding sarcasm, implied meaning, and cultural references. The implications for chatbots, virtual assistants, and automated customer service are profound. Early testing shows the system can engage in conversations that feel remarkably human-like, maintaining context across extended dialogues and adapting to individual communication styles. Industry experts predict this technology will be integrated into consumer products within the next 18 months, potentially transforming everything from smartphone assistants to enterprise software solutions. The research team behind this achievement includes specialists from MIT, Stanford, and Google AI, representing a collaborative effort spanning three years of intensive development.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
        category: "ai-news",
        tags: ["artificial-intelligence", "natural-language-processing", "machine-learning", "research", "breakthrough"],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-01-15T10:00:00Z')
    },
    {
        title: "Tech Giants Unite for Climate Change Initiative",
        content: "Major technology companies have announced an unprecedented collaboration to combat climate change through innovative technological solutions and sustainable business practices. The initiative, dubbed 'Green Tech Alliance', brings together industry leaders to share resources, research, and expertise in developing carbon-neutral technologies. Participating companies have committed to achieving net-zero emissions by 2030, a timeline that's significantly more aggressive than previous industry standards. The alliance will focus on several key areas: renewable energy infrastructure, sustainable data center design, eco-friendly manufacturing processes, and carbon capture technologies. Each company will contribute billions in funding and research capabilities to accelerate the development of climate solutions. The collaboration also includes partnerships with environmental organizations and academic institutions to ensure scientific rigor and environmental impact. Early projects include developing more efficient solar panels, creating biodegradable electronics components, and designing AI systems optimized for energy efficiency. This initiative represents a major shift in how the tech industry approaches environmental responsibility, moving beyond individual corporate sustainability efforts to coordinated industry-wide action.",
        imageUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=600&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=300&fit=crop",
        category: "company-news",
        tags: ["climate-change", "sustainability", "green-technology", "collaboration", "environment"],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-01-12T14:30:00Z')
    },
    {
        title: "Next-Generation Quantum Computing Platform Launched",
        content: "A major technology company has unveiled its most advanced quantum computing platform to date, featuring unprecedented processing power and stability that brings practical quantum applications closer to reality. The new system incorporates revolutionary error correction algorithms and maintains quantum coherence for extended periods, addressing two of the biggest challenges in quantum computing. With 1000+ qubits and industry-leading fidelity rates, this platform opens new possibilities for solving complex problems in drug discovery, financial modeling, and cryptography. The quantum computer utilizes a hybrid approach, combining superconducting qubits with novel control systems that operate at near absolute zero temperatures. Early access partners include pharmaceutical companies researching new drug compounds, financial institutions exploring risk analysis algorithms, and cybersecurity firms developing quantum-resistant encryption methods. The platform is housed in a state-of-the-art facility with advanced cooling systems and electromagnetic shielding to maintain optimal quantum conditions. Cloud access to the quantum computing resources will be available to researchers and enterprises through a subscription model, democratizing access to quantum computing power. This launch represents a significant milestone in the race to achieve quantum supremacy and practical quantum applications.",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
        category: "product-update",
        tags: ["quantum-computing", "technology", "innovation", "cloud-computing", "research"],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-01-10T09:15:00Z')
    },
    {
        title: "Cybersecurity Threats Evolve with AI-Powered Attacks",
        content: "The cybersecurity landscape is undergoing a dramatic transformation as threat actors increasingly leverage artificial intelligence to create more sophisticated and targeted attacks. Security researchers have identified a new class of AI-powered malware that can adapt its behavior in real-time to evade detection systems and exploit vulnerabilities more effectively than traditional methods. These intelligent threats use machine learning algorithms to study their target environments, learning normal patterns of behavior before striking with precision attacks. The malware can modify its code structure, communication patterns, and attack vectors based on the defensive measures it encounters. This evolution in cyber threats has prompted a corresponding advancement in AI-powered defense systems. Security companies are developing neural networks specifically designed to detect and respond to AI-driven attacks, creating an arms race between artificial intelligence systems. The implications extend beyond traditional cybersecurity, as these threats can potentially target IoT devices, autonomous vehicles, and smart city infrastructure. Organizations are being advised to update their security protocols and invest in AI-driven defense solutions to stay ahead of these evolving threats. The cybersecurity industry predicts a surge in demand for AI security specialists and advanced threat detection systems.",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
        category: "industry",
        tags: ["cybersecurity", "artificial-intelligence", "malware", "threat-detection", "security"],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-01-08T16:45:00Z')
    },
    {
        title: "5G Network Expansion Accelerates Smart City Development",
        content: "The rapid deployment of 5G networks worldwide is catalyzing the development of smart city initiatives, enabling unprecedented connectivity and real-time data processing capabilities that transform urban living. Cities across the globe are leveraging ultra-low latency and high-bandwidth 5G infrastructure to implement intelligent traffic management systems, smart energy grids, and IoT-enabled public services. The technology enables real-time monitoring and control of city infrastructure, from streetlights that adjust based on pedestrian traffic to waste management systems that optimize collection routes. Emergency services benefit from 5G's reliability and speed, with first responders accessing live video feeds, real-time mapping, and instant communication systems during critical situations. Public transportation systems are being revolutionized with autonomous vehicles, smart traffic lights, and predictive maintenance systems that reduce delays and improve safety. Citizens experience enhanced services through mobile applications that provide real-time information about parking availability, air quality, and public transportation schedules. The economic impact is substantial, with smart city technologies creating new job markets and attracting technology companies to urban areas. However, the expansion also raises concerns about data privacy, cybersecurity, and digital divide issues that city planners are actively addressing.",
        imageUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&h=600&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=300&fit=crop",
        category: "technology",
        tags: ["5G", "smart-cities", "IoT", "urban-development", "connectivity"],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-01-05T11:20:00Z')
    },
    {
        title: "Major Platform Updates Enhance User Privacy Controls",
        content: "Leading social media and technology platforms have rolled out comprehensive privacy enhancements that give users unprecedented control over their personal data and digital footprint. The updates include granular privacy settings, transparent data usage reports, and simplified controls for managing third-party app permissions. Users can now view detailed reports showing how their data is being used, which companies have access to their information, and exactly what types of data are being collected. New features include automatic data deletion timers, enhanced encryption for private communications, and improved anonymization techniques for analytics. The platforms have also introduced privacy dashboards that provide clear, easy-to-understand summaries of privacy settings and recommendations for optimal data protection. These changes respond to growing user demand for privacy transparency and comply with evolving data protection regulations worldwide. The updates include new consent mechanisms that require explicit approval for data collection, rather than relying on pre-checked boxes or buried terms of service. Additionally, users can now download complete archives of their data and transfer information between platforms more easily. The privacy enhancements represent a significant shift in how technology companies approach user data, prioritizing transparency and user control over data collection efficiency.",
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
        category: "announcement",
        tags: ["privacy", "data-protection", "user-control", "platform-updates", "transparency"],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-01-03T13:10:00Z')
    },
    {
        title: "Breakthrough in Renewable Energy Storage Technology",
        content: "Scientists have achieved a major breakthrough in renewable energy storage with the development of next-generation battery technology that could solve the intermittency challenges of solar and wind power. The new lithium-sulfur battery design offers significantly higher energy density and longer lifespan compared to current lithium-ion technologies, while using more abundant and less expensive materials. Laboratory tests demonstrate the batteries can store 10 times more energy per unit weight and maintain 90% capacity after 5,000 charge cycles. The technology addresses one of the biggest obstacles to renewable energy adoption: the ability to store energy efficiently when the sun isn't shining or wind isn't blowing. The breakthrough involves a novel cathode design that prevents the dissolution of sulfur compounds, a problem that has limited lithium-sulfur battery development for decades. Manufacturing scalability studies are already underway, with pilot production facilities expected to begin operations within two years. Energy companies and grid operators are closely monitoring this development, as improved storage could dramatically reduce reliance on fossil fuel backup power systems. The technology could also revolutionize electric vehicle batteries, potentially doubling driving range while reducing weight and cost. Environmental benefits include reduced mining of rare earth elements and improved recyclability of battery components.",
        imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        category: "technology",
        tags: ["renewable-energy", "battery-technology", "energy-storage", "sustainability", "innovation"],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-01-01T08:00:00Z')
    },
    {
        title: "AI Ethics Guidelines Updated for Enterprise Applications",
        content: "Leading technology organizations have collaboratively updated comprehensive AI ethics guidelines specifically designed for enterprise applications, addressing the growing need for responsible artificial intelligence deployment in business environments. The new guidelines cover bias prevention, algorithmic transparency, data privacy, and accountability frameworks for AI decision-making systems. Key recommendations include mandatory bias testing for AI models used in hiring, lending, and healthcare applications, with regular audits by independent third parties. The guidelines emphasize the importance of diverse development teams and inclusive training datasets to minimize algorithmic bias and ensure fair outcomes across different demographic groups. Companies are encouraged to implement 'explainable AI' systems that can provide clear reasoning for automated decisions, particularly in high-stakes applications like medical diagnosis or financial approvals. The framework also addresses data governance, requiring organizations to establish clear policies for data collection, storage, and usage in AI systems. New provisions include requirements for user consent mechanisms, data minimization principles, and secure deletion procedures for personal information. The guidelines recommend establishing internal AI ethics boards with representatives from legal, technical, and social impact teams to oversee AI development and deployment decisions.",
        imageUrl: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&h=600&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=400&h=300&fit=crop",
        category: "ai-news",
        tags: ["AI-ethics", "enterprise", "guidelines", "responsible-AI", "algorithmic-bias"],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2023-12-28T15:30:00Z')
    }
];

async function seedNews() {
    try {
        console.log('🌱 Starting news seeding process...');

        // Connect to database
        await connect_to_db();

        // Get authors first (seed them if they don't exist)
        let authors = await Author.find();
        if (authors.length === 0) {
            console.log('👥 No authors found, seeding authors first...');
            authors = await seedAuthors();
        }

        // Clear existing news (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing news...');
        await News.deleteMany({});

        // Prepare news data with author references and calculated fields
        const newsWithAuthors = newsData.map((news, index) => {
            const authorIndex = index % authors.length; // Distribute news among available authors
            const selectedAuthor = authors[authorIndex];
            if (!selectedAuthor) {
                throw new Error('No authors available for news assignment');
            }
            return {
                ...news,
                slug: generateSlug(news.title),
                author: selectedAuthor._id,
                readTime: estimateReadTime(news.content)
            };
        });

        // Insert new news
        console.log('📰 Inserting new news articles...');
        const createdNews = await News.insertMany(newsWithAuthors);

        console.log(`✅ Successfully created ${createdNews.length} news articles!`);

        // Display created news summary
        console.log('\n📋 Created News Summary:');
        createdNews.forEach((news, index) => {
            const author = authors.find(a => (a._id as any).toString() === (news.author as any).toString());
            console.log(`${index + 1}. ${news.title}`);
            console.log(`   Author: ${author?.name || 'Unknown'}`);
            console.log(`   Category: ${news.category}`);
            console.log(`   Read Time: ${news.readTime} min`);
            console.log(`   Featured: ${news.isFeatured ? 'Yes' : 'No'}`);
            console.log(`   Slug: ${news.slug}`);
            console.log('');
        });

        console.log('🎉 News seeding completed successfully!');

        return createdNews;

    } catch (error) {
        console.error('❌ Error seeding news:', error);
        throw error;
    }
}

async function runNewsSeed() {
    try {
        await seedNews();
    } catch (error) {
        console.error('❌ Error in news seed process:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Export for use in other seed files
export { seedNews };

// Run the seed function
// Uncomment the line below to run this seed file directly
// runNewsSeed();
