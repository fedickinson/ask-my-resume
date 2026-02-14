# Frontend V1 Implementation Plan
## RAG Resume Assistant - Three-Layer Progressive Disclosure

---

## Context

**Why this change is needed:**

Franklin needs an interactive resume that demonstrates his AI Product Engineering skills while serving multiple audiences. Traditional resumes force a choice between recruiter-friendly brevity and hiring-manager-friendly depth. This frontend solves that through progressive disclosure: a clean scannable resume (Layer 0) that reveals contextual depth through inline expansions (Layer 1) and transforms into a conversational AI chat interface (Layer 2). The experience itself is the portfolio piece.

**Current state:**
- Backend (FastAPI + RAG) is fully operational with `/query` endpoint ready
- Frontend directory (`/frontend`) is empty - NO existing code
- 25+ markdown files in `/content` with comprehensive resume material
- PRD at `/docs/frontend/v1_prd.md` specifies complete architecture

**The opportunity:**
V1 can ship immediately using Claude API directly (no RAG dependency), then migrate to the FastAPI backend once content ingestion (Phase 3) completes. This decouples shipping from backend work.

---

## Implementation Approach

### Technology Stack

- **Framework:** Next.js 14+ (App Router) - SSR for SEO, API routes, Vercel deployment
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** Framer Motion - shared element transitions, AnimatePresence
- **Chat:** Vercel AI SDK (`useChat`) - streaming, message state
- **AI:** Direct Claude API (V1) → proxy to FastAPI backend (V2)
- **Deployment:** Vercel
- **Domain:** `franklindickinson.com` (acquire before sending resumes)

### Variant Architecture (Critical)

**The Problem:** Franklin sends different PDF resumes to different companies, each emphasizing different aspects of his background. The interactive web resume must match whichever PDF the recipient received.

**The Solution:** A data-driven variant system where all resume content lives in typed data files, and URL route parameters select which variant to render.

**URL Structure:**
```
franklindickinson.com                → Default / general-purpose resume
franklindickinson.com/anthropic      → Anthropic-tailored variant
franklindickinson.com/openai         → OpenAI-tailored variant
franklindickinson.com/startup        → Early-stage startup variant
```

On the PDF resume, the contact line includes the variant-specific URL. No explanation needed — it looks like a normal portfolio URL.

**What Varies Per Variant:**

Components, layout, and animations are identical. Only the content layer differs:

| Content Layer | What Can Vary | Example |
|--------------|---------------|---------|
| Resume bullets (Layer 0) | Which bullets appear, ordering, minor wording | Anthropic leads with BERT/ML bullet; startup leads with experimentation infrastructure |
| Section ordering (Layer 0) | Which sections appear first | Startup puts Projects above Experience |
| Expansion triggers (Layer 1) | Question text and expansion content | Anthropic: "How do you think about AI safety?" → emphasizes Trustworthy AI |
| Suggested prompts (Layer 2) | Initial 4 prompts + follow-ups | Anthropic: "How do you think about responsible AI development?" |
| Chat system prompt (Layer 2) | Tone and emphasis | Anthropic variant emphasizes safety; startup emphasizes speed |

**Data Model:**
```typescript
// data/variants/base.ts — Complete content library
export const baseResume: ResumeData = {
  name: "Franklin Dickinson",
  contact: { /* ... */ },
  education: [ /* all entries */ ],
  skills: [ /* all categories */ ],
  experience: [ /* all entries with ALL bullets */ ],
  projects: [ /* all entries */ ],
}

export const baseExpansions: ExpansionData[] = [
  // All possible expansions across all variants
]

// data/variants/anthropic.ts — Anthropic-specific config
export const anthropicVariant: ResumeVariant = {
  slug: 'anthropic',
  label: 'AI Safety & Product Engineering',

  // Which bullets to show and in what order
  experience: {
    'meta-campaigns': {
      bullets: ['bert-model', 'sentiment-causal', 'ad-targeting'], // IDs from base
    },
  },

  // Expansion overrides
  expansions: {
    'cornell-tech': {
      trigger: "What did you learn about AI safety?",
      content: "Trustworthy AI course covered adversarial attacks, jailbreaking...",
    },
  },

  // Chat customization
  chat: {
    suggestedPrompts: [
      "How do you think about responsible AI development?",
      "Walk me through your career",
    ],
    systemPromptAddendum: "Highlight Trustworthy AI coursework when relevant...",
  },
}
```

