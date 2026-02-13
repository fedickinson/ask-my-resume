#!/usr/bin/env python3
"""Content ingestion pipeline for RAG Resume Assistant.

This script:
1. Scans the /content directory for markdown files
2. Parses YAML frontmatter and content
3. Chunks content based on strategy (whole or paragraph)
4. Generates embeddings via OpenAI API
5. Stores chunks and embeddings in the database
"""

import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
import time

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import frontmatter
from openai import OpenAI

from src.config import settings
from src.database import SessionLocal, DocumentChunk, ChunkEmbedding


# Constants
CONTENT_DIR = project_root / "content"
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536
BATCH_SIZE = 20  # Number of texts to embed in one API call


def find_markdown_files() -> List[Path]:
    """Find all markdown files in the content directory."""
    return sorted(CONTENT_DIR.rglob("*.md"))


def parse_markdown_file(file_path: Path) -> Optional[Dict[str, Any]]:
    """Parse a markdown file with YAML frontmatter.

    Returns:
        Dict with 'frontmatter' and 'content' keys, or None if file is empty
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)

        # Skip files with no content
        if not post.content or not post.content.strip():
            return None

        return {
            'frontmatter': dict(post.metadata),
            'content': post.content.strip()
        }
    except Exception as e:
        print(f"  ⚠️  Error parsing {file_path}: {e}")
        return None


def chunk_content(content: str, strategy: str, context_prefix: str = "") -> List[str]:
    """Chunk content based on the specified strategy.

    Args:
        content: The markdown content to chunk
        strategy: Either "whole" or "paragraph"
        context_prefix: Optional prefix to add to each chunk

    Returns:
        List of text chunks
    """
    if strategy == "whole":
        # Single chunk for entire content
        chunks = [content]
    elif strategy == "paragraph":
        # Split on double newlines, filter empty paragraphs
        paragraphs = content.split('\n\n')
        chunks = [p.strip() for p in paragraphs if p.strip()]
    else:
        print(f"  ⚠️  Unknown chunk_strategy: {strategy}, defaulting to 'paragraph'")
        paragraphs = content.split('\n\n')
        chunks = [p.strip() for p in paragraphs if p.strip()]

    # Add context prefix if provided
    if context_prefix:
        chunks = [f"{context_prefix}{chunk}" for chunk in chunks]

    return chunks


def generate_embeddings(texts: List[str], client: OpenAI) -> List[List[float]]:
    """Generate embeddings for a batch of texts using OpenAI API.

    Args:
        texts: List of text strings to embed
        client: OpenAI client instance

    Returns:
        List of embedding vectors
    """
    try:
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=texts
        )
        return [item.embedding for item in response.data]
    except Exception as e:
        print(f"  ❌ Error generating embeddings: {e}")
        raise


def process_file(file_path: Path, client: OpenAI, session) -> int:
    """Process a single markdown file and insert into database.

    Returns:
        Number of chunks created
    """
    # Get relative path for storage
    relative_path = file_path.relative_to(project_root)

    # Parse file
    parsed = parse_markdown_file(file_path)
    if parsed is None:
        return 0

    frontmatter = parsed['frontmatter']
    content = parsed['content']

    # Extract metadata
    category = frontmatter.get('category')
    document_title = frontmatter.get('title')
    chunk_strategy = frontmatter.get('chunk_strategy', 'paragraph')
    context_prefix = frontmatter.get('context_prefix', '')

    # Chunk the content
    chunks = chunk_content(content, chunk_strategy, context_prefix)

    if not chunks:
        print(f"  ⚠️  No chunks created (empty content)")
        return 0

    print(f"  📝 Created {len(chunks)} chunk(s)")

    # Generate embeddings in batches
    all_embeddings = []
    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i:i + BATCH_SIZE]
        batch_embeddings = generate_embeddings(batch, client)
        all_embeddings.extend(batch_embeddings)

        # Small delay to avoid rate limits
        if i + BATCH_SIZE < len(chunks):
            time.sleep(0.1)

    print(f"  🔢 Generated {len(all_embeddings)} embedding(s)")

    # Insert into database
    try:
        for idx, (chunk_text, embedding) in enumerate(zip(chunks, all_embeddings)):
            # Create document chunk
            db_chunk = DocumentChunk(
                content=chunk_text,
                source_file=str(relative_path),
                category=category,
                document_title=document_title,
                chunk_index=idx,
                metadata_json=frontmatter
            )
            session.add(db_chunk)
            session.flush()  # Get the chunk_id

            # Create embedding
            db_embedding = ChunkEmbedding(
                chunk_id=db_chunk.chunk_id,
                embedding=embedding,
                embedding_model=EMBEDDING_MODEL
            )
            session.add(db_embedding)

        session.commit()
        print(f"  ✅ Saved to database")

    except Exception as e:
        session.rollback()
        print(f"  ❌ Database error: {e}")
        raise

    return len(chunks)


def main():
    """Main ingestion pipeline."""
    print("=" * 60)
    print("RAG Resume Assistant - Content Ingestion Pipeline")
    print("=" * 60)
    print()

    # Initialize OpenAI client
    print("🔑 Initializing OpenAI client...")
    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
    except Exception as e:
        print(f"❌ Failed to initialize OpenAI client: {e}")
        print("   Make sure OPENAI_API_KEY is set in .env")
        sys.exit(1)

    # Initialize database session
    print("🗄️  Connecting to database...")
    try:
        session = SessionLocal()
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        print("   Make sure DATABASE_URL is set correctly in .env")
        sys.exit(1)

    # Find markdown files
    print(f"📂 Scanning {CONTENT_DIR} for markdown files...")
    markdown_files = find_markdown_files()
    print(f"   Found {len(markdown_files)} file(s)")
    print()

    # Process each file
    total_chunks = 0
    processed_files = 0
    skipped_files = 0

    for file_path in markdown_files:
        print(f"Processing {file_path.relative_to(project_root)}...")

        try:
            num_chunks = process_file(file_path, client, session)
            if num_chunks > 0:
                total_chunks += num_chunks
                processed_files += 1
            else:
                print(f"  ⏭️  Skipped (empty or no content)")
                skipped_files += 1
        except Exception as e:
            print(f"  ❌ Failed to process file: {e}")
            skipped_files += 1
            continue

        print()

    # Summary
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"✅ Successfully processed: {processed_files} file(s)")
    print(f"⏭️  Skipped (empty): {skipped_files} file(s)")
    print(f"📦 Total chunks created: {total_chunks}")
    print(f"🔢 Total embeddings generated: {total_chunks}")
    print()

    # Verify database contents
    print("Verifying database contents...")
    try:
        chunk_count = session.query(DocumentChunk).count()
        embedding_count = session.query(ChunkEmbedding).count()
        categories = session.query(DocumentChunk.category).distinct().all()

        print(f"  Chunks in database: {chunk_count}")
        print(f"  Embeddings in database: {embedding_count}")
        print(f"  Categories: {[c[0] for c in categories if c[0]]}")
    except Exception as e:
        print(f"  ⚠️  Error querying database: {e}")
    finally:
        session.close()

    print()
    print("✨ Ingestion complete!")


if __name__ == "__main__":
    main()
