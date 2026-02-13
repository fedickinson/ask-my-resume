#!/usr/bin/env python3
"""Verify that the environment is set up correctly for content ingestion."""

import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))


def verify_setup():
    """Run all verification checks."""
    print("=" * 60)
    print("Setup Verification for Content Ingestion")
    print("=" * 60)
    print()

    all_checks_passed = True

    # Check 1: .env file exists
    print("1️⃣  Checking .env file...")
    env_file = project_root / ".env"
    if not env_file.exists():
        print("   ❌ .env file not found")
        print("   → Copy .env.example to .env and fill in your credentials")
        all_checks_passed = False
    else:
        print("   ✅ .env file exists")

    # Check 2: Load config
    print()
    print("2️⃣  Loading configuration...")
    try:
        from src.config import settings
        print("   ✅ Configuration loaded")
    except Exception as e:
        print(f"   ❌ Failed to load configuration: {e}")
        all_checks_passed = False
        return all_checks_passed

    # Check 3: DATABASE_URL
    print()
    print("3️⃣  Checking DATABASE_URL...")
    try:
        db_url = settings.DATABASE_URL
        if "your-project-ref" in db_url or "your-password" in db_url:
            print("   ❌ DATABASE_URL contains placeholder values")
            print("   → Update DATABASE_URL in .env with your Supabase credentials")
            all_checks_passed = False
        else:
            print(f"   ✅ DATABASE_URL is configured")
    except Exception as e:
        print(f"   ❌ DATABASE_URL not set: {e}")
        all_checks_passed = False

    # Check 4: OPENAI_API_KEY
    print()
    print("4️⃣  Checking OPENAI_API_KEY...")
    try:
        api_key = settings.OPENAI_API_KEY
        if api_key.startswith("sk-") and len(api_key) > 20:
            print(f"   ✅ OPENAI_API_KEY is configured (sk-...{api_key[-4:]})")
        else:
            print("   ⚠️  OPENAI_API_KEY format looks unusual")
            print("   → Make sure it's a valid OpenAI API key starting with 'sk-'")
            all_checks_passed = False
    except Exception as e:
        print(f"   ❌ OPENAI_API_KEY not set: {e}")
        print("   → Add your OpenAI API key to .env")
        print("   → Get one from: https://platform.openai.com/api-keys")
        all_checks_passed = False

    # Check 5: Database connection
    print()
    print("5️⃣  Testing database connection...")
    try:
        from src.database import SessionLocal
        session = SessionLocal()
        session.close()
        print("   ✅ Database connection successful")
    except Exception as e:
        print(f"   ❌ Database connection failed: {e}")
        print("   → Check your DATABASE_URL in .env")
        all_checks_passed = False

    # Check 6: Content directory
    print()
    print("6️⃣  Checking content directory...")
    content_dir = project_root / "content"
    if not content_dir.exists():
        print(f"   ❌ Content directory not found at {content_dir}")
        all_checks_passed = False
    else:
        md_files = list(content_dir.rglob("*.md"))
        print(f"   ✅ Found {len(md_files)} markdown file(s)")

    # Check 7: Required packages
    print()
    print("7️⃣  Checking required packages...")
    missing_packages = []

    try:
        import frontmatter
        print("   ✅ python-frontmatter installed")
    except ImportError:
        print("   ❌ python-frontmatter not installed")
        missing_packages.append("python-frontmatter")

    try:
        import openai
        print("   ✅ openai installed")
    except ImportError:
        print("   ❌ openai not installed")
        missing_packages.append("openai")

    if missing_packages:
        print()
        print(f"   → Run: pip install -e .")
        all_checks_passed = False

    # Summary
    print()
    print("=" * 60)
    if all_checks_passed:
        print("✅ All checks passed! You're ready to run the ingestion.")
        print()
        print("Next step:")
        print("  python scripts/ingest_content.py")
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        print()
        print("Common fixes:")
        print("  1. Copy .env.example to .env")
        print("  2. Add your OpenAI API key to .env")
        print("  3. Update DATABASE_URL with your Supabase credentials")
        print("  4. Run: pip install -e .")
    print("=" * 60)

    return all_checks_passed


if __name__ == "__main__":
    success = verify_setup()
    sys.exit(0 if success else 1)