**Routing (Next.js):**
```typescript
// app/[[...variant]]/page.tsx — Optional catch-all route
//   franklindickinson.com        → variant = undefined → default
//   franklindickinson.com/anthropic → variant = ['anthropic'] → anthropic config
```

**V1 Scope:** Build the variant data model from day one (so no refactoring later), but only populate ONE variant initially. Add company-specific variants as you start sending applications — each new variant is just a new data file, no code changes required.

**Privacy:** Variant slugs are not secret. If someone types `/anthropic` manually, they see a slightly different emphasis — still professional and accurate. No risk, just mild awkwardness that's extremely unlikely.

**On the PDF:** Each tailored PDF includes the variant-specific URL:
```
New York, NY | 917-723-3921 | franklin.e.dickinson@gmail.com
linkedin.com/in/franklindickinson | franklindickinson.com/anthropic
```

### Layer 0 Formatting Spec — Matching the Standard Resume

**Critical Design Constraint:** The HTML resume must faithfully reproduce the conventions of Franklin's standard PDF resume. This is deliberate, not a limitation. The traditional format makes the interactive layers feel surprising and impressive. If a recruiter puts the PDF and website side by side, they should see the same document.

**Header:**
- Name centered, bold, largest text (18-20pt equivalent)
- Contact info on one line, centered, pipe-separated: `New York, NY | 917-723-3921 | franklin.e.dickinson@gmail.com | linkedin.com/in/franklindickinson | franklindickinson.com/anthropic`
- Hero CTA ("or ask me anything →") on its own line below, accent color at reduced opacity

**Section Headers:**
- ALL CAPS, bold, with thin horizontal rule underneath
- Standard convention: `EDUCATION`, `TECHNICAL SKILLS`, `PROFESSIONAL EXPERIENCE`, `PROJECTS`

**Education Entries:**
- Institution name bold (left), location right-aligned (same line)
- Degree + certificate (left), graduation date right-aligned (next line)
- Relevant coursework as single line of regular-weight text

**Experience Entries:**
- Company name bold + title (left), dates right-aligned (same line)
- Location right-aligned (next line or same line if space)
- Bullet points with standard bullet character (•), dense single-spacing
- Action-verb-first phrasing matching PDF exactly
- Layer 1 trigger question after last bullet, before next section (lighter, smaller)

**Technical Skills:**
- Category labels bold (`ML/AI:`, `Languages:`, `Tools:`, `Data:`)
- Comma-separated lists following each label
- Single section, no sub-groupings

**Typography Rules:**
- **No color in resume body** — black on white only
- Accent color only in: hero CTA, Layer 1 triggers, website URL
- No icons, badges, skill bars, progress indicators
- No photos, no avatars in resume view
- Font size hierarchy: name largest, section headers medium, body standard (13-20px range)

**Layout:**
- Single column, max-width 700px, centered
- Margins/padding approximate standard letter-page resume (0.75-1 inch margins)
- **Dense and information-rich** like a resume, not airy like a marketing site

**What This Explicitly Is NOT:**
- Not a portfolio site with cards, grids, or creative layouts
- Not a "modern resume template" with sidebars, icons, or color blocks
- Not a redesign — it's a rendering of the same resume in a new medium

**Key Principle:** If you squint, Layer 0 should be indistinguishable from a PDF rendered in a browser. The interactivity is hidden until someone engages. That's the magic trick.

**Future Variant (V2+):** A `/portfolio` variant could take a completely different approach to Layer 0 (designed layout, photo, narrative summary, project cards) for non-ATS contexts. Same Layer 1/2 components, different Layer 0 presentation. Not V1 scope.

---

### Three-Layer Architecture

**Layer 0: Scannable Resume**
- **Faithful HTML reproduction of the PDF resume format** - not a reinterpretation, the actual format
- Single-column, 700px max-width, traditional resume conventions
- Sections: Header, Education, Technical Skills, Experience (Meta, Civis, QuanticMind), Projects
- Same section order, same bullet text, same visual density as PDF
- **Design constraint:** The boring traditional format is the setup for the interactive payoff

