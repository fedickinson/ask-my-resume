# RAG Resume Assistant API

A simple FastAPI application that answers questions about Franklin Dickinson's background, experience, and skills using Retrieval-Augmented Generation (RAG).

## Quick Start

### 1. Install Dependencies

```bash
pip install -e .
```

### 2. Set Environment Variables

Ensure `.env` file exists with:
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

### 3. Start the Server

```bash
python3 scripts/run_api.py
```

Server runs at: `http://localhost:8003`

### 4. Test the API

**Interactive Documentation:**
- Open browser to `http://localhost:8003/docs`
- Try the `/query` endpoint directly in the browser

**Command Line:**
```bash
curl -X POST http://localhost:8003/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What did Franklin do at Meta?"}'
```

**Python Script:**
```bash
python3 scripts/test_api.py
```

## API Endpoints

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "RAG Resume Assistant",
  "version": "1.0.0"
}
```

### `GET /health`
Detailed health check.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "services": ["retrieval", "generation"]
}
```

### `POST /query`
Main RAG endpoint - answers questions about Franklin's background.

**Request:**
```json
{
  "query": "What did Franklin do at Meta?",
  "top_k": 5
}
```

**Parameters:**
- `query` (required): Question to ask (1-500 characters)
- `top_k` (optional): Number of chunks to retrieve (1-20, default: 5)

**Response:**
```json
{
  "query": "What did Franklin do at Meta?",
  "answer": "At Meta, Franklin Dickinson led causal inference analyses...",
  "sources": [
    "content/experience/meta-overview.md",
    "content/experience/meta-projects-detail.md"
  ]
}
```

## Example Usage

### Python

```python
import requests

response = requests.post(
    "http://localhost:8003/query",
    json={
        "query": "What are Franklin's technical skills?",
        "top_k": 5
    }
)

result = response.json()
print(f"Answer: {result['answer']}")
print(f"Sources: {', '.join(result['sources'])}")
```

### JavaScript/TypeScript

```javascript
const response = await fetch('http://localhost:8003/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "When does Franklin graduate?",
    top_k: 5
  })
});

const result = await response.json();
console.log('Answer:', result.answer);
console.log('Sources:', result.sources);
```

### curl

```bash
# Basic query
curl -X POST http://localhost:8003/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Tell me about Franklin"}'

# With top_k parameter
curl -X POST http://localhost:8003/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What projects has Franklin built?", "top_k": 10}'
```

## Example Queries

Try asking:
- "What did Franklin do at Meta?"
- "What are Franklin's technical skills?"
- "When does Franklin graduate?"
- "Tell me about Franklin's Budget Buddy project"
- "What is Franklin's experience with causal inference?"
- "What did Franklin study at Cornell Tech?"
- "Has Franklin worked with AI or machine learning?"

## How It Works

1. **Query Embedding**: Convert your question to a vector using OpenAI's `text-embedding-3-small`
2. **Vector Search**: Find the most relevant content chunks using pgvector L2 distance
3. **Context Building**: Combine retrieved chunks into context
4. **LLM Generation**: Send context + query to `gpt-4o-mini` for answer generation
5. **Response**: Return answer with source attribution

## Architecture

```
src/
├── api/
│   └── main.py           # FastAPI application
├── retrieval/
│   └── search.py         # Vector similarity search
├── generation/
│   └── llm.py            # LLM response generation
├── database/
│   └── ...               # Database models & session
└── config.py             # Settings & environment variables

scripts/
├── run_api.py            # Server startup
└── test_api.py           # API testing script
```

## Configuration

### Port
Default: `8003` (configurable in `scripts/run_api.py`)

### Models
- **Embeddings**: `text-embedding-3-small`
- **Chat**: `gpt-4o-mini`

### Parameters
- **top_k**: Number of chunks to retrieve (default: 5, max: 20)
- **temperature**: LLM temperature (default: 0.7)
- **max_tokens**: LLM max tokens (default: 500)

## Cost Estimates

Per query:
- **Embedding**: ~$0.0001 (1 embedding call)
- **LLM**: ~$0.001-0.003 (depending on context size)
- **Total**: ~$0.001-0.003 per query

Very affordable for development and testing!

## Development

### Running with Auto-Reload

```bash
python3 -m uvicorn src.api.main:app --host 0.0.0.0 --port 8003 --reload
```

### Running Tests

```bash
python3 scripts/test_api.py
```

### Viewing Logs

The server outputs logs to stdout. Look for:
- INFO logs for requests
- ERROR logs for failures
- Query details in the logs

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -ti:8003

# Kill the process or change port in scripts/run_api.py
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set correctly
echo $DATABASE_URL

# Test database connection
python3 -c "from src.database import SessionLocal; SessionLocal()"
```

### OpenAI API Error
```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Test OpenAI connection
python3 -c "from openai import OpenAI; OpenAI()"
```

## What's Next

Phase 5 enhancements could include:
- Query logging to database
- Streaming responses
- Conversation history
- Better prompt engineering
- Response caching
- Deployment configuration

---

**Built with:** FastAPI, OpenAI, PostgreSQL, pgvector
**Status:** Phase 4 Complete ✅
