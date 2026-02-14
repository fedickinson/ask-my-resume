# RAG Resume Assistant — Frontend V1 PRD (Revised)

**Three-Layer Progressive Disclosure Architecture**

| Field | Value |
|-------|-------|
| Product | Franklin's RAG Resume Assistant |
| Document | Frontend V1 PRD — Revised |
| Author | Franklin Dickinson |
| Created | February 13, 2026 |
| Revised | February 14, 2026 |
| Status | Draft — Pending Decision Confirmation |
| Depends On | Phase 2 RAG Infrastructure (backend API) for Layer 2 chat |

> **Note:** This document supersedes the initial Frontend V1 PRD. The core change is the addition of Layer 1 (inline breathing expansions) alongside the original chat transformation concept, creating a three-layer progressive disclosure system that serves both recruiters and hiring managers on the same page.

---

## 1. Product Vision

### 1.1 The One-Line Pitch

A resume that rewards curiosity at every level of engagement.

### 1.2 What This Is

The frontend for Franklin's RAG Resume Assistant — a single-page web application that presents as a clean, professional resume and progressively reveals deeper layers of interactivity. Recruiters who scan for 15 seconds get a great resume. Hiring managers who linger discover contextual depth. Technical evaluators who engage fully experience a dramatic transformation into an AI-powered conversational interface.

### 1.3 The Core Insight

Recruiters and hiring managers have fundamentally different goals when they visit the same page. A recruiter wants to scan quickly and assess basic fit. A hiring manager wants to evaluate depth, judgment, and technical thinking. Rather than choosing one audience over the other, the frontend serves both through progressive disclosure — each layer of interactivity is complete on its own and naturally leads to the next.

### 1.4 Why This Matters as a Portfolio Piece

The frontend itself demonstrates the skills Franklin is selling. The three-layer architecture shows product thinking (designing for multiple user types). The inline expansions show content strategy (knowing what information to surface when). The chat transformation shows technical execution (animations, streaming, API integration). And the overall concept shows taste — the experience is novel without being gimmicky.

---

## 2. The Three-Layer Model

The application uses a progressive disclosure architecture with three distinct layers. Each layer is self-contained — the resume is excellent without any interaction, enriched with the expansions, and transformative with the chat. A user who only experiences Layer 0 still received a complete, professional resume. A user who discovers Layer 1 got a better resume than anyone else's. A user who reaches Layer 2 experienced the full portfolio piece.

### 2.1 Layer 0: The Scannable Resume

**What It Is**

A clean, professional, single-column resume layout that mirrors the structure and content density of Franklin's traditional PDF resume. Education, Technical Skills, Experience (Meta, Civis Analytics, QuanticMind), and Projects — all rendered in HTML with excellent typography. If someone screenshots it or prints it, it looks like a polished resume.

**Who It Serves**

Recruiters who spend 15 seconds scanning. They look at the school (Cornell Tech, Dartmouth), the company names (Meta, Civis), the technical skills, and maybe one or two bullet points. Layer 0 gives them exactly what they expect, exactly where they expect it.

**Design Principles**

- Immediately recognizable as a resume — no unfamiliar layouts or interactions required
- Single centered column, max-width 700px, generous vertical rhythm
- Clean sans-serif typography (Inter or system font stack)
- Black text on white background with one accent color used sparingly
- No header/nav/footer chrome — the resume IS the page
- Complete and excellent standalone — never feels like something is missing

**Resume Sections (in order)**

The resume content mirrors the uploaded PDF resume structure:

1. **Header** — Name, location, phone, email, LinkedIn
2. **Education** — Cornell Tech MEng (CS, AI Certificate, May 2026) and Dartmouth BA
3. **Technical Skills** — ML/AI, Languages, Tools, Data
4. **Professional Experience** — Meta (Mar 2022–May 2025), Civis Analytics (Aug 2018–Mar 2021), QuanticMind (Oct 2016–Mar 2018)
5. **Projects** — Budget Buddy, RAG Resume Assistant, Startup Studio

Each section uses the same content as the PDF resume — the same bullet points, the same structure. Layer 0 is not a redesign of the resume; it's a faithful rendering in HTML that happens to be interactive.

---

### 2.2 Layer 1: The Resume Breathes

**What It Is**

