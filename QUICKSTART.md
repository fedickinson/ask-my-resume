# Quick Start: Phase 2 Database Migration

⚠️ **Current Status**: Code complete, awaiting database connectivity

---

## TL;DR - When Database is Accessible

```bash
# 1. Activate environment
source .venv/bin/activate

# 2. Apply migration
alembic upgrade head

# 3. Run tests
python scripts/test_connection.py

# 4. Verify
alembic current
```

**Expected result**: All tables created, all tests pass ✅

---

## What Was Built

### ✅ Completed Infrastructure

**Python Environment**
- `pyproject.toml` with SQLAlchemy, Alembic, pgvector
- Virtual environment with all dependencies
- `.env` configuration (database credentials)

**Database Models** (`src/database/models.py`)
- `DocumentChunk` - Stores markdown content chunks
- `ChunkEmbedding` - Stores 1536-dim vectors with pgvector
- `QueryLog` - Optional observability

**Alembic Migration**
- Initial schema: `20260213_5a003342d559_initial_schema_with_pgvector.py`
- Creates 3 tables with indexes
- Enables pgvector extension
- Adds IVFFlat index for fast similarity search

**Testing**
- `scripts/test_connection.py` - Comprehensive test suite
- Tests connectivity, tables, CRUD, vector search

**Documentation**
- `MIGRATION_GUIDE.md` - Complete deployment guide
- `docs/phase_2_infra_build.md` - Phase summary
- `scripts/README.md` - Testing instructions

---

## Current Issue

**Problem**: Cannot connect to Supabase database
```
Error: could not translate host name "db.cxcupwpdhonhaypzahca.supabase.co"
```

**Possible causes**:
1. No internet connection
2. DNS resolution failure
3. Supabase service down
4. Incorrect database credentials

**To diagnose**:
```bash
# Test network connectivity
ping db.cxcupwpdhonhaypzahca.supabase.co

# Test with psql
psql "postgresql://postgres:SUaTBc7PWZ4H0TOt@db.cxcupwpdhonhaypzahca.supabase.co:5432/postgres"

# Check Supabase dashboard
# https://app.supabase.com/
```

---

## File Structure

```
ask-my-resume/
├── .env                           # DB credentials (gitignored) ⚠️
├── .env.example                   # Template
├── pyproject.toml                 # Dependencies
├── alembic.ini                    # Alembic config
├── MIGRATION_GUIDE.md             # Detailed guide 📖
├── QUICKSTART.md                  # This file
│
├── src/
│   ├── config.py                  # Settings management
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── base.py                # SQLAlchemy base
│   │   ├── models.py              # ORM models
│   │   └── session.py             # DB sessions
│   │
│   └── alembic/
│       ├── env.py                 # Migration environment
│       └── versions/
│           └── 20260213_..._initial_schema_with_pgvector.py
│
├── scripts/
│   ├── README.md
│   └── test_connection.py         # Test suite
│
└── docs/
    ├── phase_2_infra_build.md     # Phase documentation
    └── journal/
        └── 2026-02-13-phase2-implementation.md
```

---

## Database Schema

### Tables Created

**document_chunks**
- Stores chunked content from markdown files
- Fields: chunk_id, content, source_file, category, document_title, chunk_index, metadata_json
- Indexes on source_file and category

**chunk_embeddings**
- Stores 1536-dimensional vectors
- Fields: embedding_id, chunk_id, embedding (vector), embedding_model
- IVFFlat index for cosine similarity search
- Unique constraint on (chunk_id, embedding_model)

**query_logs**
- Logs queries for observability (Phase 4)
- Fields: query_id, query_text, retrieved_chunk_ids, response_text

---

## Commands Reference

### Migration Management
```bash
# Check current migration status
alembic current

# View migration history
alembic history

# Apply all pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Rollback all migrations
alembic downgrade base

# Preview migration SQL (dry run)
alembic upgrade head --sql
```

### Testing
```bash
# Run full test suite
python scripts/test_connection.py

# Quick connection test
python -c "from src.database.session import engine; print(engine.connect())"
```

### Database Inspection
```bash
# Connect via psql
psql "$DATABASE_URL"

# Or with explicit connection string
psql "postgresql://postgres:SUaTBc7PWZ4H0TOt@db.cxcupwpdhonhaypzahca.supabase.co:5432/postgres"

# Inside psql
\dt                    # List tables
\d document_chunks     # Describe table
\dx                    # List extensions (should see 'vector')
```

---

## Troubleshooting

### 1. Module Not Found Errors
```bash
# Ensure you're in project root
cd /Users/franklindickinson/Projects/ask-my-resume

# Activate virtual environment
source .venv/bin/activate

# Reinstall in editable mode
pip install -e .
```

### 2. Connection Refused
Check `.env` file has correct `DATABASE_URL`:
```bash
cat .env
# Should show: DATABASE_URL=postgresql://postgres:...
```

### 3. Migration Already Applied
```bash
# Check what's applied
alembic current

# If need to reapply
alembic downgrade base
alembic upgrade head
```

### 4. pgvector Extension Missing
Should be pre-installed on Supabase, but if not:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
```

---

## Next Steps After Migration

### Phase 3: Content Ingestion

1. **Build Markdown Parser**
   - Read files from `/content/` directory
   - Extract YAML frontmatter (category, title, tags)
   - Parse markdown to plain text

2. **Implement Text Chunker**
   - Split content into ~500 token chunks
   - Add overlap for context preservation
   - Maintain chunk_index for ordering

3. **Create Embedding Pipeline**
   - Call OpenAI Embedding API
   - Model: text-embedding-3-small (1536 dims)
   - Batch processing for efficiency

4. **Build Database Loader**
   - Bulk insert chunks
   - Generate and store embeddings
   - Transaction management

**Expected outcome**: `document_chunks` and `chunk_embeddings` tables populated with content from `/content/` directory.

### Phase 4: RAG Implementation

1. Semantic search endpoint
2. Context assembly
3. LLM response generation
4. API layer with FastAPI

---

## Support

**Documentation**:
- Detailed guide: `MIGRATION_GUIDE.md`
- Phase summary: `docs/phase_2_infra_build.md`
- Testing: `scripts/README.md`

**Common Issues**:
- See `MIGRATION_GUIDE.md` → Troubleshooting section

**Dependencies**:
- Python 3.11+
- PostgreSQL with pgvector
- Supabase account

---

**Last Updated**: 2026-02-13
**Status**: Code complete, pending deployment
**Next**: `alembic upgrade head` when DB is accessible