**Layer 1: Breathing Resume (Inline Expansions)**
- 6 expandable sections with subtle trigger questions + chevron
- Smooth animations (Framer Motion AnimatePresence, LayoutGroup)
- Hardcoded 2-3 sentence narratives (no API calls, no latency)
- One expansion open at a time, surrounding content slides down
- Bridge CTA to chat after opening 2+ expansions

**Layer 2: Chat Transformation**
- Dramatic shared-element transition from resume to chat (800ms)
- Streaming responses with Claude API
- Welcome message + 4 suggested prompts
- Typing indicator, error handling, follow-up suggestions

---

## Implementation Phases

### Phase A: Scaffold + Resume View (Day 1)

**Goal:** Layer 0 is live on Vercel.

**Key Tasks:**
1. Create Next.js project in `/frontend`:
   ```bash
   cd /Users/franklindickinson/Projects/ask-my-resume
   npx create-next-app@latest frontend --typescript --tailwind --app
   cd frontend
   npm install framer-motion ai @ai-sdk/anthropic
   npx shadcn@latest init
   npx shadcn@latest add button input textarea collapsible
   ```

2. Create variant-aware data structure:
   ```typescript
   // data/variants/base.ts — Complete content library
   export const baseResume: ResumeData = {
     name: "Franklin Dickinson",
     contact: { /* ... */ },
     education: [ /* all entries */ ],
     skills: [ /* all categories */ ],
     experience: [ /* ALL bullets with unique IDs */ ],
     projects: [ /* all entries */ ],
   }

   // data/variants/default.ts — Default/general variant (V1 only)
   export const defaultVariant: ResumeVariant = {
     slug: 'default',
     experience: { /* select which bullets */ },
     expansions: { /* ... */ },
     chat: { /* ... */ },
   }

   // data/variants/index.ts — Variant registry
   export const variants: Record<string, ResumeVariant> = {
     'default': defaultVariant,
     // Future: 'anthropic', 'openai', 'startup', etc.
   }
   ```

3. Extract content from markdown files into `base.ts`:
   - Header/contact: `/content/practical/basics.md`
   - Education: `/content/education/cornell-tech.md` + `dartmouth.md`
   - Meta experience: `/content/experience/meta-overview.md` (ALL bullets with unique IDs)
   - Projects: `/content/projects/budget-buddy.md`
   - Career arc for Civis/QuanticMind: `/content/narrative/career-arc.md`
   - **Important:** Assign unique IDs to every bullet point (e.g., 'bert-model', 'sentiment-causal', 'experimentation-infra')

4. Build resume components matching PDF format exactly:
   - `ResumeHeader.tsx` - Centered name, pipe-separated contact line, hero CTA
   - `SectionHeader.tsx` - ALL CAPS + horizontal rule (reusable)
   - `EducationSection.tsx` - Institution (left), location (right), degree + dates, coursework
   - `SkillsSection.tsx` - Bold category labels, comma-separated lists
   - `ExperienceSection.tsx` - Company/title (left), dates (right), dense bullets, trigger question
   - `ProjectSection.tsx` - Same format as experience
   - `ResumeView.tsx` - Container orchestrating all sections
   - `HeroCTA.tsx` - "or ask me anything →" (in header, accent color)
   - `BottomCTA.tsx` - "Want to know more? Ask me anything." (after projects)
   - **Critical:** Compare rendered output to PDF side-by-side, match exactly

5. Configure `app/layout.tsx`:
   - Load Inter font via `next/font/google` (professional, worth 15KB)
   - Add metadata (title, description, Open Graph tags)
   - Set up Tailwind with custom colors (accent: `#3B82F6`)
   - **Critical:** Ensure global styles match PDF resume density and spacing

6. Set up routing for variants:
   ```typescript
   // app/[[...variant]]/page.tsx — Optional catch-all route
   export default function Page({ params }: { params: { variant?: string[] } }) {
     const variantSlug = params.variant?.[0] || 'default'
     const variant = variants[variantSlug] || variants['default']
     const resumeData = mergeVariantWithBase(baseResume, variant)

     return <ResumeView data={resumeData} variant={variant} />
   }
   ```

