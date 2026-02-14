"""SQLAlchemy ORM models for RAG Resume Assistant."""

from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import (
    String,
    Text,
    Integer,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    Index,
    ARRAY,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector

from src.database.base import Base


class DocumentChunk(Base):
    """Stores chunked content from markdown files.

    Each row represents a semantic chunk of text extracted from a source document.
    Chunks preserve document structure via chunk_index for context reconstruction.
    """
    __tablename__ = "document_chunks"

    chunk_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    source_file: Mapped[str] = mapped_column(String(512), nullable=False, index=True)
    category: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    document_title: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationship to embeddings
    embeddings: Mapped[List["ChunkEmbedding"]] = relationship(
        "ChunkEmbedding",
        back_populates="chunk",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<DocumentChunk(id={self.chunk_id}, source='{self.source_file}', index={self.chunk_index})>"


class ChunkEmbedding(Base):
    """Stores vector embeddings for document chunks.

    Separates embeddings from chunks to allow re-embedding with different models
    without touching source content. Supports A/B testing and model migration.
    """
    __tablename__ = "chunk_embeddings"

    embedding_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    chunk_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("document_chunks.chunk_id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    embedding: Mapped[Vector] = mapped_column(Vector(1536), nullable=False)
    embedding_model: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationship to chunk
    chunk: Mapped["DocumentChunk"] = relationship(
        "DocumentChunk",
        back_populates="embeddings"
    )

    __table_args__ = (
        UniqueConstraint("chunk_id", "embedding_model", name="uq_chunk_embedding_model"),
        Index("idx_embedding_model", "embedding_model"),
    )

    def __repr__(self) -> str:
        return f"<ChunkEmbedding(id={self.embedding_id}, chunk_id={self.chunk_id}, model='{self.embedding_model}')>"


class QueryLog(Base):
    """Logs user queries and retrieval results for observability.

    Optional table for Phase 4 monitoring and analytics.
    Tracks which chunks were retrieved for each query to enable:
    - Performance analysis
    - Retrieval quality metrics
    - User behavior insights
    """
    __tablename__ = "query_logs"

    query_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    query_text: Mapped[str] = mapped_column(Text, nullable=False)
    retrieved_chunk_ids: Mapped[Optional[List[int]]] = mapped_column(ARRAY(Integer), nullable=True)
    response_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        index=True
    )

    def __repr__(self) -> str:
        return f"<QueryLog(id={self.query_id}, query='{self.query_text[:50]}...', created_at={self.created_at})>"
