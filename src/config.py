"""Application configuration using Pydantic Settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = Field(
        ...,
        description="PostgreSQL connection string with pgvector support"
    )
    OPENAI_API_KEY: str = Field(
        ...,
        description="OpenAI API key for generating embeddings"
    )
    ENVIRONMENT: str = Field(
        default="development",
        description="Environment: development, staging, or production"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """Validate that DATABASE_URL is a PostgreSQL connection string."""
        if not v.startswith(("postgresql://", "postgres://")):
            raise ValueError("DATABASE_URL must be a PostgreSQL connection string")
        return v

    def get_sqlalchemy_url(self) -> str:
        """Get the database URL for SQLAlchemy.

        Note: SQLAlchemy 2.0+ prefers 'postgresql://' over 'postgres://'.
        """
        return self.DATABASE_URL.replace("postgres://", "postgresql://")


# Singleton instance
settings = Settings()