7. Acquire custom domain `franklindickinson.com`:
   - Purchase domain (Namecheap, Google Domains, etc.)
   - Configure DNS in Vercel dashboard
   - **Critical:** Do this before sending resumes with the link

8. Deploy to Vercel:
   ```bash
   vercel
   # Configure: root directory = frontend, build command = npm run build
   ```

**Acceptance Criteria:**
- Resume displays at `franklindickinson.com` (or `*.vercel.app` temporarily)
- **PDF side-by-side test passes:** Resume looks identical to PDF (same density, format, spacing)
- Default variant route works (`/` → default variant)
- Variant data model complete (even if only default populated)
- Section headers in ALL CAPS with horizontal rules
- Experience entries: company/title left, dates right, dense bullets
- Typography: black on white, no color except hero CTA/triggers/URL
- No icons, badges, or design flourishes
- Max-width 700px, centered, single column, dense spacing
- Print/screenshot looks like a traditional resume
- CTAs visible but non-functional (Phase D)
- Custom domain configured and working

---

### Phase B: Layer 1 Breathing (Day 1-2)

**Goal:** Inline expansions work with smooth animation.

**Key Tasks:**
1. Create expansion content (`data/expansion-content.ts`):
   ```typescript
   interface ExpansionData {
     sectionId: string
     trigger: string  // e.g., "How did you establish causality here?"
     content: string  // 2-3 sentences
     bridgeToChatPrompt?: string
   }
   ```

2. Map expansion content from markdown:
   - Meta (campaigns): `/content/experience/meta-projects-detail.md` lines 26-48
   - Meta (infrastructure): Same file, lines 55-75
   - Civis: PRD Section 2.2 table row 3
   - QuanticMind: `/content/narrative/career-arc.md` (QuanticMind section)
   - Cornell Tech: `/content/education/cornell-tech.md` (AI Certificate + Trustworthy AI)
   - Projects: `/content/projects/budget-buddy.md` (tech stack section)

3. Build expansion components:
   - `ExpandableTrigger.tsx` - Muted question text + chevron (› / ‹)
   - `ExpansionCard.tsx` - Subtle background card with AnimatePresence
   - Add to `ExperienceSection.tsx` and `ProjectSection.tsx`

4. Implement Motion animations:
   ```typescript
   // AnimatePresence timing from PRD Section 2.2
   Enter:
     height: 0 → "auto" (400ms, ease-out)
     opacity: 0 → 1 (250ms, ease-out, 150ms delay)
   Exit:
     opacity: 1 → 0 (200ms, ease-out)
     height: "auto" → 0 (350ms, ease-out)
   ```

5. Implement state management:
   - Track `openExpansionId: string | null` (one expansion at a time)
   - Track `expansionCount: number` (for bridge CTA logic)
   - Wrap sections in `LayoutGroup` for smooth push-down animation

6. Add accessibility:
   - ARIA attributes: `aria-expanded`, `aria-controls`, `role="region"`
   - Keyboard: Space/Enter to toggle, Escape to close
   - Minimum 44px touch targets on mobile

**Acceptance Criteria:**
- All 6 expansion triggers visible with subtle styling
- Hover states work (opacity 50% → 100%, background tint)
- Clicking trigger smoothly expands/collapses content
- Only one expansion open at a time
- Sibling sections animate down (no jumping)
- Bridge CTA appears after 2+ expansions: "Want to go deeper? Start a conversation →"
- Keyboard navigation works
- No text clipping during animation

---

### Phase C: Chat View + Streaming (Day 2)

**Goal:** Chat works with streaming responses.

**Key Tasks:**
1. Build chat components:
   - `ChatView.tsx` - Container with header, messages, input
   - `ChatHeader.tsx` - "Franklin Dickinson" + "← View Resume" link
   - `ChatMessage.tsx` - User/bot bubbles (right/left aligned)
   - `ChatInput.tsx` - Textarea + send button (sticky bottom)
   - `TypingIndicator.tsx` - 3 bouncing dots (600ms delay)
   - `SuggestedPrompts.tsx` - Clickable chips

