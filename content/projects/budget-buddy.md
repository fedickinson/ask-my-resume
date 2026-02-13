---
category: "projects"
document: "budget-buddy"
title: "Budget Buddy — Franklin's Full-Stack AI Personal Finance App"
summary: "Comprehensive overview of Budget Buddy, a production-deployed personal finance app with an AI financial coach powered by Claude, ML transaction classification, Plaid bank integration, Langfuse observability, and ~430 automated tests"
chunk_strategy: "paragraph"
context_prefix: "Franklin Dickinson — Budget Buddy Project: "
sample_queries:
  - "What has Franklin built with LLMs?"
  - "Tell me about Franklin's AI project"
  - "Does Franklin have production experience?"
  - "What's Franklin's tech stack?"
  - "Has Franklin built a full-stack application?"
  - "How does Franklin use AI in his projects?"
  - "Tell me about Budget Buddy"
  - "Does Franklin have experience with prompt engineering?"
  - "Has Franklin worked with observability tools?"
  - "Can Franklin build end-to-end products?"
  - "How does Franklin think about AI costs?"
  - "Does Franklin write tests?"
  - "Has Franklin deployed anything to production?"
  - "What's the most complex thing Franklin has built?"
---

# Budget Buddy

## What It Is

Budget Buddy is a full-stack personal finance application with an AI financial coach called "Buddy." Users connect their bank accounts, import transactions, set budgets, and get conversational financial guidance powered by Claude. The app is deployed in production with a React frontend on Vercel, a FastAPI backend on Railway, PostgreSQL on Supabase, Plaid for bank data, scikit-learn for transaction classification, and Langfuse for LLM observability.

Franklin built this entirely as a solo developer — architecture, backend, frontend, ML pipeline, AI integration, CI/CD, deployment, and testing. The codebase includes approximately 430 automated tests across frontend integration tests, backend unit and integration tests, and end-to-end tests with Playwright.

## Why He Built It

Budget Buddy started as a learning vehicle and evolved into a genuine portfolio piece. Franklin wanted to build something that exercises every skill an AI Product Engineer needs: full-stack development, LLM integration, ML pipelines, database design, API design, authentication, deployment, observability, and testing. A personal finance app was the right choice because financial data is inherently relational, users care deeply about accuracy and trust, and the domain creates natural opportunities for AI features that go beyond simple chatbot wrappers.

The project also serves as Franklin's system design interview secret weapon. When asked to design an AI-powered product, he can walk through real architectural decisions he's made, tradeoffs he's navigated, and scaling considerations he's thought through — all grounded in a working system he built himself.

## Architecture

The app follows a three-tier architecture. The React 19 frontend is a single-page application hosted on Vercel, using React-Bootstrap for UI, Chart.js and Recharts for data visualization, and React Context for state management. The Python FastAPI backend runs on Railway, handling API routing, authentication, business logic, ML inference, and LLM orchestration across 41 service files. PostgreSQL 16 on Supabase provides the data layer, with Supavisor connection pooling for production workloads.

The backend is organized around a service architecture with clear separation of concerns. Key services include BuddyChatService for conversational AI, BuddyInsightService for automated financial insights, ClassificationOrchestrator for the ML pipeline, ReviewSessionService for the month-end review experience, AnalyticsService for financial summaries and trends, PlaidService for bank integration, EncryptionService for field-level encryption, and ObservabilityService for Langfuse integration.

Communication between frontend and backend uses a proxy pattern: in development, http-proxy-middleware routes API calls from the React dev server to the FastAPI backend; in production, Vercel's API rewrites proxy to the Railway backend URL, keeping everything same-origin and avoiding cross-origin cookie issues.

## AI Integration

### Conversational Financial Coach

The centerpiece AI feature is Buddy, a conversational financial coach powered by Claude Sonnet 4. When a user asks Buddy a question, the system pre-calculates their complete financial context — current month spending by category, budget progress, merchant patterns, subscription intelligence, weekly summaries, and goal status — and injects it into a structured system prompt. Claude sees the user's full financial picture and responds conversationally with specific, data-grounded advice.

The prompt engineering is modular. A PromptSectionBuilder class provides reusable section builders for different types of financial context — subscription patterns, budget progress, spending summaries, goal tracking. These sections are composed into full prompts depending on the feature: chat uses the broadest context, daily insights use a focused subset, and month-end reviews use specialized narrative prompts. This pattern makes it easy to add new AI features without rewriting prompt construction from scratch.

### Month-End Review

The most architecturally complex AI feature is the three-act month-end review. Act 1 ("The Truth") presents an AI-narrated story of the user's month — Claude receives spending data, budget comparisons, merchant analytics, and trends, then narrates them as a coherent financial narrative. Act 2 ("The Reflection") asks probing questions based on the data, prompting the user to reflect on their spending patterns and financial goals. Act 3 handles budget planning for the next month. The system is orchestrated across three backend services with an append-only conversation model where entries are never deleted, only superseded — preserving the full history of the review experience.

### Automated Insights

The system generates daily, weekly, and monthly AI insights automatically. Each insight type has a dedicated context builder and prompt template. Insights are cached in the database to avoid redundant LLM calls, with a rate limit of one manual refresh per day per user.

### Cost Optimization

AI cost management was a first-class design concern. The system uses Anthropic's native prompt caching, which reduces input token costs by 90% on repeated system prompts — from $3.00 per million tokens to $0.30 per million tokens. For a consumer app where the same financial coaching system prompt is reused across every conversation turn, this is a significant cost optimization. Token usage, cache hit rates, and per-call costs are tracked through Langfuse, giving full visibility into AI spending.

## ML Pipeline

