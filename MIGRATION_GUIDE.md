# Phase 2 Complete: Database Migration Setup

✅ **Status**: Infrastructure code complete, ready to apply when database is accessible

---

## What Was Accomplished

### 1. Python Project Setup ✅
- Created `pyproject.toml` with all required dependencies:
  - SQLAlchemy 2.0+ for ORM
  - Alembic for migrations
  - psycopg2-binary for PostgreSQL
  - pgvector for vector similarity
  - Pydantic for settings management
- Set up virtual environment and installed dependencies
- Created `.env` configuration with database credentials
- Updated `.gitignore` to exclude sensitive files

### 2. Configuration Management ✅
- **`src/config.py`**: Type-safe settings using Pydantic
  - Loads `DATABASE_URL` from environment
  - Validates PostgreSQL connection strings
  - Supports multiple environments (dev/staging/prod)

### 3. Database Models ✅
Created SQLAlchemy ORM models in `src/database/models.py`:

**DocumentChunk** - Stores content from markdown files:
- `chunk_id` (PK)
- `content` - The actual text
- `source_file` - Path to original file
- `category` - Content category (experience, projects, etc.)
- `document_title` - From YAML frontmatter
- `chunk_index` - Preserves document order
- `metadata_json` - Flexible JSONB field
- Timestamps (created_at, updated_at)

**ChunkEmbedding** - Stores 1536-dimensional vectors:
- `embedding_id` (PK)
- `chunk_id` (FK to document_chunks)
- `embedding` - Vector(1536) using pgvector
- `embedding_model` - Tracks which model created the embedding
- `created_at`
- Unique constraint on (chunk_id, embedding_model)

**QueryLog** - Optional observability (Phase 4):
- `query_id` (PK)
- `query_text`
- `retrieved_chunk_ids` - Array of integers
- `response_text`
- `created_at`

### 4. Alembic Migration System ✅
- Initialized Alembic in `src/alembic/`
- Configured `alembic.ini`:
  - Timestamp-based migration naming
  - Environment variable database URL
- Updated `src/alembic/env.py`:
  - Imports all models for autogenerate
  - Loads settings from `.env`
  - Supports offline and online modes

### 5. Initial Migration ✅
Created migration: `20260213_5a003342d559_initial_schema_with_pgvector.py`

**Upgrade actions:**
1. Enable pgvector extension
2. Create document_chunks table with indexes
3. Create chunk_embeddings table with foreign key
4. Create IVFFlat index for vector similarity search
5. Create query_logs table

**Downgrade actions:**
- Clean rollback that drops tables in correct order
- Preserves pgvector extension for safety

### 6. Verification Script ✅
Created `scripts/test_connection.py` with comprehensive tests:
- Database connectivity check
- Table existence verification
- CRUD operations test
- Vector similarity search test
- ORM relationship validation

---

## File Structure Created

```
ask-my-resume/
├── .env                        # Database credentials (gitignored)
├── .env.example               # Template for credentials
├── .gitignore                 # Updated with Python patterns
├── pyproject.toml             # Python dependencies
├── alembic.ini                # Alembic configuration
├── MIGRATION_GUIDE.md         # This file
│
├── src/
│   ├── config.py              # Pydantic settings
│   │
│   ├── database/
│   │   ├── __init__.py        # Package exports
│   │   ├── base.py            # SQLAlchemy declarative base
│   │   ├── models.py          # ORM models
│   │   └── session.py         # Database session factory
│   │
│   └── alembic/
│       ├── env.py             # Alembic environment
│       ├── script.py.mako     # Migration template
│       └── versions/
│           └── 20260213_..._initial_schema_with_pgvector.py
│
└── scripts/
    ├── README.md              # Scripts documentation
    └── test_connection.py     # Database test suite
```

---

## Next Steps: Applying the Migration

⚠️ **Current Issue**: Cannot connect to Supabase database due to network/DNS resolution error.

### When Connectivity is Restored:

#### Step 1: Verify Connectivity
```bash
# Test network connection
ping db.cxcupwpdhonhaypzahca.supabase.co

# Or test with psql
psql "postgresql://postgres:SUaTBc7PWZ4H0TOt@db.cxcupwpdhonhaypzahca.supabase.co:5432/postgres"
```

#### Step 2: Apply Migration
```bash
# Activate virtual environment
source .venv/bin/activate

# Review migration SQL (dry run)
alembic upgrade head --sql

# Apply migration
alembic upgrade head

# Verify current version
alembic current
```

Expected output:
```
INFO  [alembic.runtime.migration] Running upgrade  -> 5a003342d559, initial schema with pgvector
```

#### Step 3: Run Tests
```bash
python scripts/test_connection.py
```

All tests should pass with ✅ checkmarks.