2. Create API route (`app/api/chat/route.ts`):
   ```typescript
   import { streamText } from 'ai'
   import { anthropic } from '@ai-sdk/anthropic'

   export async function POST(req: Request) {
     const { messages } = await req.json()

     const result = await streamText({
       model: anthropic('claude-sonnet-4-20250514'),
       system: CHAT_SYSTEM_PROMPT, // Full resume content embedded
       messages,
       temperature: 0.7,
       maxTokens: 500,
     })

     return result.toDataStreamResponse()
   }
   ```

3. Create system prompt (`lib/constants.ts`):
   - Embed all resume content from `resume-content.ts`
   - Guidelines: grounded in specific examples, conversational, 2-4 paragraphs max
   - Extract narrative from `/content/narrative/career-arc.md`, `/content/narrative/why-ai-product-engineering.md`, `/content/ai-thinking/ai-safety-perspective.md`

4. Wire up `useChat()` in `ChatView.tsx`:
   - Display welcome message on mount
   - Show 4 initial prompts: "Walk me through your career", "What have you built with AI?", "Why AI Product Engineering?", "Tell me about your Meta experience"
   - Stream responses progressively
   - Show typing indicator (600ms delay)
   - Handle errors gracefully

5. Environment setup:
   - Create `.env.local` with `ANTHROPIC_API_KEY`
   - Add `.env.example` for documentation
   - Configure Vercel environment variable

**Acceptance Criteria:**
- Chat view renders correctly
- Welcome message displays
- Initial prompts clickable and send message
- Messages stream in progressively
- Typing indicator shows during response
- User messages right-aligned (accent color), bot messages left-aligned (gray)
- Input bar sticky at bottom, expands to 3 lines max
- Send button only visible when input has content
- Error states display: "I'm having trouble connecting. Want to try again?" + retry
- No CORS issues (same-origin API route)

---

### Phase D: The Transformation (Day 2-3)

**Goal:** Signature resume → chat morph is polished.

**Key Tasks:**
1. Add shared `layoutId` to headers:
   - `ResumeHeader.tsx`: `<motion.header layoutId="header">`
   - `ChatHeader.tsx`: `<motion.header layoutId="header">`

2. Wrap app in `AnimatePresence` (`app/page.tsx`):
   ```typescript
   const [view, setView] = useState<'resume' | 'chat'>('resume')

   <AnimatePresence mode="wait">
     {view === 'resume' ? (
       <motion.div key="resume" exit={{ opacity: 0, duration: 0.4 }}>
         <ResumeView onViewChange={() => setView('chat')} />
       </motion.div>
     ) : (
       <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1, delay: 0.4 }}>
         <ChatView onBackToResume={() => setView('resume')} />
       </motion.div>
     )}
   </AnimatePresence>
   ```

3. Wire CTAs to trigger transformation:
   - `HeroCTA.tsx` → `setView('chat')`
   - `BottomCTA.tsx` → `setView('chat')`
   - Bridge CTA in `ExpansionCard.tsx` → `setView('chat')` + pre-fill message

4. Implement three-phase animation (PRD Section 2.3):
   - Phase 1 (0-400ms): Resume fades out, expansions collapse
   - Phase 2 (200-600ms): Header morphs via `layoutId`
   - Phase 3 (400-800ms): Chat fades in, input slides up, prompts stagger

5. Mobile optimization:
   - Detect viewport width < 640px
   - Use simplified crossfade instead of complex morph (performance)
   - Ensure touch targets 44px minimum

6. Reverse transformation:
   - "← View Resume" link in `ChatHeader.tsx` → `setView('resume')`
   - Chat history NOT preserved (acceptable for V1)

**Acceptance Criteria:**
- Hero CTA triggers smooth transformation
- Bottom CTA triggers transformation
- Bridge CTA triggers transformation + pre-fills prompt
- Header element morphs smoothly between positions
- Resume content fades out cleanly (no flashing)
- Chat content fades in cleanly
- Animation runs at 60fps on desktop
- Mobile uses simplified animation (no jank)
- Reverse transformation works
- Any open expansion collapses during transition

---

### Phase E: Polish + Ship (Day 3)

**Goal:** Production-ready.

