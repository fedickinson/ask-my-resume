# Scripts Directory

This directory contains utility scripts for the RAG Resume Assistant project.

## Scripts

### `test_connection.py`

Comprehensive test suite to verify database migration and connectivity.

**Usage:**
```bash
# Activate virtual environment first
source .venv/bin/activate

# Run the test suite
python scripts/test_connection.py
```

**What it tests:**
1. ✅ Database connectivity and PostgreSQL version
2. ✅ pgvector extension availability
3. ✅ Table creation (document_chunks, chunk_embeddings, query_logs)
4. ✅ CRUD operations with SQLAlchemy ORM
5. ✅ Vector similarity search with pgvector

**Expected output:**
- All tests should pass with green checkmarks ✅
- Summary report at the end

---

## Next Steps After Database Migration

Once you've successfully run the migration and tests pass, you can proceed to:

### Phase 3: Content Ingestion
1. **Chunking Pipeline**: Read markdown files from `/content/` and split into semantic chunks
2. **Embedding Generation**: Call OpenAI API to generate vector embeddings
3. **Database Population**: Insert chunks and embeddings into PostgreSQL

### Phase 4: RAG Implementation
1. **Semantic Search**: Query the database for similar chunks using pgvector
2. **Context Assembly**: Retrieve top-k most relevant chunks
3. **LLM Generation**: Use OpenAI API to generate responses with retrieved context

---

## Troubleshooting

### Connection Failed
If you see "could not translate host name" or connection errors:

1. **Check network connectivity:**
   ```bash
   ping db.cxcupwpdhonhaypzahca.supabase.co
   ```

2. **Verify database credentials:**
   - Check `.env` file has correct `DATABASE_URL`
   - Verify Supabase project is active

3. **Test with psql:**
   ```bash
   psql "postgresql://postgres:SUaTBc7PWZ4H0TOt@db.cxcupwpdhonhaypzahca.supabase.co:5432/postgres"
   ```

### Migration Failed
If migration doesn't apply cleanly:

1. **Check current migration status:**
   ```bash
   alembic current
   ```

2. **View migration history:**
   ```bash
   alembic history
   ```

3. **Rollback if needed:**
   ```bash
   alembic downgrade -1  # Go back one migration
   alembic downgrade base  # Rollback all migrations
   ```

4. **Reapply:**
   ```bash
   alembic upgrade head
   ```

### pgvector Extension Missing
If pgvector is not found:

```sql
-- Connect to your database and run:
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify:
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
```

---

## Manual Database Inspection

To inspect the database manually:

```bash
# Connect via psql
psql "postgresql://postgres:SUaTBc7PWZ4H0TOt@db.cxcupwpdhonhaypzahca.supabase.co:5432/postgres"

# List tables
\dt

# Describe table schema
\d document_chunks
\d chunk_embeddings
\d query_logs

# Check data
SELECT COUNT(*) FROM document_chunks;
SELECT COUNT(*) FROM chunk_embeddings;

# Test vector similarity
SELECT embedding_id, chunk_id,
       embedding <=> '[0.1, 0.2, ...]'::vector as distance
FROM chunk_embeddings
ORDER BY distance
LIMIT 5;
```
