import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

type TEnv = {
    db_url: string
    port: number
    host: string
    node_env: string
    frontend_url: string
    openai_api_key: string 
    is_prod: boolean
    is_dev: boolean
}

const env: TEnv = {
    port: parseInt(process.env.PORT || '3001'),
    db_url: process.env.DB_URL || 'NA',
    host: process.env.HOST || 'localhost',
    node_env: process.env.NODE_ENV || 'development',
    frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
    openai_api_key: process.env.OPENAI_API_KEY || '',
    is_prod: process.env.IS_PROD === 'true',
    is_dev: process.env.IS_DEV === 'true',
}

export default env