**Key Tasks:**
1. Add `prefers-reduced-motion` support:
   - Detect via `useReducedMotion()` hook from Framer Motion
   - When active: instant state changes (duration 0.01s)
   - Expansion becomes instant visibility toggle
   - Transformation becomes quick crossfade

2. Add Open Graph meta tags (`app/layout.tsx`):
   ```typescript
   export const metadata: Metadata = {
     title: 'Franklin Dickinson - AI Product Engineer',
     description: 'Interactive resume powered by AI. Ask me anything about my background, experience, and projects.',
     openGraph: {
       images: ['/og-image.png'],
     },
   }
   ```

3. Create OG image (`public/og-image.png`):
   - Dimensions: 1200 × 630px
   - Content: Name, tagline "AI Product Engineer", clean design
   - Tool: Figma, Canva, or screenshot of resume header

4. Cross-browser testing:
   - iPhone Safari: sticky input, viewport height (`dvh` units)
   - Android Chrome: touch targets, animations
   - Desktop Firefox: layout, animations
   - Desktop Chrome: primary browser

5. Accessibility audit:
   - Keyboard navigation: Tab through all elements, focus indicators visible
   - ARIA attributes: expansions, chat messages, typing indicator
   - Screen reader test: macOS VoiceOver (Cmd+F5)
   - Color contrast: Check with Chrome DevTools (WCAG AA)

6. Performance check:
   - Lighthouse audit: 90+ on Performance, Accessibility, Best Practices
   - Bundle size: `npm run build` → verify < 100KB gzipped
   - First Contentful Paint: < 1.5s
   - Animation frame rate: 60fps on desktop

7. Documentation:
   - Update project `README.md` with setup instructions
   - Document environment variables in `.env.example`
   - Add deployment instructions

8. Final deployment:
   - Push to main branch → Vercel auto-deploys
   - Test production URL in incognito
   - Share link on LinkedIn → verify OG image displays

**Acceptance Criteria:**
- Reduced motion preference disables all animations
- Open Graph tags correct, image displays in link previews
- All browsers tested (iPhone Safari, Android Chrome, desktop Firefox/Chrome)
- Keyboard navigation complete, focus indicators visible
- Screen reader announces content correctly
- Lighthouse score 90+ on all metrics
- Bundle size < 100KB gzipped
- Production deployment successful
- README documentation complete

---

## Integration Strategy: V1 vs V2

### V1 (Current Implementation - Ships First)

**Architecture:**
```
User → Next.js /api/chat → Claude API (direct) → Streaming response
```

**System Prompt:**
- Hardcoded in `/app/api/chat/route.ts`
- Full resume content embedded (~2000 tokens)
- Uses Anthropic's prompt caching (90% cost reduction)

**Advantages:**
- Ships immediately, no backend dependency
- Lower latency (one network hop)
- Simpler debugging

### V2 (Future - After Content Ingestion Complete)

**Architecture:**
```
User → Next.js /api/chat → FastAPI /query → RAG retrieval → Claude API
```

**Migration:**
1. Update `/app/api/chat/route.ts` to proxy to `https://backend.railway.app/query`
2. Convert response format for Vercel AI SDK
3. Optional: Add transparency panel showing retrieved sources

**When to migrate:** After Phase 3 (content ingestion) completes and backend supports streaming

---

## Critical Files to Reference

### For Resume Content (Layer 0):
1. **`/content/practical/basics.md`** - Contact, current status, work authorization
2. **`/content/experience/meta-overview.md`** - Meta experience (4 years, 12+ projects)
3. **`/content/education/cornell-tech.md`** - Cornell Tech details (GPA, AI Certificate, courses)
4. **`/content/education/dartmouth.md`** - Dartmouth background
5. **`/content/projects/budget-buddy.md`** - Most comprehensive project details
6. **`/content/narrative/career-arc.md`** - Civis and QuanticMind experience

### For Expansion Content (Layer 1):
1. **`/content/experience/meta-projects-detail.md`** - STAR narratives for Meta expansions
2. **`/content/education/cornell-tech.md`** - "What's been most valuable?" expansion
3. **`/content/projects/budget-buddy.md`** - "What's under the hood?" expansion
4. **PRD Section 2.2 table** - All 6 expansion trigger questions and content topics

