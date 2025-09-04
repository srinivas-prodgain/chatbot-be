import app from './src/app';
import dotenv from 'dotenv';
import env from './src/config/env';
import { connect_to_db } from './src/config/db';


dotenv.config();


const server = app.listen(env.port, async () => {
    console.log("connecting to Database.........")
    await connect_to_db();
    console.log("connected to Database successfully")
    console.log('🚀 Chatbot Backend Server Started');
    console.log(`📍 Server running on: http://${env.host}:${env.port}`);
    console.log(`🌍 Environment: ${env.nodeEnv}`);
    console.log(`⚡ Health check: http://${env.host}:${env.port}/health`);
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