#### Step 4: Verify in Supabase Dashboard
1. Go to Supabase project dashboard
2. Navigate to Table Editor
3. Should see 3 new tables:
   - `document_chunks`
   - `chunk_embeddings`
   - `query_logs`

---

## Migration Management Commands

### View Status
```bash
alembic current                    # Show current migration
alembic history                    # Show all migrations
alembic show <revision>            # Show specific migration details
```

### Apply Migrations
```bash
alembic upgrade head               # Apply all pending
alembic upgrade +1                 # Apply next migration
alembic upgrade <revision>         # Upgrade to specific version
```

### Rollback
```bash
alembic downgrade -1               # Rollback one migration
alembic downgrade base             # Rollback all migrations
alembic downgrade <revision>       # Downgrade to specific version
```

### Create New Migrations
```bash
# With autogenerate (compares models to DB)
alembic revision --autogenerate -m "description"

# Manual (empty template)
alembic revision -m "description"
```

---

## Database Schema Design Decisions

### Why Separate Embeddings Table?
- **Flexibility**: Re-embed content with different models without touching source chunks
- **A/B Testing**: Compare multiple embedding models on same content
- **Storage**: Optimize storage separately for text vs vectors

### Why JSONB for Metadata?
- **Future-proof**: Add new fields without migrations
- **Flexibility**: Store tags, importance scores, custom attributes
- **Queryable**: PostgreSQL supports JSON queries and indexes

### Why IVFFlat Index?
- **Performance**: Approximate nearest neighbor search scales to millions of vectors
- **pgvector**: Industry standard for PostgreSQL vector search
- **Parameter**: `lists = 100` suitable for 1,000-10,000 vectors
  - Adjust for larger datasets: `lists = sqrt(row_count)` is a good heuristic

### Why Vector Dimension 1536?
- **OpenAI**: Supports text-embedding-ada-002 and text-embedding-3-small
- **Migration Path**: Can change dimension via Alembic if switching to text-embedding-3-large (3072 dims)
- **Tracking**: `embedding_model` column preserves which model created each vector

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'src'"
```bash
# Ensure you're in project root and venv is activated
cd /Users/franklindickinson/Projects/ask-my-resume
source .venv/bin/activate
pip install -e .
```

### "CREATE EXTENSION vector" fails
The pgvector extension must be enabled in your Supabase project:
- Should already be enabled (mentioned in project context)
- If not, contact Supabase support or use SQL editor in dashboard

### Migration already applied
```bash
# Check if tables already exist
alembic current

# If you need to reset
alembic downgrade base
alembic upgrade head
```

---

## Security Notes

✅ **Protected**:
- `.env` file is gitignored (contains database password)
- `.env.example` provides template without secrets
- Database connection uses SSL (Supabase default)

⚠️ **Best Practices**:
- Never commit `.env` to version control
- Rotate passwords periodically
- Use read-only credentials for frontend/client access
- Consider using Supabase Row Level Security (RLS) for production

---

## What's Next: Phase 3 Preview

Once migration is applied and tested, Phase 3 will implement:

### Content Ingestion Pipeline
1. **Markdown Parser**: Read files from `/content/` directory
2. **YAML Extractor**: Parse frontmatter (category, title, tags)
3. **Text Chunker**: Split content into semantic chunks (~500 tokens each)
4. **Embedding Generator**: Call OpenAI API for vector embeddings
5. **Database Writer**: Bulk insert chunks and embeddings

### Example Workflow
```python
# Phase 3 pseudocode (not implemented yet)
from src.ingestion import ingest_content

# Scan content directory
ingest_content(
    content_dir="content/",
    embedding_model="text-embedding-3-small",
    chunk_size=512,
    overlap=50
)
# → Populates document_chunks and chunk_embeddings tables
```

---

## Quick Reference

### Project Structure
- `/content/` - Markdown source files (Phase 1 ✅)
- `/src/database/` - ORM models and session factory (Phase 2 ✅)
- `/src/alembic/` - Database migrations (Phase 2 ✅)
- `/src/ingestion/` - Content processing (Phase 3 🔜)
- `/src/retrieval/` - Vector search (Phase 3 🔜)
- `/src/generation/` - LLM integration (Phase 4 🔜)

### Key Commands
```bash
# Setup
source .venv/bin/activate

# Migration
alembic upgrade head
alembic current

# Testing
python scripts/test_connection.py

# Database inspection (requires connectivity)
psql "$DATABASE_URL"
```

### Important Files
- `pyproject.toml` - Dependencies
- `.env` - Secrets (gitignored)
- `src/config.py` - Settings
- `src/database/models.py` - Schema definitions
- `src/alembic/versions/*.py` - Migrations

---

**Last Updated**: 2026-02-13
**Phase**: 2 - Infrastructure Setup
**Status**: Code complete, awaiting database connectivity
**Next**: Apply migration → Run tests → Phase 3 (Content Ingestion)
