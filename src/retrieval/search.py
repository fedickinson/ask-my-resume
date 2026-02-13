"""Vector similarity search for retrieving relevant resume chunks."""

from typing import List, Tuple
from sqlalchemy import text
from sqlalchemy.orm import Session
from openai import OpenAI

from src.config import settings


def retrieve_chunks(
    query: str,
    session: Session,
    top_k: int = 5,
    embedding_model: str = "text-embedding-3-small"
) -> List[Tuple[int, str, str, str, float]]:
    """Retrieve most relevant chunks for a query.

    Args:
        query: User's question
        session: Database session
        top_k: Number of chunks to retrieve
        embedding_model: OpenAI embedding model to use

    Returns:
        List of (chunk_id, content, source_file, category, distance) tuples
    """
    # Generate query embedding
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.embeddings.create(
        model=embedding_model,
        input=query
    )
    query_embedding = response.data[0].embedding

    # Convert to PostgreSQL vector format
    vector_str = '[' + ','.join(map(str, query_embedding)) + ']'

    # Search using l2_distance (Supabase pgvector requirement)
    # Note: For normalized embeddings (OpenAI's), L2 and cosine distance rank identically
    sql = text(f"""
        SELECT
            c.chunk_id,
            c.content,
            c.source_file,
            c.category,
            l2_distance(e.embedding, '{vector_str}'::vector) AS distance
        FROM chunk_embeddings e
        JOIN document_chunks c ON e.chunk_id = c.chunk_id
        WHERE e.embedding_model = :model
        ORDER BY distance
        LIMIT :limit
    """)

    results = session.execute(sql, {"model": embedding_model, "limit": top_k}).fetchall()
    return results