Contextual inline expansions embedded within the resume. Each major section (Meta, Civis, QuanticMind, Education, Projects) has one or two subtle trigger questions positioned after the section's bullet points. When clicked, the section smoothly expands in place to reveal 2–3 sentences of richer narrative context — the kind of depth you'd share in an interview but can't fit on a one-page resume. The surrounding content animates down to make room, creating the sensation that the document is "breathing."

**Who It Serves**

Hiring managers who spend 30–90 seconds reviewing a candidate. They're past the initial screen and looking for signals of depth, judgment, and impact. The inline expansions give them richer context without requiring them to leave the resume or commit to a full conversation.

**Interaction Pattern**

- **Trigger:** A muted text line after a resume section's bullets, styled as a contextual question with a small chevron. Example: *"What was the real impact here? ›"* in lighter color and slightly smaller font than the resume body text.
- **Expansion:** On click, the section smoothly expands (400ms ease-out) to reveal a card with 2–3 sentences of narrative context. The card has a subtle background tint (very light gray or light accent wash) to visually distinguish it from the static resume content.
- **Collapse:** Clicking the trigger again (now showing *"‹ Less"*) or clicking a different section's trigger collapses the expansion. Only one expansion is open at a time to prevent visual clutter on a dense document.
- **Content:** Hardcoded for V1. Pre-written narrative text drawn from existing RAG content documents (meta-overview.md, experimentation-expertise.md, career-arc.md, cornell-tech.md). No API calls, no latency, no failure modes.

**Visual Affordances**

The trigger questions must be discoverable without disrupting the resume's visual cleanliness. The research points to a specific combination of cues that sits in the sweet spot between "hidden" and "obvious."

- **Muted color:** Trigger text in the accent color at 50–60% opacity, stepping up to full opacity on hover
- **Small chevron:** A right-pointing chevron (›) that rotates 90° downward when expanded. Research shows the chevron is the only icon that significantly outperforms no icon at signaling in-place expansion.
- **Hover background:** A subtle background tint on hover (e.g., `bg-blue-50/30`) that previews the expansion's visual treatment
- **Cursor change:** `cursor-pointer` on hover as a baseline interactivity signal
- **One-time hint animation (optional P2):** After 3–5 seconds of no interaction, one trigger briefly pulses to teach the interaction model without requiring instruction text

**Expansion Animation Spec**

The expansion uses Motion's `AnimatePresence` with staggered height and opacity timing to prevent text clipping during animation:

```
Enter:
  height: 0 → "auto"  (400ms, ease-out)
  opacity: 0 → 1      (250ms, ease-out, 150ms delay — text appears after container opens)

Exit:
  opacity: 1 → 0      (200ms, ease-out — text fades before container closes)
  height: "auto" → 0  (350ms, ease-out)
```

Sibling resume sections below the expansion are wrapped in `LayoutGroup` with the `layout` prop, so they animate smoothly downward using GPU-accelerated CSS transforms rather than jumping.

**Content Map**

Each expandable section needs a trigger question and 2–3 sentences of expansion content. Expansion text will be drafted from existing RAG content documents.

| Resume Section | Trigger Question | Expansion Topic |
|----------------|-----------------|-----------------|
| Meta — Campaigns & Sentiment | "How did you establish causality here?" | The dual-method causal inference approach: individual regression adjustment controlling for 6 confounding variables + market-level difference-in-differences natural experiment. Both converged on +18–28 pp lifts. |
| Meta — Surveys & Infrastructure | "What did you build from scratch?" | Building A/B testing infrastructure for Viewpoints from the ground up — Deltoid integration, data pipelines for logged-in and logged-out users, A/A tests for validation, then the onboarding experiment showing +2.9–3.7% funnel lifts. |
| Civis Analytics | "What was the actual scale?" | 20+ randomized survey experiments for national campaigns including presidential races. Used MRP modeling to estimate treatment effects across demographic subgroups too small to measure directly, translating aggregate results into actionable targeting insights. |
| QuanticMind | "How did this shape your career?" | First exposure to predictive modeling in a business context — lead scoring, sales forecasting, startup dynamics. The realization that data science was the path, leading to NYC Data Science Academy and then Civis. |
| Cornell Tech | "What's been most valuable?" | The AI for Engineers certificate completed in one semester, Trustworthy AI coursework on adversarial attacks and jailbreaking (building models AND breaking them), and the cross-disciplinary collaboration with MBA and engineering students. |
| Projects | "What's under the hood?" | Budget Buddy: Supabase PostgreSQL + FastAPI + Claude API with Plaid integration. The RAG Resume Assistant itself: pgvector, custom chunking, Langfuse observability. Startup Studio: AI-powered product in the digital marketing space. |

