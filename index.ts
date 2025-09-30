import dotenv from 'dotenv';

import app from '@/app';
import { connect_to_db } from '@/configs/db';
import env from '@/constants/env';


dotenv.config();


const server = app.listen(env.port, 'localhost', async () => {
    await connect_to_db();
    console.log('🚀 Chatbot Backend Server Started');
    console.log(`📍 Local: http://localhost:${env.port}`);
    console.log(`🌍 Environment: ${env.node_env}`);
    console.log('─'.repeat(50));
});

process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

export default server; 
