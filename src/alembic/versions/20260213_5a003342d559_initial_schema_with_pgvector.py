"""initial schema with pgvector

Revision ID: 5a003342d559
Revises:
Create Date: 2026-02-13 16:25:52.289772

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from pgvector.sqlalchemy import Vector


# revision identifiers, used by Alembic.
revision: str = '5a003342d559'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Enable pgvector extension (idempotent)
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')

    # Create document_chunks table
    op.create_table(
        'document_chunks',
        sa.Column('chunk_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('source_file', sa.String(length=512), nullable=False),
        sa.Column('category', sa.String(length=128), nullable=True),
        sa.Column('document_title', sa.String(length=512), nullable=True),
        sa.Column('chunk_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('metadata_json', JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('chunk_id')
    )

    # Create indexes for document_chunks
    op.create_index('ix_document_chunks_source_file', 'document_chunks', ['source_file'])
    op.create_index('ix_document_chunks_category', 'document_chunks', ['category'])

    # Create chunk_embeddings table
    op.create_table(
        'chunk_embeddings',
        sa.Column('embedding_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('chunk_id', sa.Integer(), nullable=False),
        sa.Column('embedding', Vector(dim=1536), nullable=False),
        sa.Column('embedding_model', sa.String(length=128), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.ForeignKeyConstraint(['chunk_id'], ['document_chunks.chunk_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('embedding_id'),
        sa.UniqueConstraint('chunk_id', 'embedding_model', name='uq_chunk_embedding_model')
    )

    # Create indexes for chunk_embeddings
    op.create_index('ix_chunk_embeddings_chunk_id', 'chunk_embeddings', ['chunk_id'])
    op.create_index('idx_embedding_model', 'chunk_embeddings', ['embedding_model'])

    # Create IVFFlat index for fast vector similarity search
    # Note: This requires some data to be present for optimal performance
    # The lists parameter (100) is suitable for datasets with thousands of vectors
    op.execute("""
        CREATE INDEX idx_embedding_vector_cosine
        ON chunk_embeddings
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100)
    """)

    # Create query_logs table (optional, for Phase 4 observability)
    op.create_table(
        'query_logs',
        sa.Column('query_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('query_text', sa.Text(), nullable=False),
        sa.Column('retrieved_chunk_ids', ARRAY(sa.Integer()), nullable=True),
        sa.Column('response_text', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False,
                  server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('query_id')
    )

    # Create index for query_logs
    op.create_index('ix_query_logs_created_at', 'query_logs', ['created_at'])


def downgrade() -> None:
    """Downgrade schema."""
    # Drop tables in reverse order (respect foreign key constraints)
    op.drop_index('ix_query_logs_created_at', table_name='query_logs')
    op.drop_table('query_logs')

    op.execute('DROP INDEX IF EXISTS idx_embedding_vector_cosine')
    op.drop_index('idx_embedding_model', table_name='chunk_embeddings')
    op.drop_index('ix_chunk_embeddings_chunk_id', table_name='chunk_embeddings')
    op.drop_table('chunk_embeddings')

    op.drop_index('ix_document_chunks_category', table_name='document_chunks')
    op.drop_index('ix_document_chunks_source_file', table_name='document_chunks')
    op.drop_table('document_chunks')

    # Note: We don't drop the vector extension to avoid breaking other schemas
    # op.execute('DROP EXTENSION IF EXISTS vector')