---

### 2.3 Layer 2: The Full Transformation

**What It Is**

The dramatic transformation from resume to conversational AI chat interface. The resume view morphs into a chat view using shared element transitions — the name in the header animates to become the chat title, the resume body contracts and gives way to a message list, and a chat input slides up from below. The transformation is the signature portfolio piece moment.

**Who It Serves**

Hiring managers and engineering evaluators who want to explore Franklin's background in depth. They've already decided to spend time here — the chat gives them an interactive, personalized way to dig into whatever interests them most.

**Entry Points**

Two primary CTAs trigger the transformation, plus a contextual bridge from Layer 1:

- **Hero CTA:** Positioned in the header area, directly below the name and contact info, above the resume body. A single line of muted but noticeable text: *"or ask me anything →"*. This catches the hiring manager scanning from the top without overwhelming the recruiter who's focused on the resume content below.
- **Bottom CTA:** Positioned after the last resume section. Styled as an invitation: *"Want to know more? Ask me anything."* This catches users whose curiosity grew during reading.
- **Contextual bridge from Layer 1:** After a user has opened 2–3 Layer 1 expansions, the expansion card includes a subtle link: *"Want to go deeper? Start a conversation →"*. This creates a natural funnel from Layer 1 to Layer 2.

**Transformation Spec (~800ms total)**

The animation uses Motion's `layoutId` prop for shared element transitions.

- **Phase 1 — Exit (0–400ms):** Resume body content fades out. Any open Layer 1 expansion collapses instantly. Container begins contracting vertically.
- **Phase 2 — Morph (200–600ms):** Name/title animates from resume header position to chat header position via shared `layoutId`. Container reshapes from resume proportions to chat proportions.
- **Phase 3 — Enter (400–800ms):** Chat interface fades in. Input bar slides up from bottom. Suggested prompt chips stagger in with 50ms delay between each. Welcome message types in. Input field receives autofocus.

**Reverse Transformation**

A small text link in the chat header (*"← View Resume"*) triggers the reverse animation. Chat history is not preserved when returning to resume view — this is acceptable for V1. The conversation is exploratory, not persistent.

---

## 3. Target Users & Journey Map

| User | Time on Page | Primary Layer | What They Get |
|------|-------------|---------------|---------------|
| Recruiter | 10–20 seconds | Layer 0 only | A clean, professional resume. Same info as the PDF, better presentation. |
| Hiring Manager | 30–90 seconds | Layer 0 + Layer 1 | A resume with depth. Inline expansions give richer context on impact and decisions. |
| Technical Evaluator | 2–5 minutes | All three layers | The full experience. Expansions show depth; chat shows the portfolio piece. |
| Engineering Peer | 1–3 minutes | Layer 0 + Layer 2 | Skips expansions, goes straight to chat via hero CTA. Explores technical depth conversationally. |
| Fellow Job Seeker | 1–2 minutes | All three layers | Curious about how it's built. May share if the experience is genuinely novel. |

The critical insight is that every user gets a complete, satisfying experience at their level of engagement. The recruiter who bounces after 15 seconds got a great resume. The hiring manager who clicks two expansions got a richer picture than any other candidate provides. The evaluator who enters the chat experienced the full portfolio piece. No user needs to discover all three layers for the product to succeed.

---

## 4. Chat View Specification (Layer 2)

### 4.1 Layout

The chat view occupies the full page after transformation. Three components: a chat header (name carried over via shared `layoutId`, plus "← View Resume" back link), a scrollable message area, and a sticky input bar at the bottom of the chat container (using `position: sticky`, not `fixed` — avoids iOS Safari viewport issues).

### 4.2 Message Styling

| Element | Style |
|---------|-------|
| Bot messages | Left-aligned, light gray bubble (`#F3F4F6`), 12px border-radius |
| User messages | Right-aligned, accent-colored bubble, white text |
| Max message width | 75–80% of container |
| Message spacing | 12px between messages, 20px between conversation turns |
| Bot avatar | 32px circle with initials "FD" — not a photo |
| Timestamps | None in V1 |

### 4.3 Welcome Message

