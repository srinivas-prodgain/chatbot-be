import mongoose from 'mongoose';
import { Collection } from '../models/collection';
import { connect_to_db } from '../config/db';

const collectionsData = [
    // Root level collections (level 0)
    {
        title: "Intercom Overview",
        description: "Complete guide to understanding Intercom's platform, features, and capabilities",
        slug: "intercom-overview",
        icon: "🏠",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Getting Started",
        description: "Essential guides for new users to get up and running with Intercom quickly",
        slug: "getting-started",
        icon: "🚀",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Messenger & Chat",
        description: "Everything about setting up and customizing your Intercom messenger",
        slug: "messenger-chat",
        icon: "💬",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Customer Support",
        description: "Tools and best practices for providing excellent customer support",
        slug: "customer-support",
        icon: "🎧",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Automation & Workflows",
        description: "Automate your customer communications and create intelligent workflows",
        slug: "automation-workflows",
        icon: "🤖",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Billing & Account",
        description: "Everything about plans, pricing, billing, and account management",
        slug: "billing-account",
        icon: "💳",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Integrations",
        description: "Connect Intercom with your favorite tools and platforms",
        slug: "integrations",
        icon: "🔗",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Analytics & Reporting",
        description: "Track performance and gain insights from your customer data",
        slug: "analytics-reporting",
        icon: "📊",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Security & Privacy",
        description: "Learn about Intercom's security features and privacy controls",
        slug: "security-privacy",
        icon: "🔒",
        parentCollection: null,
        level: 0,
        isPublished: true
    },
    {
        title: "Troubleshooting",
        description: "Common issues and solutions to help you resolve problems quickly",
        slug: "troubleshooting",
        icon: "🔧",
        parentCollection: null,
        level: 0,
        isPublished: true
    },

    // Sub-collections (level 1) - these will be populated with parentCollection references after creation
    {
        title: "Installation & Setup",
        description: "Get Intercom installed and configured on your website or app",
        slug: "installation-setup",
        icon: "🛠️",
        parentCollection: null, // Will be set to "Getting Started" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Basic Configuration",
        description: "Essential settings and configurations for new users",
        slug: "basic-configuration",
        icon: "⚙️",
        parentCollection: null, // Will be set to "Getting Started" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Messenger Customization",
        description: "Design and customize your messenger appearance and behavior",
        slug: "messenger-customization",
        icon: "🎨",
        parentCollection: null, // Will be set to "Messenger & Chat" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Chat Features",
        description: "Advanced chat features and conversation management",
        slug: "chat-features",
        icon: "💭",
        parentCollection: null, // Will be set to "Messenger & Chat" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Help Desk & Inbox",
        description: "Manage customer inquiries through the unified inbox",
        slug: "help-desk-inbox",
        icon: "📥",
        parentCollection: null, // Will be set to "Customer Support" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Knowledge Base",
        description: "Create and manage self-service help articles",
        slug: "knowledge-base",
        icon: "📚",
        parentCollection: null, // Will be set to "Customer Support" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Workflow Builder",
        description: "Create automated workflows and customer journeys",
        slug: "workflow-builder",
        icon: "🔄",
        parentCollection: null, // Will be set to "Automation & Workflows" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Bots & AI",
        description: "Set up chatbots and AI-powered automation",
        slug: "bots-ai",
        icon: "🤖",
        parentCollection: null, // Will be set to "Automation & Workflows" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Plans & Pricing",
        description: "Detailed information about Intercom's pricing plans and billing options",
        slug: "plans-pricing",
        icon: "💰",
        parentCollection: null, // Will be set to "Billing & Account" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Account Management",
        description: "Manage your account settings, team, and workspace",
        slug: "account-management",
        icon: "👥",
        parentCollection: null, // Will be set to "Billing & Account" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Popular Integrations",
        description: "Most commonly used integrations with step-by-step setup guides",
        slug: "popular-integrations",
        icon: "⭐",
        parentCollection: null, // Will be set to "Integrations" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "API & Webhooks",
        description: "Developer resources for API integration and webhooks",
        slug: "api-webhooks",
        icon: "🔧",
        parentCollection: null, // Will be set to "Integrations" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Conversation Analytics",
        description: "Track and analyze customer conversation metrics",
        slug: "conversation-analytics",
        icon: "📈",
        parentCollection: null, // Will be set to "Analytics & Reporting" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Performance Reports",
        description: "Generate and understand performance reports",
        slug: "performance-reports",
        icon: "📋",
        parentCollection: null, // Will be set to "Analytics & Reporting" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Data Protection",
        description: "Privacy settings and data protection features",
        slug: "data-protection",
        icon: "🛡️",
        parentCollection: null, // Will be set to "Security & Privacy" collection ID
        level: 1,
        isPublished: true
    },
    {
        title: "Common Issues",
        description: "Frequently encountered problems and their solutions",
        slug: "common-issues",
        icon: "⚠️",
        parentCollection: null, // Will be set to "Troubleshooting" collection ID
        level: 1,
        isPublished: true
    },

    // Sub-sub-collections (level 2)
    {
        title: "Starter Plans",
        description: "Everything about Intercom's starter plan features and limitations",
        slug: "starter-plans",
        icon: "🌱",
        parentCollection: null, // Will be set to "Plans & Pricing" collection ID
        level: 2,
        isPublished: true
    },
    {
        title: "Pro Plans",
        description: "Advanced features available in Intercom's professional plans",
        slug: "pro-plans",
        icon: "🏆",
        parentCollection: null, // Will be set to "Plans & Pricing" collection ID
        level: 2,
        isPublished: true
    },
    {
        title: "Usage & Billing",
        description: "Understanding usage limits, billing cycles, and cost optimization",
        slug: "usage-billing",
        icon: "📊",
        parentCollection: null, // Will be set to "Plans & Pricing" collection ID
        level: 2,
        isPublished: true
    },
    {
        title: "CRM Integrations",
        description: "Connect Intercom with popular CRM platforms like Salesforce, HubSpot",
        slug: "crm-integrations",
        icon: "🏢",
        parentCollection: null, // Will be set to "Popular Integrations" collection ID
        level: 2,
        isPublished: true
    },
    {
        title: "E-commerce Integrations",
        description: "Integrate with Shopify, WooCommerce, and other e-commerce platforms",
        slug: "ecommerce-integrations",
        icon: "🛒",
        parentCollection: null, // Will be set to "Popular Integrations" collection ID
        level: 2,
        isPublished: true
    }
];

