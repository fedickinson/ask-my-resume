#!/usr/bin/env python3
"""Simple example of querying the RAG system."""

import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from openai import OpenAI
from sqlalchemy import text

from src.config import settings
from src.database import SessionLocal


def search(query: str, top_k: int = 5):
    """Search for relevant content chunks."""
    # Initialize clients
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    session = SessionLocal()

    try:
        # Generate query embedding
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=query
        )
        query_embedding = response.data[0].embedding

        # Convert to PostgreSQL vector format
        vector_str = '[' + ','.join(map(str, query_embedding)) + ']'

        # Search database using L2 distance
        # Note: For normalized embeddings, L2 distance ranks the same as cosine distance
        sql = text(f"""
            SELECT
                c.content,
                c.source_file,
                c.category,
                c.document_title,
                l2_distance(e.embedding, '{vector_str}'::vector) AS distance
            FROM chunk_embeddings e
            JOIN document_chunks c ON e.chunk_id = c.chunk_id
            WHERE e.embedding_model = 'text-embedding-3-small'
            ORDER BY distance
            LIMIT {top_k}
        """)

        results = session.execute(sql).fetchall()
        return results

    finally:
        session.close()


def main():
    """Run example queries."""
    queries = [
        "What did Franklin do at Meta?",
        "What are Franklin's technical skills?",
        "When does Franklin graduate?",
    ]

    for query in queries:
        print("=" * 70)
        print(f"Query: {query}")
        print("=" * 70)

        results = search(query, top_k=3)

        for idx, (content, source_file, category, title, distance) in enumerate(results, 1):
            print(f"\n[{idx}] Distance: {distance:.4f}")
            print(f"    Category: {category}")
            print(f"    File: {source_file}")
            print(f"    Content: {content[:200]}...")

        print("\n")


if __name__ == "__main__":
    main()