> "Hey! I'm an AI assistant Franklin built to help you learn about his background, projects, and experience. The fact that this works is part of the resume. Ask me anything — or pick a topic below."

### 4.4 Suggested Prompts

Displayed as clickable chips below the welcome message. Disappear after first user interaction, replaced by 2–3 follow-up suggestion chips after each bot response.

**Initial prompts (4):**
- "Walk me through your career"
- "What have you built with AI?"
- "Why AI Product Engineering?"
- "Tell me about your Meta experience"

**Follow-up suggestions:** Contextual to the previous answer. Hardcoded per topic area for V1.

### 4.5 Streaming & Loading States

| State | UI Behavior |
|-------|-------------|
| User sends message | Message appears instantly in right-aligned accent bubble |
| Waiting for API | Typing indicator (3 bouncing dots) in bot bubble position, shown after 600ms delay |
| Streaming response | Text appears progressively, auto-scrolls to keep latest content visible |
| Stream complete | Follow-up suggestion chips fade in below response |
| API error | Error message in bot bubble: "I'm having trouble connecting. Want to try again?" with retry button |

### 4.6 Input Bar

- Sticky at bottom of chat container (`position: sticky`, not `fixed`)
- Single-line text input that expands to multi-line (max 3 lines)
- Placeholder: *"Ask me about Franklin's experience..."*
- Send button (arrow icon) appears only when input has content
- Submit on Enter; Shift+Enter for newline
- Disabled state while response is streaming

---

## 5. Design System

### 5.1 Accent Color

One accent color used in exactly 5–6 places: the hero CTA, Layer 1 trigger text, user chat bubbles, send button, suggested prompt chip borders, and link text in chat responses. Recommended color: **#3B82F6 (Tailwind blue-500)** — professional, accessible (4.5:1 contrast on white), and distinct from body text.

The Nano Banana neon palette is reserved for study materials, not the portfolio piece. This needs to look like a product, not a student project.

### 5.2 Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Resume name | 28–32px | 700 (Bold) | Navy `#1B2A4A` |
| Resume section headers | 18–20px | 600 (Semibold) | Navy |
| Resume body text | 15–16px | 400 (Regular) | Dark gray `#374151` |
| Layer 1 trigger text | 13–14px | 500 (Medium) | Accent at 50–60% opacity |
| Layer 1 expansion text | 14–15px | 400 (Regular) | Dark gray |
| Chat messages | 15px | 400 (Regular) | Dark gray |
| Chat header | 18px | 600 (Semibold) | Navy |
| Input placeholder | 15px | 400 (Regular) | Medium gray `#6B7280` |
| Suggested prompt chips | 14px | 500 (Medium) | Accent |

**Font:** Inter (loaded via `next/font`) with system font stack fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### 5.3 Spacing & Radius

All spacing uses Tailwind's scale — never eyball margins. Primary gaps: `4px` (icon padding), `8px` (chip padding, small gaps), `12px` (message spacing), `16px` (section padding), `24px` (section gaps), `32px` (major breaks), `48px` (page top/bottom).

Border radius: `rounded-xl` (12px) for cards, expansion cards, and chat bubbles. `rounded-full` for avatars and pills. One value everywhere — consistency is more important than variety.

### 5.4 Shadows & Backgrounds

- **Resume container:** `shadow-sm` (subtle paper effect on white)
- **Layer 1 expansion cards:** `bg-slate-50` or `bg-blue-50/20` with no shadow — should feel like part of the document, not floating above it
- **Chat input bar:** `shadow-md` (slight elevation to separate from messages)
- No other shadows. Restraint is the design.

---

## 6. Responsive Design

| Breakpoint | Layout | Layer 1 | Layer 2 |
|------------|--------|---------|---------|
| Desktop (>768px) | Centered column, max-width 700px, full animation | Full inline expansion with smooth push-down | Full shared-element transformation |
| Tablet (768px) | Same layout, reduced padding | Same behavior | Same behavior |
| Mobile (<640px) | Full-width with 16px padding | Expansion works but chevron trigger is larger touch target (44px min) | Quick crossfade instead of complex morph (performance) |

**Mobile-Specific Notes:**
- Chat input uses `position: sticky` (not `fixed`) to avoid iOS Safari viewport bugs
- Test with `dvh` units for viewport height on iOS
- Suggested prompt chips wrap to 2 rows if needed
- Layer 1 trigger touch targets must be at least 44px tall (WCAG)
- Test on real iPhone Safari and Android Chrome before shipping