async function seedCollections() {
    try {
        console.log('🌱 Starting collection seeding process...');

        // Connect to database
        await connect_to_db();

        // Clear existing collections (optional)
        console.log('🗑️  Clearing existing collections...');
        await Collection.deleteMany({});

        console.log('📁 Creating collections with hierarchical structure...');

        // Step 1: Create all root collections first (level 0)
        const rootCollections = collectionsData.filter(col => col.level === 0);
        const createdRootCollections = await Collection.insertMany(rootCollections);
        console.log(`✅ Created ${createdRootCollections.length} root collections`);

        // Step 2: Create level 1 collections and link to parents
        const level1Collections = collectionsData.filter(col => col.level === 1);

        // Map parent collection names to their IDs
        const parentMap = {
            'getting-started': createdRootCollections.find(c => c.slug === 'getting-started')?._id,
            'messenger-chat': createdRootCollections.find(c => c.slug === 'messenger-chat')?._id,
            'customer-support': createdRootCollections.find(c => c.slug === 'customer-support')?._id,
            'automation-workflows': createdRootCollections.find(c => c.slug === 'automation-workflows')?._id,
            'billing-account': createdRootCollections.find(c => c.slug === 'billing-account')?._id,
            'integrations': createdRootCollections.find(c => c.slug === 'integrations')?._id,
            'analytics-reporting': createdRootCollections.find(c => c.slug === 'analytics-reporting')?._id,
            'security-privacy': createdRootCollections.find(c => c.slug === 'security-privacy')?._id,
            'troubleshooting': createdRootCollections.find(c => c.slug === 'troubleshooting')?._id,
        };

        // Update level 1 collections with parent references
        const level1WithParents = level1Collections.map(col => {
            switch (col.slug) {
                case 'installation-setup':
                case 'basic-configuration':
                    return { ...col, parentCollection: parentMap['getting-started'] };
                case 'messenger-customization':
                case 'chat-features':
                    return { ...col, parentCollection: parentMap['messenger-chat'] };
                case 'help-desk-inbox':
                case 'knowledge-base':
                    return { ...col, parentCollection: parentMap['customer-support'] };
                case 'workflow-builder':
                case 'bots-ai':
                    return { ...col, parentCollection: parentMap['automation-workflows'] };
                case 'plans-pricing':
                case 'account-management':
                    return { ...col, parentCollection: parentMap['billing-account'] };
                case 'popular-integrations':
                case 'api-webhooks':
                    return { ...col, parentCollection: parentMap['integrations'] };
                case 'conversation-analytics':
                case 'performance-reports':
                    return { ...col, parentCollection: parentMap['analytics-reporting'] };
                case 'data-protection':
                    return { ...col, parentCollection: parentMap['security-privacy'] };
                case 'common-issues':
                    return { ...col, parentCollection: parentMap['troubleshooting'] };
                default:
                    return col;
            }
        });

        const createdLevel1Collections = await Collection.insertMany(level1WithParents);
        console.log(`✅ Created ${createdLevel1Collections.length} level 1 collections`);

        // Step 3: Create level 2 collections and link to level 1 parents
        const level2Collections = collectionsData.filter(col => col.level === 2);

        const level1ParentMap = {
            'plans-pricing': createdLevel1Collections.find(c => c.slug === 'plans-pricing')?._id,
            'popular-integrations': createdLevel1Collections.find(c => c.slug === 'popular-integrations')?._id,
        };

        const level2WithParents = level2Collections.map(col => {
            switch (col.slug) {
                case 'starter-plans':
                case 'pro-plans':
                case 'usage-billing':
                    return { ...col, parentCollection: level1ParentMap['plans-pricing'] };
                case 'crm-integrations':
                case 'ecommerce-integrations':
                    return { ...col, parentCollection: level1ParentMap['popular-integrations'] };
                default:
                    return col;
            }
        });

        const createdLevel2Collections = await Collection.insertMany(level2WithParents);
        console.log(`✅ Created ${createdLevel2Collections.length} level 2 collections`);

        const allCreatedCollections = [
            ...createdRootCollections,
            ...createdLevel1Collections,
            ...createdLevel2Collections
        ];

        console.log(`\n🎉 Successfully created ${allCreatedCollections.length} collections total!`);

        // Display created collections summary with hierarchy
        console.log('\n📋 Created Collections Hierarchy:');

        // Display root collections and their children
        for (const rootCol of createdRootCollections) {
            console.log(`\n📁 ${rootCol.title} (${rootCol.slug})`);

            // Find level 1 children
            const level1Children = createdLevel1Collections.filter(
                child => child.parentCollection?.toString() === (rootCol._id as any).toString()
            );

            for (const level1Child of level1Children) {
                console.log(`  ├── 📂 ${level1Child.title} (${level1Child.slug})`);

                // Find level 2 children
                const level2Children = createdLevel2Collections.filter(
                    child => child.parentCollection?.toString() === (level1Child._id as any).toString()
                );

                for (const level2Child of level2Children) {
                    console.log(`      └── 📄 ${level2Child.title} (${level2Child.slug})`);
                }
            }
        }

        console.log('\n🎉 Collection seeding completed successfully!');
        return allCreatedCollections;

    } catch (error) {
        console.error('❌ Error seeding collections:', error);
        throw error;
    }
}

async function runCollectionSeed() {
    try {
        await seedCollections();
    } catch (error) {
        console.error('❌ Error in collection seed process:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

// Export for use in other seed files
export { seedCollections };

// Run the seed function
// Uncomment the line below to run this seed file directly
// runCollectionSeed();
