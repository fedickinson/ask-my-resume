"""Database session factory and dependency injection."""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from src.config import settings


# Create SQLAlchemy engine
engine = create_engine(
    settings.get_sqlalchemy_url(),
    echo=settings.ENVIRONMENT == "development",  # Log SQL in development
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=5,
    max_overflow=10
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_session() -> Generator[Session, None, None]:
    """Dependency injection for database sessions.

    Usage:
        from src.database import get_session

        with next(get_session()) as session:
            # Use session here
            pass

    Or with FastAPI:
        @app.get("/endpoint")
        def endpoint(session: Session = Depends(get_session)):
            # Use session here
            pass
    """
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