---

## 7. Technical Architecture

### 7.1 Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14+ (App Router) | SSR for resume SEO, API routes for backend proxy, Vercel deployment |
| Styling | Tailwind CSS | Rapid iteration, consistent spacing, responsive utilities |
| UI Components | shadcn/ui | High-quality primitives (Collapsible, Button, Input) that are fully customizable |
| Animations | Motion (Framer Motion) | `layoutId` for shared element transitions, `AnimatePresence` for enter/exit, `height: "auto"` animation for Layer 1 |
| Chat State | Vercel AI SDK (`useChat`) | Handles streaming, message state, loading states, retries |
| Chat UI | Custom components on shadcn | Full creative control over the chat experience |
| Deployment | Vercel | Zero-config Next.js hosting, edge functions |

### 7.2 Project Structure

```
rag-resume-frontend/
├─ app/
│  ├─ layout.tsx                # Root layout, fonts, metadata
│  ├─ page.tsx                  # Main page — view state (resume|chat)
│  └─ api/chat/route.ts        # API route — Claude proxy
├─ components/
│  ├─ resume/
│  │  ├─ ResumeView.tsx         # Full resume layout + Layer 0
│  │  ├─ ResumeHeader.tsx       # Name + contact (shared layoutId)
│  │  ├─ ResumeSection.tsx      # Section with optional expansion
│  │  ├─ ExpandableTrigger.tsx  # Muted question + chevron
│  │  ├─ ExpansionCard.tsx      # The breathing expansion content
│  │  ├─ HeroCTA.tsx            # "or ask me anything →"
│  │  └─ BottomCTA.tsx          # End-of-resume invitation
│  ├─ chat/
│  │  ├─ ChatView.tsx           # Container + message list
│  │  ├─ ChatHeader.tsx         # Header with back link (shared layoutId)
│  │  ├─ ChatMessage.tsx        # Individual message bubble
│  │  ├─ ChatInput.tsx          # Input bar + send button
│  │  ├─ TypingIndicator.tsx
│  │  └─ SuggestedPrompts.tsx
│  └─ shared/
│     └─ ViewTransition.tsx     # AnimatePresence + layoutId orchestration
├─ data/
│  ├─ resume-content.ts         # Static resume data (Layer 0)
│  └─ expansion-content.ts      # Expansion text per section (Layer 1)
├─ lib/
│  ├─ constants.ts              # System prompt, config, theme tokens
│  └─ types.ts                  # TypeScript interfaces
└─ public/
   └─ og-image.png              # Open Graph image for link sharing
```

### 7.3 API Strategy

For V1, the Next.js API route calls the Claude API directly with all resume content embedded in the system prompt. No RAG pipeline required — the content fits comfortably in Claude's context window. This decouples the frontend ship date from backend progress.

When the RAG infrastructure (Phase 2) is ready, the API route swaps to proxying requests to the Python/FastAPI backend. The frontend experience is identical either way — the user never knows the difference.

```
V1 flow:
  User message → Next.js API route → Claude API (system prompt has all resume content) → Streaming response

V2 flow (after RAG backend ships):
  User message → Next.js API route → FastAPI backend → Embedding + retrieval → Claude API → Streaming response
```

### 7.4 Data Model

Resume content and expansion content are stored as typed TypeScript objects in the `data/` directory:

```typescript
// data/resume-content.ts

interface ResumeData {
  name: string
  contact: { location: string; phone: string; email: string; linkedin: string }
  education: EducationEntry[]
  skills: SkillCategory[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
}

interface ExperienceEntry {
  id: string
  company: string
  title: string
  location: string
  period: string
  bullets: string[]
}
```

```typescript
// data/expansion-content.ts

interface ExpansionData {
  sectionId: string           // Maps to ExperienceEntry.id, EducationEntry.id, etc.
  trigger: string             // The question text, e.g., "How did you establish causality here?"
  content: string             // 2–3 sentences of narrative expansion
  bridgeToChatPrompt?: string // Optional: pre-filled chat question if they want to go deeper
}
```

```typescript
// lib/types.ts — View state

type ViewState = 'resume' | 'chat'

interface AppState {
  view: ViewState
  openExpansionId: string | null  // Only one expansion open at a time
  expansionCount: number          // Track how many expansions opened (for bridge CTA logic)
}
```

---

