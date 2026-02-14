# RAG Resume Assistant — Build Journal Entry

**Component:** [e.g., Chunking Pipeline / Embedding Pipeline / Retrieval / Generation]
**Date:** [YYYY-MM-DD]
**Session Goal:** [One sentence — what did you set out to build this session?]
**Status:** [Done / In Progress / Blocked]

---

## What I Built

[2-3 sentences describing what you actually shipped this session. Not what you planned — what you did.]

---

## Key Decisions & Why

| Decision | Options Considered | What I Chose | Why |
|----------|-------------------|--------------|-----|
| [e.g., Chunk size] | [Fixed 500 chars, paragraph-level, semantic] | [Paragraph-level] | [Maps to how content was written; preserves context better than fixed-size] |
| [e.g., Embedding model] | [text-embedding-3-small, 3-large, voyage-3] | [...] | [...] |
| | | | |

---

## Sanity Checks Performed

- [ ] **Printed sample output and read it** — Does it make sense as standalone text?
- [ ] **Checked row counts / data in Supabase** — Is what I expect actually stored?
- [ ] **Tested with a real query** — Does the obvious query return the obvious result?
- [ ] **Checked an edge case** — What happens with empty input / weird input / gibberish?

**Specific checks this session:**

| Check | Expected | Actual | Pass? |
|-------|----------|--------|-------|
| [e.g., "What did Franklin do at Meta?" retrieves meta-overview chunks] | [Top 3 are meta-overview] | [...] | [✅/❌] |
| | | | |

---

## What Broke / What I Fixed

[If nothing broke, write "Clean build." If something broke, describe it — these are interview stories.]

| Problem | Root Cause | Fix | Lesson |
|---------|-----------|-----|--------|
| [e.g., Chunks were missing context prefix] | [Frontmatter parsing stripped it] | [Added prefix after parse step] | [Always print intermediate output before piping to next step] |
| | | | |

---

## Numbers

[Concrete metrics — these become interview talking points.]

- Chunks created: [X]
- Avg chunk length: [X tokens / chars]
- Embedding cost: [$X.XX]
- Retrieval recall@5: [X% on sample queries]
- Response latency: [Xs end-to-end]
- [Any other relevant metric]

---

## What I Resisted Adding

[This is important — product engineers scope. What did you want to add but didn't?]

- [e.g., "Wanted to add metadata filtering to retrieval — not needed for MVP"]
- [e.g., "Thought about adding a reranker — saving for Phase 4"]

---

## Interview Soundbite

[Write one 30-second explanation of what you did and why, as if someone asked in an interview. Practice this out loud.]

> [e.g., "I built the chunking pipeline for my RAG system. The key decision was using paragraph-level chunking with context prefixes rather than fixed-size chunks, because my content was already written to be self-contained at the paragraph level. I prepend metadata like 'Franklin Dickinson — Meta Experience:' to each chunk so the embedding captures the topic even when the paragraph text is ambiguous on its own. I validated by checking that sample queries from my eval set retrieved the expected source documents."]

---

## Next Session

- [ ] [Specific next step 1]
- [ ] [Specific next step 2]
- [ ] [Specific next step 3]

---

## Coding Agent Prompt

Use this when starting the next session in Cursor / Claude Code:

```
I'm building a RAG-powered resume assistant. Here's where I left off:

**Last completed:** [component name]
**What's working:** [one line]
**Next up:** [component name from PRD]

Rules for this session:
1. Build the minimum that works. No extra features.
2. Print sample output at each step so I can sanity check before moving on.
3. When making a decision (model choice, threshold, architecture), state the options and recommend one with a reason.
4. If something breaks, explain the root cause before fixing it.
5. Don't refactor working code unless it blocks the next step.
6. Reference the Phase 2 PRD at docs/phase2-prd.md for specs.
```