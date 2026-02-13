#!/usr/bin/env python3
"""Test database connection and verify migration."""

import sys
import random
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import select, text
from sqlalchemy.orm import Session

from src.config import settings
from src.database import DocumentChunk, ChunkEmbedding, QueryLog
from src.database.session import engine, SessionLocal


def test_connection():
    """Test basic database connection."""
    print("=" * 60)
    print("1. Testing Database Connection")
    print("=" * 60)

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.scalar()
            print(f"✅ Connected to PostgreSQL")
            print(f"   Version: {version[:50]}...")

            # Check pgvector extension
            result = conn.execute(text(
                "SELECT extname, extversion FROM pg_extension WHERE extname = 'vector'"
            ))
            ext = result.fetchone()
            if ext:
                print(f"✅ pgvector extension enabled (version {ext[1]})")
            else:
                print("❌ pgvector extension NOT found")
                return False

    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

    return True


def test_tables():
    """Verify all tables exist."""
    print("\n" + "=" * 60)
    print("2. Verifying Tables")
    print("=" * 60)

    expected_tables = ['document_chunks', 'chunk_embeddings', 'query_logs']

    try:
        with engine.connect() as conn:
            for table in expected_tables:
                result = conn.execute(text(
                    f"SELECT EXISTS (SELECT FROM information_schema.tables "
                    f"WHERE table_name = '{table}')"
                ))
                exists = result.scalar()
                if exists:
                    print(f"✅ Table '{table}' exists")
                else:
                    print(f"❌ Table '{table}' NOT found")
                    return False
    except Exception as e:
        print(f"❌ Table verification failed: {e}")
        return False

    return True


def test_crud_operations():
    """Test CRUD operations with ORM."""
    print("\n" + "=" * 60)
    print("3. Testing CRUD Operations")
    print("=" * 60)

    session: Session = SessionLocal()

    try:
        # Create a test chunk
        print("\n📝 Creating test document chunk...")
        test_chunk = DocumentChunk(
            content="Franklin Dickinson worked at Meta for 4 years as a software engineer, "
                   "focusing on AI and machine learning infrastructure.",
            source_file="content/experience/meta-overview.md",
            category="experience",
            document_title="Meta Overview",
            chunk_index=0,
            metadata_json={"tags": ["meta", "ai", "ml"], "importance": "high"}
        )
        session.add(test_chunk)
        session.commit()
        session.refresh(test_chunk)
        print(f"✅ Created chunk with ID: {test_chunk.chunk_id}")

        # Create a test embedding (1536-dimensional vector)
        print("\n📊 Creating test embedding...")
        test_vector = [random.random() for _ in range(1536)]
        test_embedding = ChunkEmbedding(
            chunk_id=test_chunk.chunk_id,
            embedding=test_vector,
            embedding_model="text-embedding-ada-002"
        )
        session.add(test_embedding)
        session.commit()
        session.refresh(test_embedding)
        print(f"✅ Created embedding with ID: {test_embedding.embedding_id}")

        # Read the chunk back
        print("\n🔍 Reading chunk back from database...")
        retrieved_chunk = session.query(DocumentChunk).filter_by(
            chunk_id=test_chunk.chunk_id
        ).first()
        if retrieved_chunk:
            print(f"✅ Retrieved chunk: {retrieved_chunk.source_file}")
            print(f"   Content preview: {retrieved_chunk.content[:80]}...")
            print(f"   Metadata: {retrieved_chunk.metadata_json}")
        else:
            print("❌ Failed to retrieve chunk")
            return False

        # Test the relationship
        print("\n🔗 Testing ORM relationships...")
        if retrieved_chunk.embeddings:
            print(f"✅ Chunk has {len(retrieved_chunk.embeddings)} embedding(s)")
            print(f"   Embedding model: {retrieved_chunk.embeddings[0].embedding_model}")
        else:
            print("❌ No embeddings found for chunk")
            return False

        # Clean up test data
        print("\n🧹 Cleaning up test data...")
        session.delete(test_chunk)  # Cascade will delete embedding
        session.commit()
        print("✅ Test data cleaned up")

    except Exception as e:
        print(f"❌ CRUD operations failed: {e}")
        session.rollback()
        return False
    finally:
        session.close()

    return True


def test_vector_similarity():
    """Test pgvector similarity search."""
    print("\n" + "=" * 60)
    print("4. Testing Vector Similarity Search")
    print("=" * 60)

    session: Session = SessionLocal()

    try:
        # Create test data with multiple embeddings
        print("\n📝 Creating test dataset...")
        chunks_data = [
            ("Experience at Meta", "meta-overview.md", "experience"),
            ("Python skills", "skills.md", "skills"),
            ("AI project", "projects.md", "projects"),
        ]

        chunk_ids = []
        for content, source, category in chunks_data:
            chunk = DocumentChunk(
                content=content,
                source_file=f"content/{category}/{source}",
                category=category,
                document_title=content,
                chunk_index=0
            )
            session.add(chunk)
            session.flush()  # Get the ID
            chunk_ids.append(chunk.chunk_id)

            # Add embedding
            embedding = ChunkEmbedding(
                chunk_id=chunk.chunk_id,
                embedding=[random.random() for _ in range(1536)],
                embedding_model="text-embedding-ada-002"
            )
            session.add(embedding)

        session.commit()
        print(f"✅ Created {len(chunks_data)} test chunks with embeddings")

        # Perform similarity search
        print("\n🔍 Performing cosine similarity search...")
        query_vector = [random.random() for _ in range(1536)]

        # Query for top 3 most similar embeddings
        results = session.execute(
            select(
                ChunkEmbedding.embedding_id,
                ChunkEmbedding.chunk_id,
                ChunkEmbedding.embedding.cosine_distance(query_vector).label('distance')
            )
            .order_by(ChunkEmbedding.embedding.cosine_distance(query_vector))
            .limit(3)
        ).all()

        if results:
            print(f"✅ Found {len(results)} similar embeddings:")
            for i, (emb_id, chunk_id, distance) in enumerate(results, 1):
                print(f"   {i}. Embedding {emb_id} (chunk {chunk_id}), distance: {distance:.4f}")
        else:
            print("❌ No results from similarity search")
            return False

        # Clean up
        print("\n🧹 Cleaning up test data...")
        for chunk_id in chunk_ids:
            chunk = session.query(DocumentChunk).filter_by(chunk_id=chunk_id).first()
            if chunk:
                session.delete(chunk)
        session.commit()
        print("✅ Test data cleaned up")

    except Exception as e:
        print(f"❌ Vector similarity search failed: {e}")
        session.rollback()
        return False
    finally:
        session.close()

    return True


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("RAG Resume Assistant - Database Migration Test")
    print("=" * 60)
    print(f"Database: {settings.DATABASE_URL.split('@')[1]}")  # Hide password
    print(f"Environment: {settings.ENVIRONMENT}")
    print()

    tests = [
        ("Connection", test_connection),
        ("Tables", test_tables),
        ("CRUD Operations", test_crud_operations),
        ("Vector Similarity", test_vector_similarity),
    ]

    results = {}
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"\n❌ {test_name} test crashed: {e}")
            results[test_name] = False

    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {test_name}")

    all_passed = all(results.values())
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 All tests passed! Database migration successful.")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
    print("=" * 60)

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
