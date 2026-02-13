# Phase 4 Implementation: RAG Query API

**Date:** 2026-02-13
**Status:** ✅ Complete
**Time Taken:** ~1 hour

## Objective

Build a simple FastAPI endpoint that answers questions about Franklin's resume using RAG (Retrieval-Augmented Generation).

## What Was Built

### 1. Retrieval Module (`src/retrieval/`)
- `search.py`: Vector similarity search using pgvector
- Extracted working pattern from `scripts/query_example.py`
- Uses OpenAI `text-embedding-3-small` for query embeddings
- Returns top-k most similar chunks with L2 distance (Supabase requirement)
- ~55 lines of code

### 2. Generation Module (`src/generation/`)
- `llm.py`: LLM response generation using OpenAI
- Simple system prompt focused on answering questions from context
- Uses `gpt-4o-mini` for cost-effective responses
- Builds context from retrieved chunks
- ~60 lines of code

### 3. API Module (`src/api/`)
- `main.py`: FastAPI application with two main endpoints
  - `POST /query`: Main RAG endpoint
  - `GET /health`: Health check
  - `GET /`: Root endpoint
- Request/response models with Pydantic validation
- Source attribution (returns files used for answers)
- ~95 lines of code

### 4. Supporting Files
- `scripts/run_api.py`: Server startup script (port 8003)
- `scripts/test_api.py`: Test script for API endpoints
- Updated `pyproject.toml`: Added FastAPI + Uvicorn dependencies

**Total new code:** ~210 lines (stayed minimal!)

## Key Design Decisions

### ✅ What We Included:
- Single `/query` endpoint - does one thing well
- FastAPI with auto-generated documentation
- Simple top-k retrieval (proven pattern from Phase 3)
- Direct OpenAI API calls (no frameworks)
- Source file tracking
- Basic error handling

### ❌ What We Deferred (Phase 5+):
- Rate limiting
- Authentication
- QueryLog recording (table exists, not using yet)
- Streaming responses
- Multi-turn conversations
- Advanced prompt engineering
- Caching
- Multiple LLM providers

## Technical Details

### Dependencies Added:
```toml
"fastapi>=0.104.0"
"uvicorn>=0.24.0"
"httpx>=0.25.0"  # dev dependency for testing
```

### Environment Variables:
- `DATABASE_URL` - PostgreSQL with pgvector
- `OPENAI_API_KEY` - For embeddings + chat

### Port Configuration:
- Running on port **8003** (8000-8002 were in use)
- Can be changed in `scripts/run_api.py`

## Testing & Verification

### Endpoints Tested:
1. ✅ `GET /` - Health check works
2. ✅ `GET /health` - Returns service status
3. ✅ `POST /query` - RAG endpoint works perfectly
4. ✅ `GET /docs` - Swagger UI auto-generated

### Example Queries Tested:
1. "What did Franklin do at Meta?" → Retrieved Meta experience, generated relevant answer
2. "What are Franklin's technical skills?" → Retrieved and summarized technical skills
3. "When does Franklin graduate?" → Correctly returned May 2026
4. "Tell me about Franklin's Budget Buddy project" → Retrieved project details

### Performance Observations:
- Query response time: ~2-3 seconds (embedding + retrieval + LLM)
- Source attribution working correctly
- Answers well-grounded in retrieved context
- LLM follows system prompt (doesn't hallucinate outside context)

## Example API Usage

### Using curl:
```bash
curl -X POST http://localhost:8003/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What did Franklin do at Meta?", "top_k": 5}'
```

### Response:
```json
{
  "query": "What did Franklin do at Meta?",
  "answer": "At Meta, Franklin Dickinson led causal inference analyses to measure the impact of public affairs marketing campaigns on brand sentiment...",
  "sources": [
    "content/experience/meta-overview.md",
    "content/experience/meta-projects-detail.md"
  ]
}
```

### Using Python:
```python
import requests

response = requests.post(
    "http://localhost:8003/query",
    json={"query": "What are Franklin's technical skills?"}
)
print(response.json()["answer"])
```

## Files Created/Modified

### Created:
1. `src/retrieval/search.py`
2. `src/retrieval/__init__.py`
3. `src/generation/llm.py`
4. `src/generation/__init__.py`
5. `src/api/main.py`
6. `src/api/__init__.py`
7. `scripts/run_api.py`
8. `scripts/test_api.py`

### Modified:
1. `pyproject.toml` - Added FastAPI dependencies

## Challenges & Solutions

### Challenge 1: Port Conflicts
- **Issue:** Ports 8000-8002 already in use on the system
- **Solution:** Changed to port 8003
- **Learning:** Always check port availability

### Challenge 2: Python Command
- **Issue:** `python` command not found (macOS)
- **Solution:** Use `python3` explicitly
- **Learning:** Platform-specific command differences

## Success Criteria

All criteria met:
- ✅ FastAPI server runs successfully
- ✅ `/query` endpoint returns relevant answers
- ✅ Answers grounded in retrieved content
- ✅ Source files correctly attributed
- ✅ Test queries work as expected
- ✅ API documentation auto-generated at `/docs`
- ✅ Code is clean, simple, under 220 lines total

## What's Next (Phase 5)

Potential enhancements (not required for MVP):
1. **QueryLog Recording** - Table exists, start logging queries
2. **Better Prompt Engineering** - Improve answer quality
3. **Response Streaming** - Stream LLM responses for better UX
4. **Conversation History** - Multi-turn conversations
5. **Performance Optimization** - Caching, batch processing
6. **Deployment** - Containerization, production config

## Running the API

### Start the server:
```bash
python3 scripts/run_api.py
# Or:
python3 -m uvicorn src.api.main:app --host 0.0.0.0 --port 8003 --reload
```

### Test the API:
```bash
python3 scripts/test_api.py
```

### View API docs:
Open browser to `http://localhost:8003/docs`

## Conclusion

Phase 4 successfully implemented a minimal, working RAG system! The API:
- Answers questions accurately using retrieved context
- Attributes sources correctly
- Has clean, maintainable code (~210 lines)
- Works reliably across different query types
- Provides auto-generated documentation

**Ready for production testing or Phase 5 enhancements!** 🎉