## 8. V1 Scope — What Ships, What Waits

### 8.1 Ships in V1

| Feature | Priority | Layer | Notes |
|---------|----------|-------|-------|
| Static resume with real content | P0 | 0 | Must look excellent standalone |
| Hero CTA in header area | P0 | 0→2 | Primary entry point to chat |
| Bottom CTA after last section | P0 | 0→2 | Secondary entry point |
| Inline expansion triggers (6 sections) | P0 | 1 | Muted question + chevron per section |
| Hardcoded expansion content | P0 | 1 | Pre-written from RAG content docs |
| Smooth expand/collapse animation | P0 | 1 | Motion `height: "auto"` + `LayoutGroup` |
| One-expansion-at-a-time behavior | P1 | 1 | Prevents visual clutter |
| Resume → Chat transformation | P0 | 2 | The signature moment |
| Chat → Resume reverse transition | P1 | 2 | "← View Resume" link in chat header |
| Streaming chat with Claude | P0 | 2 | Vercel AI SDK + `useChat` |
| Typing indicator | P0 | 2 | 3 bouncing dots after 600ms delay |
| 4 initial suggested prompts | P0 | 2 | Clickable chips |
| Follow-up suggestion chips | P1 | 2 | Contextual, hardcoded per topic area |
| Mobile responsive layout | P1 | All | Simplified animations on mobile |
| `prefers-reduced-motion` support | P1 | All | Instant transitions, no animation |
| Open Graph meta tags | P1 | — | Clean link previews when shared |
| Error handling for API failures | P1 | 2 | Graceful degradation with retry |
| Vercel deployment | P0 | — | Must be live and shareable |

### 8.2 Waits for V1.1 or Later

| Feature | Why Not V1 |
|---------|-----------|
| Transparency panel ("under the hood") | Needs RAG backend; add when Phase 4 is done |
| AI-generated expansion content | Adds latency and failure modes; hardcoded is better for V1 |
| Chat history persistence | Complexity for minimal gain; fresh conversations are fine |
| Dark mode | Nice to have, not essential for job search timeline |
| PDF resume download button | Can add later with one component |
| Analytics / Langfuse integration | Backend concern; not blocking frontend |
| Sidenotes / margin annotations | Requires wider layout that breaks the resume feel |
| Multiple simultaneous expansions | Creates visual chaos on a dense document |
| Particle effects / Three.js | Overkill — the concept does the heavy lifting, not the effects |
| Custom domain | Vercel URL works initially |

---

## 9. Accessibility

Accessibility is non-negotiable. The resume must be usable by all visitors, including those using screen readers, keyboard navigation, or reduced-motion preferences.

### 9.1 Layer 1 Expansions

- Every expansion trigger uses a `<button>` element with `aria-expanded` and `aria-controls` attributes
- Expanded content has `role="region"` and `aria-labelledby` pointing back to the trigger
- shadcn/ui `Collapsible` handles most ARIA through Radix primitives
- Keyboard: Space and Enter toggle expansion; Escape collapses an open expansion
- Focus management: after expansion opens, focus remains on the trigger (not moved into content)

### 9.2 Layer 2 Chat

- Chat input is a standard `<textarea>` with proper `<label>` (visually hidden if needed)
- Bot messages use `role="log"` on the message container with `aria-live="polite"` for new messages
- Suggested prompt chips are `<button>` elements, not just styled `<div>`s
- Typing indicator has `aria-label="Franklin's assistant is thinking"` with `aria-live="polite"`

### 9.3 Reduced Motion

- `prefers-reduced-motion` query detected via Motion's `useReducedMotion()` hook
- When active: all animations become instant state changes (opacity: 0→1, no transforms)
- The transformation becomes a crossfade rather than a morph
- Expansion content appears without the push-down animation

### 9.4 Keyboard Navigation

- Full tab navigation through resume, triggers, CTAs, and chat
- Visible focus indicators (2px accent-colored ring) on all interactive elements
- Skip-to-content link for chat message area

---

## 10. Edge Cases & Error Handling

### 10.1 Layer 1 Edge Cases

| Scenario | Behavior |
|----------|----------|
| User clicks expansion trigger while another is open | Currently open expansion closes first (150ms), then new one opens |
| User clicks the same trigger while expansion is animating | Animation completes before toggling (debounce click during animation) |
| Expansion content is longer than expected on mobile | Content scrolls within the expansion card if it exceeds 200px |
| JavaScript disabled | Resume renders as static HTML (Layer 0 only) — no expansions, no chat. This is acceptable. |

