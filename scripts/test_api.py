#!/usr/bin/env python3
"""Simple script to test the RAG Resume Assistant API."""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8003"

def test_root():
    """Test root endpoint."""
    print("=" * 70)
    print("Testing root endpoint...")
    print("=" * 70)
    response = requests.get(f"{BASE_URL}/")
    print(json.dumps(response.json(), indent=2))
    print()

def test_health():
    """Test health endpoint."""
    print("=" * 70)
    print("Testing health endpoint...")
    print("=" * 70)
    response = requests.get(f"{BASE_URL}/health")
    print(json.dumps(response.json(), indent=2))
    print()

def test_query(query: str, top_k: int = 5):
    """Test query endpoint."""
    print("=" * 70)
    print(f"Query: {query}")
    print("=" * 70)
    response = requests.post(
        f"{BASE_URL}/query",
        json={"query": query, "top_k": top_k}
    )
    result = response.json()

    print(f"\nAnswer:\n{result['answer']}\n")
    print(f"Sources:")
    for source in result['sources']:
        print(f"  - {source}")
    print()

def main():
    """Run all tests."""
    # Test basic endpoints
    test_root()
    test_health()

    # Test various queries
    test_queries = [
        "What did Franklin do at Meta?",
        "What are Franklin's technical skills?",
        "When does Franklin graduate?",
        "Tell me about Franklin's Budget Buddy project",
        "What is Franklin's experience with causal inference?",
    ]

    for query in test_queries:
        test_query(query)

if __name__ == "__main__":
    main()
