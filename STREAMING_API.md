# Streaming Chat API Documentation

## Overview

This implementation provides a streaming chat API using Server-Sent Events (SSE) with the Vercel AI SDK and OpenAI's GPT-4 model.

## Prerequisites

1. **Environment Variables**: Create a `.env` file with the following:

```env
# Database Configuration
DB_URL=mongodb://localhost:27017/chatbot

# Server Configuration
PORT=3001
HOST=localhost
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:3000

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here
```

2. **Dependencies**: All required dependencies are already installed:
   - `ai` - Vercel AI SDK
   - `@ai-sdk/openai` - OpenAI provider for AI SDK

## API Endpoint

### POST `/chat/stream`

Streams AI responses in real-time using Server-Sent Events.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your message here"
    }
  ]
}
```

**Message Roles:**
- `user` - User messages
- `assistant` - AI responses  
- `system` - System prompts

**Response:**
- Content-Type: `text/plain; charset=utf-8`
- Streaming text response

## Usage Examples

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:3001/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      {
        role: 'user',
        content: 'Hello! Tell me a joke.'
      }
    ]
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  console.log(chunk); // Process each chunk
}
```

### Frontend (React/JavaScript)
```javascript
async function streamChat(messages) {
  const response = await fetch('/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    result += chunk;
    
    // Update UI with partial response
    setResponse(result);
  }
}
```

### cURL
```bash
curl -X POST http://localhost:3001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello! How are you?"
      }
    ]
  }' \
  --no-buffer
```

## Features

- ✅ Real-time streaming responses
- ✅ Server-Sent Events (SSE) support
- ✅ Input validation with Zod
- ✅ Error handling
- ✅ CORS configuration for frontend integration
- ✅ OpenAI GPT-4 integration
- ✅ TypeScript support

## Testing

1. **Start the server:**
```bash
npm run dev
```

2. **Test with provided script:**
```bash
node test-stream.js
```

3. **Test with cURL:**
```bash
curl -X POST http://localhost:3001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}]}' \
  --no-buffer
```

## Configuration

The AI service is configured in `src/services/ai.ts`:

- **Model**: GPT-4o
- **Temperature**: 0.7 (controls randomness)
- **Max Output Tokens**: 1000
- **API Key**: Uses `OPENAI_API_KEY` environment variable

## Error Handling

The API includes comprehensive error handling:

- Input validation errors (400)
- OpenAI API errors (500)
- Network/connectivity errors (500)
- Graceful error responses when streaming fails

## Architecture

```
src/
├── services/ai.ts           # AI service with OpenAI configuration
├── controllers/chat/
│   └── stream-chat.ts       # Streaming chat controller
├── routes/chat.ts           # Chat route definitions
├── config/env.ts            # Environment configuration
└── app.ts                   # Main app with route registration
```

## Next Steps

1. Add conversation history persistence
2. Implement user authentication
3. Add rate limiting
4. Add message formatting/parsing
5. Implement conversation context management