### 10.2 Layer 2 Edge Cases

| Scenario | Behavior |
|----------|----------|
| API key missing or invalid | Show error message in bot bubble: "I'm having trouble connecting. Franklin's working on it — in the meantime, the resume above has everything you need." |
| Stream interrupted mid-response | Show partial response + "Something went wrong. Try again?" with retry button |
| User sends empty message | Send button is hidden/disabled when input is empty |
| User sends very long message (>1000 chars) | Truncate with a note: "I shortened your message to stay focused" |
| Rate limiting | After 20 messages in a session, show: "That's a lot of questions — Franklin would love to talk to you directly! Here's his email." |
| Offensive/irrelevant queries | System prompt handles graceful deflection. No client-side filtering needed for V1. |

### 10.3 Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint (resume) | < 1.5s |
| Time to Interactive | < 2.5s |
| Layer 1 expansion animation | 60fps, no frame drops |
| Layer 2 transformation animation | 60fps on desktop, 30fps acceptable on mobile |
| Chat first token latency | < 2s (dependent on Claude API) |
| Total JS bundle (gzipped) | < 100KB (excluding Motion lazy-loaded chunks) |

---

## 11. Open Design Decisions

These decisions should be confirmed before implementation begins. They're low-stakes individually but affect the overall feel.

| Decision | Options | Recommendation | Status |
|----------|---------|---------------|--------|
| Font | Inter (loaded) vs. system font stack | Inter — more polished, worth the 15KB | **Pending** |
| Accent color | Blue `#3B82F6` vs. Teal `#0D9488` | Blue — safer, more professional | **Pending** |
| Bot avatar | Initials "FD" vs. small icon vs. nothing | Initials "FD" in accent-colored circle | **Pending** |
| Follow-up prompts | Hardcoded per topic vs. LLM-generated | Hardcoded for V1 (faster, no extra API call) | **Decided — Hardcoded** |
| Hero CTA wording | "or ask me anything →" vs. "This resume is interactive" vs. "Skip the resume. Ask me anything." | "or ask me anything →" — confident, low-pressure | **Pending** |
| Layer 1 trigger tone | Curious questions ("How did you establish causality?") vs. neutral ("More detail ›") | Curious questions — mirrors what an interviewer would ask, more engaging | **Pending** |
| Expansion content authorship | Franklin drafts (interview prep value) vs. Claude drafts from content docs, Franklin refines | Franklin should decide based on time | **Pending** |
| Resume section ordering | Education first (matches PDF) vs. Experience first (prioritizes impact) | Education first (matches PDF for consistency) | **Pending** |

---

## 12. Implementation Plan

### Phase A: Scaffold + Resume View (Day 1)

**Goal:** Layer 0 is live on Vercel.

1. `npx create-next-app` with App Router, TypeScript, Tailwind
2. Install dependencies: `shadcn/ui`, `motion`, `@ai-sdk/anthropic`, `ai`
3. Set up `data/resume-content.ts` with all resume data from the PDF
4. Build `ResumeHeader`, `ResumeSection`, `ResumeView` components
5. Style to match the PDF resume's structure and density
6. Add `HeroCTA` and `BottomCTA` (visible but non-functional — just scroll or placeholder)
7. Deploy to Vercel
8. **Checkpoint:** Resume looks excellent at `your-app.vercel.app`. Printable. Professional.

### Phase B: Layer 1 Breathing (Day 1–2)

**Goal:** Inline expansions work with smooth animation.

1. Write expansion content for all 6 sections (in `data/expansion-content.ts`)
2. Build `ExpandableTrigger` component (muted text + chevron + hover states)
3. Build `ExpansionCard` component (subtle background, 2–3 sentences)
4. Integrate with `ResumeSection` — trigger appears after bullets, expansion pushes content down
5. Add Motion animation: `AnimatePresence` for enter/exit, `LayoutGroup` for sibling repositioning
6. Implement one-at-a-time logic (opening one closes the other)
7. Test on mobile — ensure 44px touch targets, clean animation
8. **Checkpoint:** Clicking triggers reveals depth. The resume breathes.

### Phase C: Chat View + Streaming (Day 2)

**Goal:** Chat works with streaming responses.

