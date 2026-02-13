#!/usr/bin/env python3
"""Test similarity search on ingested content."""

import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from openai import OpenAI
from sqlalchemy import text

from src.config import settings
from src.database import SessionLocal


def test_similarity_search(query: str, top_k: int = 5):
    """Test similarity search with a sample query."""
    print("=" * 60)
    print(f"Testing Similarity Search")
    print("=" * 60)
    print(f"Query: {query}")
    print()

    # Initialize OpenAI client
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    # Generate query embedding
    print("Generating query embedding...")
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    query_vector = response.data[0].embedding

    # Convert vector to PostgreSQL format
    vector_str = '[' + ','.join(map(str, query_vector)) + ']'

    # Search for similar chunks
    print(f"Searching for top {top_k} most similar chunks...")
    print()

    session = SessionLocal()
    try:
        # Use f-string for vector since SQLAlchemy has issues with ::vector casting
        sql = text(f"""
            SELECT
                c.content,
                c.source_file,
                c.category,
                c.document_title,
                e.embedding <=> '{vector_str}'::vector AS distance
            FROM chunk_embeddings e
            JOIN document_chunks c ON e.chunk_id = c.chunk_id
            WHERE e.embedding_model = 'text-embedding-3-small'
            ORDER BY e.embedding <=> '{vector_str}'::vector
            LIMIT {top_k}
        """)

        results = session.execute(sql).fetchall()

        print(f"Found {len(results)} results:")
        print("=" * 60)
        print()

        for idx, (content, source_file, category, title, distance) in enumerate(results, 1):
            print(f"[{idx}] Distance: {distance:.4f}")
            print(f"    Category: {category}")
            print(f"    File: {source_file}")
            print(f"    Title: {title}")
            print(f"    Content preview: {content[:200]}...")
            print()

    finally:
        session.close()


if __name__ == "__main__":
    # Test queries from the plan
    test_queries = [
        "What did Franklin do at Meta?",
        "What are Franklin's technical skills?",
        "When does Franklin graduate?",
    ]

    for query in test_queries:
        test_similarity_search(query, top_k=3)
        print("\n" + "=" * 60 + "\n")