Transaction classification uses scikit-learn Random Forest models rather than deep learning. There are two classification tasks: transaction type (Spending, Income, Payment, Transfer) and budget category (Groceries, Rent, Entertainment, and approximately 20 others). Franklin chose Random Forest deliberately — for the data volume involved, training completes in seconds, inference is instant, and the model can be retrained as users manually classify more transactions. A transformer-based approach would be overkill.

The ClassificationOrchestrator manages the full pipeline: feature extraction from transaction metadata, model training from labeled data, inference on new transactions, and confidence scoring. When the model encounters transactions it's uncertain about, users can manually classify them, and those corrections feed back into the next training cycle. The system ships with a fallback dataset of 1,079 pre-labeled transactions for production environments that don't yet have enough user-classified data.

## Database Design

The schema includes 25+ tables across a relational model designed for financial data. Transactions are the core entity, linking to accounts, institutions, users, and Plaid items. The schema supports transaction splitting (parent/child self-references), cross-date duplicate detection (with auto-hide for high-confidence matches), budget allocations by category and month, sinking funds with contribution tracking, weekly plans and reflections, chat sessions with derived financial goals, subscription pattern detection, and trip/event tagging through a many-to-many junction table.

Two schema decisions are particularly notable. First, the database uses field-level AES-256-GCM encryption for sensitive transaction data — description, merchant name, and amount are encrypted with user-specific keys derived from passwords, ensuring that even the developer cannot read user financial data at rest. Second, the chat goals system has an unusually rich data model with 40+ fields including budget linkage, verification tracking, reallocation fields, and a two-dimension goal system, reflecting the complexity of translating conversational financial commitments into trackable, actionable items.

PostgreSQL's schema-based multi-tenancy enables clean environment isolation. Production data lives in the public schema, demo personas each get their own schema, and tests run in an isolated test schema — all within the same database instance.

## Observability

Every LLM call flows through Langfuse with structured tracing that captures user ID, feature type (chat, insight, review), status, latency, and token counts. Prompt versions are tracked in the database with performance notes, enabling A/B testing of different prompt strategies and regression detection when prompts change. The ObservabilityService falls back gracefully to local logging if Langfuse is unavailable, ensuring the app doesn't break if the observability layer has issues.

This infrastructure means Franklin can answer questions like "what's the average latency of Buddy chat responses?", "how much are we spending on AI per user per month?", "did the last prompt change improve response quality?", and "which features generate the most LLM calls?" — the kind of production AI monitoring that most personal projects skip entirely.

## Testing and CI/CD

The project has approximately 430 automated tests: 86 frontend integration tests using Vitest and React Testing Library, 274 backend unit tests, 40 backend integration tests using testcontainers with real PostgreSQL instances, and 30 end-to-end tests using Playwright on Chromium. The CI/CD pipeline runs on GitHub Actions with a matrix strategy testing across Node 18/20/22 and Python 3.11/3.12, plus linting with black, isort, flake8, and ESLint. The main branch requires all checks to pass before merging.

Database migrations use Alembic with idempotent patterns — every migration checks for column and table existence before making changes, preventing failures on fresh databases or re-runs. The Railway deployment runs Alembic migrations as a pre-deploy step, ensuring the database schema is always current before the new backend version starts serving traffic.

## Design Decisions and Tradeoffs

Franklin chose PostgreSQL over NoSQL because financial data is inherently relational and ACID compliance matters when tracking money. He chose FastAPI over Express because Python's data science ecosystem (scikit-learn, pandas, numpy) is critical for the ML pipeline, and keeping the API and ML code in the same language avoids a language boundary. He chose Supabase over Firebase because he needed a real relational database with standard PostgreSQL compatibility for SQLAlchemy and Alembic migrations. He chose Claude over GPT-4 because Claude provided better financial analysis capabilities and the prompt caching feature offered 90% cost savings — a significant factor for a consumer app.

He chose prompt caching over fine-tuning as the AI cost optimization strategy. A large, context-rich system prompt with Anthropic's native caching allows rapid iteration on prompts, uses the latest model capabilities, and costs far less than fine-tuning. This is a deliberate choice that reflects how Franklin thinks about AI product development: start with the simplest approach that works, measure its performance, and only add complexity when the data justifies it.

If rebuilding from scratch, Franklin would move to Next.js for better dev/prod parity (the current CRA setup with proxy middleware is fragile), add a proper task queue like Celery for async ML retraining, and use a lighter state management solution like Zustand instead of five React Context providers.

## Scaling Considerations

At 10,000 users, the current architecture would largely hold. Supabase's connection pooler handles concurrent connections, and the main bottleneck would be LLM API costs — requiring more aggressive caching, batch insight generation, and tiered API call limits.

At 100,000 users, the system would need Redis for caching AI insights and session data, Celery with Redis for async ML training and insight generation, read replicas for analytics queries, and cost optimization through model routing — using smaller, cheaper models for routine insights while reserving Claude Sonnet for interactive chat. Horizontal scaling with multiple Railway instances behind a load balancer would handle the traffic.

## What Franklin Learned

The hardest technical challenge was getting authentication cookies to work correctly across the development and production split. Cross-origin cookies between the React dev server and FastAPI backend required multiple iterations — from package.json proxy to http-proxy-middleware to Vercel API rewrites — with careful cookie configuration at each stage. This taught Franklin that the gap between "works locally" and "works in production" is often widest around authentication and session management.

The most valuable learning was building the AI observability infrastructure. Most developers integrate an LLM, see that it works, and ship it. Franklin built the measurement layer that answers whether it's working well, how much it costs, and whether changes improve or degrade quality. That discipline — treating AI features as systems that need monitoring, not magic boxes that just work — is what separates production AI products from demos.