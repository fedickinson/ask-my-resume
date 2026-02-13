"""LLM response generation using OpenAI."""

from typing import List, Tuple
from openai import OpenAI

from src.config import settings


SYSTEM_PROMPT = """You are an AI assistant helping people learn about Franklin Dickinson's background, experience, and skills.

You will be provided with relevant excerpts from Franklin's resume and background materials.
Answer questions based ONLY on the provided context. If the context doesn't contain relevant information, say so.

Be conversational, direct, and helpful. Highlight specific projects, accomplishments, and technical details when relevant."""


def generate_response(
    query: str,
    retrieved_chunks: List[Tuple[int, str, str, str, float]],
    model: str = "gpt-4o-mini",
    temperature: float = 0.7,
    max_tokens: int = 500
) -> str:
    """Generate response using retrieved context.

    Args:
        query: User's question
        retrieved_chunks: List of (chunk_id, content, source_file, category, distance)
        model: OpenAI model to use
        temperature: LLM temperature (0.0-2.0, higher = more creative)
        max_tokens: Maximum tokens in response

    Returns:
        Generated response text
    """
    # Build context from retrieved chunks
    context_parts = []
    for idx, (chunk_id, content, source_file, category, distance) in enumerate(retrieved_chunks, 1):
        context_parts.append(f"[{idx}] {content}")

    context = "\n\n".join(context_parts)

    # Create user message with context + query
    user_message = f"""Context from Franklin's background:

{context}

---

Question: {query}"""

    # Call OpenAI chat completion
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ],
        temperature=temperature,
        max_tokens=max_tokens
    )

    return response.choices[0].message.content