### For System Prompt (Layer 2):
1. **`/content/narrative/career-arc.md`** - Career trajectory and transitions
2. **`/content/narrative/why-ai-product-engineering.md`** - Positioning narrative
3. **`/content/ai-thinking/ai-safety-perspective.md`** - Safety frameworks and thinking
4. **`/content/working-style/working-style.md`** - Collaboration approach

### For Reference:
1. **`/docs/frontend/v1_prd.md`** - Complete specification (authoritative source)

---

## Component Architecture

### Resume Components (`components/resume/`)
- `ResumeView.tsx` - Main container, manages expansion state
- `ResumeHeader.tsx` - Name + contact (layoutId for transformation)
- `EducationSection.tsx` - Cornell Tech, Dartmouth
- `SkillsSection.tsx` - ML/AI, Languages, Tools
- `ExperienceSection.tsx` - Job entries with bullets + expansion triggers
- `ProjectSection.tsx` - Project entries + expansion triggers
- `ExpandableTrigger.tsx` - Muted question + chevron, hover states
- `ExpansionCard.tsx` - AnimatePresence card with 2-3 sentences
- `HeroCTA.tsx` - "or ask me anything →"
- `BottomCTA.tsx` - "Want to know more? Ask me anything."

### Chat Components (`components/chat/`)
- `ChatView.tsx` - useChat hook, message list, welcome message
- `ChatHeader.tsx` - Title + back link (layoutId for transformation)
- `ChatMessage.tsx` - User/bot bubbles, avatar (initials "FD")
- `ChatInput.tsx` - Textarea, send button, sticky positioning
- `TypingIndicator.tsx` - 3 bouncing dots with delay
- `SuggestedPrompts.tsx` - Clickable chips (initial + follow-up)

### Data Files (`data/`)
- `variants/base.ts` - Complete content library (ALL bullets, expansions, content)
- `variants/default.ts` - Default variant configuration (which bullets to show)
- `variants/index.ts` - Variant registry
- **Future:** `variants/anthropic.ts`, `variants/openai.ts`, `variants/startup.ts`, etc.

### Utilities (`lib/`)
- `types.ts` - TypeScript interfaces (ViewState, ResumeData, etc.)
- `constants.ts` - System prompt, suggested prompts, color tokens
- `utils.ts` - Helper functions (cn, useReducedMotion)

---

## Testing & Verification

### After Each Phase:

**Phase A:**
- [ ] Resume renders correctly on desktop and mobile
- [ ] Typography matches PRD (Inter font, correct sizes)
- [ ] Print/screenshot looks professional
- [ ] Deployed to Vercel and accessible

**Phase B:**
- [ ] All 6 expansion triggers visible
- [ ] Expansions animate smoothly (no text clipping)
- [ ] Only one expansion open at a time
- [ ] Keyboard navigation works (Space/Enter/Escape)

**Phase C:**
- [ ] Chat displays welcome message + 4 prompts
- [ ] Messages stream in progressively
- [ ] Typing indicator shows after 600ms
- [ ] Error states display gracefully

**Phase D:**
- [ ] All CTAs trigger transformation (Hero, Bottom, Bridge)
- [ ] Header morphs smoothly via layoutId
- [ ] Animation runs at 60fps on desktop
- [ ] Mobile uses simplified animation

**Phase E:**
- [ ] Reduced motion works (instant transitions)
- [ ] Cross-browser tested (iPhone Safari, Android Chrome, Firefox)
- [ ] Lighthouse score 90+ on all metrics
- [ ] Production deployment successful

### End-to-End Test Scenarios:

1. **Recruiter flow (15 seconds):**
   - Visit page → see clean resume → scan sections → leave
   - Expected: Professional, scannable, no confusion

2. **Hiring manager flow (1 minute):**
   - Visit page → read resume → click 2-3 expansions → see depth → maybe click CTA
   - Expected: Impressed by inline context, smooth animations

3. **Technical evaluator flow (3 minutes):**
   - Visit page → click Hero CTA → ask technical questions → explore Meta projects → ask follow-ups
   - Expected: Engaged conversation, impressed by transformation

