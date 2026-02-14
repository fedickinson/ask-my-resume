# Franklin Dickinson - Interactive Resume

A three-layer progressive disclosure resume with AI-powered chat functionality.

## Features

- **Layer 0**: Traditional resume format with clean, scannable layout
- **Layer 1**: Inline expansions with smooth animations for deeper context
- **Layer 2**: AI chat interface powered by Claude Sonnet 4

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Vercel AI SDK + Claude API
- **Deployment**: Vercel

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Add your ANTHROPIC_API_KEY to .env.local
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Variant System

The resume supports multiple variants for different audiences:

- `/` - Default variant (general purpose)
- `/anthropic` - Anthropic-tailored variant (future)
- `/openai` - OpenAI-tailored variant (future)
- `/startup` - Startup-focused variant (future)

## Environment Variables

- `ANTHROPIC_API_KEY` - Required for chat functionality

## Deployment

Deploy to Vercel:

```bash
vercel
```

Configure environment variables in the Vercel dashboard.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── [[...variant]]/    # Catch-all route for variants
│   ├── api/chat/          # Chat API endpoint
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/
│   ├── resume/            # Resume view components
│   └── chat/              # Chat view components
├── data/variants/         # Variant configurations
│   ├── base.ts           # Complete content library
│   ├── default.ts        # Default variant
│   └── index.ts          # Variant registry
└── lib/
    ├── types.ts          # TypeScript types
    └── constants.ts      # System prompt & constants
```

## Adding New Variants

1. Create new variant file: `data/variants/company-name.ts`
2. Define variant configuration (which bullets, expansions, chat prompts)
3. Register in `data/variants/index.ts`
4. Access via `/company-name`

No code changes required - variants are purely data-driven.
