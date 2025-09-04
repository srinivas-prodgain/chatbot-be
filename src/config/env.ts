import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

type TEnv = {
    dbUrl: string
    port: number
    host: string
    nodeEnv: string
    frontendUrl: string
}

const env: TEnv = {
    port: parseInt(process.env.PORT || '3001'),
    dbUrl: process.env.DB_URL || 'NA',
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}

export default env
