"""FastAPI application for RAG Resume Assistant."""

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from src.database import get_session
from src.database.models import QueryLog
from src.retrieval import retrieve_chunks
from src.generation import generate_response


app = FastAPI(
    title="RAG Resume Assistant",
    description="Ask questions about Franklin Dickinson's background and experience",
    version="1.0.0"
)


class QueryRequest(BaseModel):
    """Request model for query endpoint."""
    query: str = Field(..., min_length=1, max_length=500, description="Question to ask")
    top_k: int = Field(default=5, ge=1, le=20, description="Number of chunks to retrieve")


class QueryResponse(BaseModel):
    """Response model for query endpoint."""
    query: str
    answer: str
    sources: list[str]


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "RAG Resume Assistant",
        "version": "1.0.0"
    }


@app.post("/query", response_model=QueryResponse)
async def query(
    request: QueryRequest,
    session: Session = Depends(get_session)
):
    """Answer a question about Franklin's resume using RAG.

    Process:
    1. Retrieve relevant chunks from vector database
    2. Generate response using LLM with retrieved context
    3. Return answer with source files
    """
    try:
        # Retrieve relevant chunks
        chunks = retrieve_chunks(
            query=request.query,
            session=session,
            top_k=request.top_k
        )

        if not chunks:
            raise HTTPException(
                status_code=404,
                detail="No relevant content found for query"
            )

        # Generate response
        answer = generate_response(
            query=request.query,
            retrieved_chunks=chunks
        )

        # Extract unique source files
        sources = list(set(source_file for _, _, source_file, _, _ in chunks))

        # Log query to database
        try:
            chunk_ids = [chunk_id for chunk_id, _, _, _, _ in chunks]
            query_log = QueryLog(
                query_text=request.query,
                retrieved_chunk_ids=chunk_ids,
                response_text=answer
            )
            session.add(query_log)
            session.commit()
        except Exception as log_error:
            # Don't fail the request if logging fails
            print(f"Warning: Failed to log query: {log_error}")

        return QueryResponse(
            query=request.query,
            answer=answer,
            sources=sources
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )


@app.get("/health")
async def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "services": ["retrieval", "generation"]
    }