1. Build `ChatView`, `ChatMessage`, `ChatInput`, `TypingIndicator`, `SuggestedPrompts`
2. Set up `app/api/chat/route.ts` with Claude API proxy and system prompt
3. Wire up `useChat` from Vercel AI SDK
4. Test streaming, error handling, loading states
5. Style messages, input bar, suggested prompts
6. **Checkpoint:** Chat works end-to-end. You can have a conversation about Franklin.

### Phase D: The Transformation (Day 2–3)

**Goal:** The signature resume → chat morph is polished.

1. Build `ViewTransition` wrapper with `AnimatePresence` and `layoutId` on shared elements
2. Wire `HeroCTA` and `BottomCTA` to trigger view state change
3. Implement the three-phase animation sequence (exit → morph → enter)
4. Build reverse transition ("← View Resume" → chat → resume)
5. Add contextual bridge CTA in expansion cards (appears after 2+ expansions opened)
6. Test on desktop and mobile
7. **Checkpoint:** The transformation is smooth and impressive.

### Phase E: Polish + Ship (Day 3)

**Goal:** Production-ready.

1. Add `prefers-reduced-motion` support
2. Add Open Graph meta tags and `og-image.png`
3. Test on iPhone Safari, Android Chrome, desktop Firefox
4. Accessibility audit: keyboard navigation, screen reader, focus management
5. Performance check: Lighthouse score, bundle size, animation frame rate
6. Final deploy to Vercel
7. **Checkpoint:** Ready to share with real humans.

### Estimated Total: 2.5–3.5 focused days

This is slightly more than the original PRD's estimate due to the added Layer 1 work, but the expansion components are relatively simple — the animation is the only tricky part, and Motion handles the hard bits.

---

## 13. Success Metrics

How do we know this worked? Since there's no analytics in V1, success is qualitative:

- **A recruiter who visits sees a professional resume** — it doesn't look weird, broken, or gimmicky
- **A hiring manager who clicks an expansion says "oh, that's nice"** — the depth is genuinely useful, not a parlor trick
- **Someone who experiences the transformation wants to show another person** — the "aha" moment is real
- **Franklin can explain every design decision in an interview** — the product itself is interview prep
- **The experience runs smoothly on mobile** — no jank, no broken layouts, no dead interactions

For V1.1, consider adding: Vercel Analytics (page views, time on page), click tracking on Layer 1 triggers, chat message count per session, and Langfuse tracing for chat quality.

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Animation feels janky on low-end devices | Users bounce, bad impression | Use Motion's `LazyMotion` for tree-shaking; simplify to crossfade on mobile; test on real devices |
| Layer 1 triggers go unnoticed | Hiring managers miss the depth layer | Hero CTA is always visible; one-time hint animation; test with real users |
| Chat responses are slow or low quality | Bad portfolio impression | System prompt is carefully crafted; direct Claude API (no RAG overhead); test with common questions |
| Scope creep during implementation | Shipping delays | Stick to this PRD. If it's not in the scope table, it waits. |
| The three layers feel disjointed | Confusing UX | Consistent design language across all layers; test the full flow end-to-end before polishing details |
| Claude API costs during testing | Budget concern | Use Claude Haiku for development; switch to Sonnet for production |

---

## 15. Relationship to Broader Project

This frontend is Phase 5 of the RAG Resume Assistant project plan, brought forward because it can ship independently of the RAG backend. The project phases and their relationship:

| Phase | Status | Dependency |
|-------|--------|-----------|
| Phase 1: Content Curation | In progress (13 docs complete) | None |
| Phase 2: RAG Infrastructure | In progress (Alembic + Supabase) | None |
| Phase 3: System Prompt & Personality | Not started | Phase 1 content |
| Phase 4: Observability & Transparency | Not started | Phase 2 backend |
| **Phase 5: Frontend V1 (this PRD)** | **Ready to build** | **None for V1 (direct Claude API)** |
| Phase 6: Polish & Iterate | After V1 ships | V1 deployed |

The V1 frontend ships with a direct Claude API call. When Phase 2 (RAG infrastructure) is complete, the API route swaps to proxy through the FastAPI backend. When Phase 4 (observability) is complete, the transparency panel can be added as a V1.1 feature. The frontend is designed to evolve without requiring rewrites.

---

*This is a living document. Update as decisions are confirmed and implementation reveals new considerations.*

*Last updated: February 14, 2026*