4. **Mobile user:**
   - Visit on iPhone → read resume → tap expansion → works smoothly → tap CTA → chat works
   - Expected: No jank, touch targets work, sticky input accessible

---

## Potential Issues & Mitigations

### 1. Animation Performance
- **Issue:** Jank on low-end devices
- **Mitigation:** LazyMotion tree-shaking, simplified mobile animations, `prefers-reduced-motion` support, real device testing

### 2. Layer 1 Discovery
- **Issue:** Users miss expansion triggers
- **Mitigation:** Hero CTA always visible at top, chevron icon (research-backed), subtle hover states, optional one-time pulse hint (P2)

### 3. iOS Safari Input Bar
- **Issue:** Keyboard hides sticky input
- **Mitigation:** Use `position: sticky` not `fixed`, test `dvh` viewport units, test on real iPhone

### 4. Content Extraction Accuracy
- **Issue:** Errors copying content from markdown
- **Mitigation:** Manual review with Franklin, TypeScript type checking, validation against source files

### 5. Claude API Costs
- **Issue:** Expensive during development
- **Mitigation:** Use Haiku for dev (`claude-haiku-20250513`), Sonnet for prod, enable prompt caching, mock responses in local dev

### 6. State Management Complexity
- **Issue:** View state, expansion state, chat state across components
- **Mitigation:** Keep state in `page.tsx`, pass as props, use React Context if needed, TypeScript for prop types

---

## Design Decisions (Confirm Before Starting)

| Decision | Recommendation | Impact |
|----------|----------------|--------|
| Font | Inter (loaded via Google Fonts) | 15KB bundle size, polish worth it |
| Accent color | Blue `#3B82F6` | Used for CTAs, triggers, user bubbles |
| Bot avatar | Initials "FD" in accent circle | Simple, professional |
| Hero CTA wording | "or ask me anything →" | Confident, low-pressure |
| Layer 1 trigger tone | Curious questions ("How did you...?") | More engaging than neutral |
| Expansion authorship | Franklin drafts | Better quality, doubles as interview prep |
| Section ordering | Education first | Matches PDF for consistency |

---

## Success Criteria (Qualitative for V1)

From PRD Section 13:

- [ ] A recruiter sees a professional resume (not weird, broken, or gimmicky)
- [ ] A hiring manager who clicks an expansion says "oh, that's nice" (genuinely useful depth)
- [ ] Someone who experiences the transformation wants to show another person (real "aha" moment)
- [ ] Franklin can explain every design decision in an interview (product itself is interview prep)
- [ ] The experience runs smoothly on mobile (no jank, no broken layouts)

**V1.1 Future Enhancements:**
- Vercel Analytics (page views, time on page)
- Click tracking on Layer 1 triggers
- Chat message count per session
- Langfuse integration for chat quality

---

## Timeline Estimate

**Total: 2.5-3.5 focused days**

| Phase | Time | Dependencies |
|-------|------|--------------|
| Phase A | 6-8 hours | None |
| Phase B | 8-10 hours | Phase A complete |
| Phase C | 6-8 hours | Phase A complete |
| Phase D | 6-8 hours | Phases A, B, C complete |
| Phase E | 4-6 hours | All phases complete |

**Critical path:** A → B → D → E
**Parallel work:** Phase C can overlap with Phase B (chat components independent of expansions)

---

## Next Steps

1. **Acquire custom domain** `franklindickinson.com` immediately (Namecheap, Google Domains, etc.)
2. **Confirm design decisions** (font, colors, CTA wording, expansion content authorship)
3. **Begin Phase A:**
   - Scaffold Next.js project with catch-all route `[[...variant]]`
   - Create variant data model (base.ts + default variant)
   - Extract all resume content with unique bullet IDs
   - Configure custom domain in Vercel
4. **Follow phases sequentially** (B → C → D → E), testing at each checkpoint
5. **Add company-specific variants** as needed (just new data files, no code changes)
6. **Share with real users** for qualitative feedback

The plan is executable without additional research. All file paths, component interfaces, and animation specs are defined. The three-layer progressive disclosure will serve recruiters (Layer 0), hiring managers (Layer 1), and technical evaluators (Layer 2) with a genuinely novel resume experience.
