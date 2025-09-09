import mongoose from 'mongoose';
import { Author } from '../models/author';
import { connect_to_db } from '../config/db';

const authorsData = [
    {
        name: "Dr. Sarah Chen",
        email: "sarah.chen@example.com",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
        bio: "Dr. Sarah Chen is a leading AI researcher with over 15 years of experience in machine learning and natural language processing. She holds a PhD in Computer Science from Stanford University and has published over 50 research papers in top-tier journals.",
        role: "Senior AI Researcher",
        socialLinks: {
            linkedin: "https://linkedin.com/in/sarah-chen-ai",
            twitter: "https://twitter.com/sarahchen_ai"
        },
        isActive: true
    },
    {
        name: "Michael Rodriguez",
        email: "michael.rodriguez@example.com",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        bio: "Michael is a technology journalist with a passion for covering emerging technologies and their impact on society. He has been writing about tech for over 10 years and has contributed to major publications worldwide.",
        role: "Technology Journalist",
        socialLinks: {
            linkedin: "https://linkedin.com/in/michael-rodriguez-tech",
            twitter: "https://twitter.com/mrodriguez_tech"
        },
        isActive: true
    },
    {
        name: "Dr. Aisha Patel",
        email: "aisha.patel@example.com",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
        bio: "Dr. Aisha Patel is a cybersecurity expert and software engineer specializing in blockchain technology and distributed systems. She leads a team of engineers developing next-generation security solutions.",
        role: "Chief Technology Officer",
        socialLinks: {
            linkedin: "https://linkedin.com/in/aisha-patel-cto",
            twitter: "https://twitter.com/aishapatel_cto"
        },
        isActive: true
    },
    {
        name: "James Thompson",
        email: "james.thompson@example.com",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        bio: "James is a product manager with extensive experience in building user-centric technology products. He has worked at several Fortune 500 companies and specializes in product strategy and user experience design.",
        role: "Senior Product Manager",
        socialLinks: {
            linkedin: "https://linkedin.com/in/james-thompson-pm",
            twitter: "https://twitter.com/jamesthompson_pm"
        },
        isActive: true
    },
    {
        name: "Dr. Emily Wang",
        email: "emily.wang@example.com",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
        bio: "Dr. Emily Wang is a data scientist and machine learning engineer with expertise in computer vision and deep learning. She has worked on groundbreaking projects in autonomous vehicles and medical imaging.",
        role: "Lead Data Scientist",
        socialLinks: {
            linkedin: "https://linkedin.com/in/emily-wang-ds",
            twitter: "https://twitter.com/emilywang_ml"
        },
        isActive: true
    },
    {
        name: "David Kim",
        email: "david.kim@example.com",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
        bio: "David is a software architect and full-stack developer with a focus on scalable web applications and cloud infrastructure. He has over 12 years of experience building enterprise-level solutions.",
        role: "Senior Software Architect",
        socialLinks: {
            linkedin: "https://linkedin.com/in/david-kim-architect",
            twitter: "https://twitter.com/davidkim_dev"
        },
        isActive: true
    },
    {
        name: "Dr. Lisa Anderson",
        email: "lisa.anderson@example.com",
        profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
        bio: "Dr. Lisa Anderson is a UX researcher and design strategist who specializes in human-computer interaction. She holds a PhD in Cognitive Psychology and has worked with leading tech companies to improve user experiences.",
        role: "UX Research Director",
        socialLinks: {
            linkedin: "https://linkedin.com/in/lisa-anderson-ux",
            twitter: "https://twitter.com/lisaanderson_ux"
        },
        isActive: true
    },
    {
        name: "Carlos Mendoza",
        email: "carlos.mendoza@example.com",
        profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        bio: "Carlos is a DevOps engineer and cloud infrastructure specialist with expertise in containerization, microservices, and CI/CD pipelines. He helps organizations scale their technology infrastructure efficiently.",
        role: "DevOps Engineer",
        socialLinks: {
            linkedin: "https://linkedin.com/in/carlos-mendoza-devops",
            twitter: "https://twitter.com/carlosmendoza_ops"
        },
        isActive: true
    }
];

async function seedAuthors() {
    try {
        console.log('🌱 Starting author seeding process...');

        // Connect to database
        await connect_to_db();

        // Clear existing authors (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing authors...');
        await Author.deleteMany({});

        // Insert new authors
        console.log('👥 Inserting new authors...');
        const createdAuthors = await Author.insertMany(authorsData);

        console.log(`✅ Successfully created ${createdAuthors.length} authors!`);

        // Display created authors summary
        console.log('\n📋 Created Authors Summary:');
        createdAuthors.forEach((author, index) => {
            console.log(`${index + 1}. ${author.name} (${author.role}) - ${author.email}`);
        });

        console.log('\n🎉 Author seeding completed successfully!');

        return createdAuthors;

    } catch (error) {
        console.error('❌ Error seeding authors:', error);
        throw error;
    }
}

// async function runAuthorSeed() {
//     try {
//         await seedAuthors();
//     } catch (error) {
//         console.error('❌ Error in author seed process:', error);
//     } finally {
//         // Close database connection
//         await mongoose.connection.close();
//         console.log('🔌 Database connection closed');
//         process.exit(0);
//     }
// }

// Export for use in other seed files
export { seedAuthors };

// Run the seed function
// Uncomment the line below to run this seed file directly
// runAuthorSeed();
