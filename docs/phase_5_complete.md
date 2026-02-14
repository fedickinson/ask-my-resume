# Phase 5: QueryLog Recording + Configurable Prompts + Docker Deployment

**Status:** ✅ Complete

## What Was Implemented

### 1. QueryLog Recording
- Modified `src/retrieval/search.py` to return chunk IDs with retrieval results
- Updated `src/generation/llm.py` to handle the new 5-tuple format (chunk_id, content, source_file, category, distance)
- Added QueryLog recording to `src/api/main.py` after successful queries
- Logs capture: query text, chunk IDs, response text, and timestamp
- Wrapped in try/except so logging failures don't break queries

**Verification:**
```bash
# Query logged successfully from both local and Docker deployments
✓ QueryLog entries created with all required fields
✓ Chunk IDs correctly logged as INTEGER array
✓ Response text captured
✓ Logging failures don't break queries
```

### 2. Configurable LLM Parameters
- Added `temperature` parameter (default: 0.7) to `generate_response()`
- Added `max_tokens` parameter (default: 500) to `generate_response()`
- Both parameters passed through to OpenAI API call

**Usage:**
```python
# Default behavior (unchanged)
answer = generate_response(query="test", retrieved_chunks=chunks)

# Custom parameters
answer = generate_response(
    query="test",
    retrieved_chunks=chunks,
    temperature=0.3,  # More consistent
    max_tokens=200    # Shorter responses
)
```

### 3. Docker Deployment
Created two new files:

**`Dockerfile`:**
- Based on `python:3.11-slim`
- Installs system dependencies (gcc, postgresql-client)
- Copies project files and installs Python dependencies
- Exposes port 8003
- Runs with uvicorn

**`docker-compose.yml`:**
- Single `app` service for the API
- Loads environment variables from `.env`
- Volume mounts for hot reload during development
- Optional PostgreSQL service (commented out, using Supabase)

**Verification:**
```bash
# Docker build successful
✓ Image built successfully
✓ Container runs and serves requests
✓ Environment variables loaded from .env
✓ API accessible at localhost:8003
✓ QueryLog works from Docker container

# Docker Compose successful
✓ Services start correctly
✓ API responds to queries
✓ Hot reload enabled for development
```

## Code Changes Summary

### Modified Files (3):
1. **`src/retrieval/search.py`** - 2 lines changed
   - Return type: `List[Tuple[int, str, str, str, float]]`
   - SQL SELECT: Added `c.chunk_id`

2. **`src/generation/llm.py`** - 5 lines changed
   - Function signature: Added `temperature` and `max_tokens` parameters
   - Tuple unpacking: Handle chunk_id
   - OpenAI call: Use parameter values instead of hardcoded

3. **`src/api/main.py`** - 13 lines added
   - Import: Added QueryLog model
   - Sources extraction: Updated for 5-tuple
   - QueryLog recording: Insert query log after successful response

### New Files (2):
1. **`Dockerfile`** - ~25 lines
2. **`docker-compose.yml`** - ~30 lines

**Total code changes: ~75 lines** (as planned!)

## Testing Results

### QueryLog Recording
```bash
# Test query
curl -X POST http://localhost:8003/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What are Franklin'\''s top skills?"}'

# Verified in database
Query ID: 1
Query: What are Franklin's top skills?
Chunk IDs: [106, 338, 183, 339, 214]
Response: Franklin's top skills include...
Created: 2026-02-13 22:53:16.108812+00:00
```

### Configurable Parameters
```python
# Tested different temperature values
✓ temperature=0.3 (more consistent)
✓ temperature=0.7 (default)
✓ temperature=1.0 (more creative)

# Tested different max_tokens
✓ max_tokens=200 (shorter)
✓ max_tokens=500 (default)
✓ max_tokens=1000 (longer)
```

### Docker Deployment
```bash
# Local build and run
docker build -t ask-my-resume .
docker run -p 8003:8003 --env-file .env ask-my-resume
✓ Built successfully
✓ Server running
✓ Queries working
✓ QueryLog recording

# Docker Compose
docker-compose up
✓ Services started
✓ API responding
✓ Volume mounts working
```

## No Breaking Changes

All Phase 4 functionality still works:
- ✓ `/query` endpoint responds correctly
- ✓ Vector retrieval working
- ✓ LLM generation working
- ✓ Source attribution intact
- ✓ API response format unchanged

## What Was NOT Included (Future Phases)

Following the "no overengineering" principle, we deliberately excluded:

- ❌ Async QueryLog inserts (synchronous is fine)
- ❌ QueryLog analytics dashboard
- ❌ Prompt versioning system
- ❌ Multi-stage Docker build
- ❌ Kubernetes configs
- ❌ CI/CD pipeline
- ❌ Health check endpoints in Docker
- ❌ Response streaming
- ❌ Conversation history
- ❌ Performance monitoring/metrics

These can be added in future phases as needed.

## Installation & Usage

### Local Development
```bash
# Install dependencies (no changes from Phase 4)
pip install -e .

# Run server
python3 -m uvicorn src.api.main:app --host 0.0.0.0 --port 8003

# Test query
curl -X POST http://localhost:8003/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What did Franklin do at Meta?"}'
```

### Docker Deployment
```bash
# Build image
docker build -t ask-my-resume .

# Run container
docker run -p 8003:8003 --env-file .env ask-my-resume

# Or use docker-compose
docker-compose up
```

### View QueryLogs
```bash
# Connect to database
psql $DATABASE_URL

# View recent logs
SELECT
    query_id,
    query_text,
    retrieved_chunk_ids,
    LEFT(response_text, 100) as response_preview,
    created_at
FROM query_logs
ORDER BY created_at DESC
LIMIT 10;
```

## Environment Variables

Required (no changes from Phase 4):
```bash
DATABASE_URL=postgresql://...  # Supabase connection string
OPENAI_API_KEY=sk-...         # OpenAI API key
ENVIRONMENT=development       # Optional: development/staging/production
```

## Success Criteria - All Met ✅

- ✅ QueryLog records created for every successful query
- ✅ Chunk IDs correctly logged in retrieved_chunk_ids array
- ✅ LLM temperature and max_tokens are configurable parameters
- ✅ Docker image builds successfully
- ✅ Container runs and serves API requests
- ✅ All Phase 4 functionality still works (no regressions)
- ✅ Code changes minimal (~75 lines total)

## Next Steps (Phase 6+)

Potential future enhancements:
- **QueryLog Analytics** - Dashboard to analyze query patterns
- **Response Streaming** - Stream LLM responses word-by-word
- **Conversation History** - Multi-turn conversations with context
- **Prompt Versioning** - A/B test different prompts
- **Async Logging** - Non-blocking QueryLog inserts
- **Performance Monitoring** - Latency tracking, error rates
- **Production Deployment** - Automated CI/CD, staging environment

## Deployment Options

The Docker setup enables easy deployment to:
- **Railway** (recommended - easy PostgreSQL + app deployment)
- **Render** (free tier available)
- **Fly.io** (global deployment)
- **Any cloud platform with Docker support**

---

**Phase 5 Implementation Complete!** 🎉

Minimal, focused changes that add observability (QueryLog), configuration flexibility (LLM params), and deployment capability (Docker) without overengineering.
