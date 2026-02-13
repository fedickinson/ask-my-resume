---
category: "experience"
document: "meta-projects-detail"
title: "Franklin's Meta Projects — STAR Deep Dives"
summary: "Detailed STAR-format narratives of Franklin's strongest Meta projects, designed for behavioral interview questions about experimentation, causal inference, building from scratch, strategic recommendations, and debugging at scale"
chunk_strategy: "paragraph"
context_prefix: "Franklin Dickinson — Meta Project Deep Dive: "
sample_queries:
  - "Tell me about a time Franklin solved a hard problem"
  - "Give me an example of Franklin's analytical skills"
  - "Tell me about something Franklin built"
  - "Has Franklin ever had to make a recommendation with incomplete data?"
  - "Tell me about a time Franklin found a bug or caught an issue"
  - "What's Franklin's best project example?"
  - "Tell me about a time Franklin disagreed with a decision"
  - "How does Franklin approach ambiguous problems?"
  - "Give me an example of Franklin working cross-functionally"
  - "Tell me about a time Franklin had to influence a decision"
---

# Meta Projects — Deep Dives

These are Franklin's strongest project narratives from four years at Meta, structured for behavioral interview questions. Each follows the STAR format: Situation, Task, Action, Result.

## Project 1: Proving Marketing Campaigns Actually Work (Innovation Campaign Causal Inference)

### The Interview Question This Answers
"Tell me about a time you solved a complex analytical problem" or "Tell me about a time you challenged an assumption with data."

### Situation
Meta's Public Affairs team was running a national marketing campaign promoting its metaverse investments, spending significant budget on messaging designed to improve brand sentiment. Leadership was seeing positive survey results — people who recalled the messaging had significantly more favorable attitudes toward Meta. But there was a fundamental question no one had rigorously answered: was the campaign actually causing the attitude improvement, or were people who already liked Meta simply more likely to remember the ads?

This mattered because the difference between correlation and causation was the difference between "keep investing millions in this campaign" and "we're measuring a statistical mirage."

### Task
Franklin was asked to determine whether the Innovation Campaign was causally improving brand sentiment — and if so, by how much. The analysis needed to be rigorous enough to withstand scrutiny from both the marketing team (who wanted validation) and leadership (who wanted to know if the spend was justified).

### Action
Franklin designed a two-pronged causal inference approach that attacked the problem from different angles to build converging evidence.

The first approach was individual-level regression adjustment using national survey data spanning three waves from June through August 2022. The core challenge was two specific confounding mechanisms Franklin identified: negative attitude bias (people unfavorable to Meta would dismiss and not recall campaign messages, creating artificial correlation between recall and favorable attitudes) and interest alignment bias (tech-interested people would both recall tech-focused messages more easily and have independently more favorable attitudes toward Meta). Franklin controlled for demographics, political identification, Facebook-related news exposure, media market effects, survey timing, and tech-related interests to isolate the causal effect of message recall on downstream attitudes.

The second approach was a market-level natural experiment using difference-in-differences. The campaign was geo-targeted to specific media markets (Tier 1 HINE markets and DC Likely Voters), which created a natural experiment: Franklin compared changes in brand metrics before and after campaign launch in targeted markets versus comparable non-targeted control markets (Tier 2 HINE and Boston Likely Voters). This provided population-level evidence independent of the individual survey analysis.

### Result
Both approaches converged on the same conclusion: the campaign was working, but reach was the bottleneck. Individual-level analysis showed +18 to +28 percentage point lifts in metaverse attitudes and +15 to +24 percentage point lifts in brand health metrics after controlling for confounders. Market-level analysis showed a +6 percentage point increase in message recall in targeted markets, with consistent directional improvements in downstream attitudes. The market-level effects were smaller, which was expected — message penetration topped out at only 37% of users in targeted markets.

Franklin quantified the relationship: every percentage point increase in message recall drove approximately 0.4 percentage points of improvement in brand health sentiment. The strategic recommendation was to increase media investment to expand reach, not change the messaging. He also validated the funnel logic itself — confirming that message exposure caused attitude change rather than the reverse — and identified that simply increasing metaverse familiarity without campaign messaging did not improve attitudes toward Meta, which supported the strategy of emphasizing benefits over abstract education.

### Why This Matters
This project demonstrates Franklin's ability to think rigorously about causality, design complementary analytical approaches that build converging evidence, identify and control for specific confounding mechanisms, and translate methodological findings into clear strategic recommendations. The dual-method approach — individual regression adjustment plus market-level natural experiment — is the kind of analytical rigor that matters when building AI products where understanding "does this actually work" versus "does this just look like it works" is critical.

---

## Project 2: Building Experimentation Infrastructure From the Ground Up (Viewpoints A/B Testing)

### The Interview Question This Answers
"Tell me about a time you built something from scratch" or "Tell me about a time you had to create structure where none existed."

### Situation
When Franklin was reorged onto the Viewpoints team under Meta's Research Platform organization in early 2023, basic tracking existed but there was no real experimentation infrastructure. The team was making product decisions — changes to onboarding flows, UI modifications, feature launches — without the ability to rigorously test whether those changes were actually improving outcomes. They were flying blind.

### Task
Franklin needed to build a functioning experimentation system that would allow the team to run statistically valid A/B tests, measure their impact on user conversion and retention, and make data-driven product decisions. This wasn't just plugging in a tool — it required building the full stack from data pipelines to statistical validation.

### Action
Franklin built the experimentation system in layers. First, he set up Deltoid integration — Meta's internal A/B testing framework — configuring it for the Viewpoints product's specific requirements, including handling both logged-in and logged-out user states. Second, he built the data pipelines needed to feed experimentation metrics, creating tracking for user conversion events and retention signals that hadn't been instrumented before. Third, he ran A/A tests — experiments where both groups receive the identical experience — to verify that the infrastructure was correctly calibrated and wasn't introducing statistical bias through uneven user assignment or metric calculation errors.

Once the system was validated, Franklin designed and ran the team's first real A/B test: simplifying the onboarding flow from four screens to two. He defined the hypothesis, chose the metrics, calculated the required sample size, launched the experiment, and analyzed the results.

### Result
The experimentation infrastructure worked as designed, and the first A/B test delivered clear, actionable results. The simplified onboarding flow showed statistically significant improvements across every stage of the funnel: +2.9% increase in users reaching the first login page, +2.3% increase in account creation, and +3.7% increase in completing their first work unit. The fact that improvements were consistent and compounding across funnel stages — not just at the entry point — confirmed that reducing initial friction had downstream benefits on deeper engagement.

More importantly, Franklin established a repeatable process the team could use for future product decisions. The infrastructure he built became the foundation for all subsequent experimentation on the Viewpoints product.

### Why This Matters
This project shows Franklin can create systems, not just analyses. He identified a structural gap (no experimentation capability), built the solution (pipelines, framework integration, validation), and immediately used it to generate measurable product improvement. For an AI Product Engineer role, this is directly analogous to building evaluation infrastructure for LLM features — the same skills of instrumenting metrics, designing valid tests, and building repeatable processes apply.

---

## Project 3: Recommending Meta Stop Spending Money (Community Network Investment Strategy)

### The Interview Question This Answers
"Tell me about a time you made a difficult recommendation" or "Tell me about a time you had to deliver news stakeholders didn't want to hear."

### Situation
Meta's Public Affairs team had been exploring a Community Network program — an initiative to identify and recruit potential brand advocates using on-platform lead ads. Franklin co-led an experiment testing seven audience cohorts to assess feasibility. The experiment identified 1,486 potential advocates, with Facebook Creators emerging as the most promising segment at $141.15 per recruit (5x more responsive than the general population). The question now was: should Meta invest further?

### Task
Franklin needed to synthesize the experimental results, assess program viability, and make a recommendation to leadership — knowing that the team had invested significant time and political capital in the Community Network concept.

### Action
Franklin approached this as a product viability assessment, not just a data readout. The experimental results were technically positive — the approach worked and costs were quantifiable. But Franklin looked beyond the metrics to assess operational viability. He identified several structural problems: the program lacked a confirmed executive sponsor, there was no defined investment level or budget commitment, concrete program goals (beyond "recruit advocates") hadn't been established, and dedicated staffing to manage recruited advocates didn't exist. Additionally, unresolved privacy compliance issues remained from the experimental phase.

Rather than simply presenting numbers and letting leadership draw their own conclusions, Franklin framed the recommendation around a clear decision framework: here's what worked, here's what's missing, and here are the specific conditions that would need to be met before further investment would be justified.

### Result
Franklin contributed to a strategic recommendation presented to leadership in February 2023 to pause further investment in the Community Network program. The recommendation laid out explicit conditions for revisiting: confirmed sponsorship, defined investment levels, concrete program goals, and dedicated staffing. Leadership accepted the recommendation.

### Why This Matters
This project demonstrates Franklin's ability to make honest recommendations even when they're not what stakeholders want to hear, to think about product viability holistically (not just whether the metrics look good), and to frame difficult recommendations constructively. He didn't say "this failed" — he said "this isn't ready, and here's what would need to be true for it to be ready." That's product judgment, not just analytical skill.

---

## Project 4: Catching a Bug Nobody Else Saw (Viewpoints Verification Rate Drop)

### The Interview Question This Answers
"Tell me about a time you identified a problem before it became a crisis" or "Tell me about a time you showed attention to detail."

### Situation
Franklin was monitoring onboarding metrics for the Viewpoints product as part of his routine analytical work. During a review, he noticed something that didn't look right: SMS verification rates for users logging in via Facebook had dropped dramatically — from a stable range of 50-70% to as low as 12-15%. This wasn't flagged by any automated system. No one else had noticed it.

### Task
Franklin needed to determine whether this was a real issue or a data artifact, identify the scope and cause, and escalate appropriately if it was a genuine bug.

### Action
Franklin's investigation was systematic and methodical. He segmented data by login method, notification type, and user cohorts to isolate exactly who was affected. He cross-checked installation rates and notification click rates to rule out the possibility that the drop was simply caused by lower user volume. He identified that the issue was specific to new installations, which ruled out legacy user behavior changes. He correlated the timing of the drop with recent backend deployments to identify a probable cause.

Once he had a clear picture — specific affected cohort, timing, magnitude, probable cause — he compiled a detailed report with visualizations and affected cohort analysis. He didn't just flag the problem; he proposed both immediate fixes (implementing email verification as a fallback) and long-term improvements (automated anomaly detection in onboarding metrics and real-time alerting systems to catch similar issues faster in the future).

### Result
The engineering team was able to prioritize and resolve the issue quickly because of the specificity and clarity of Franklin's analysis. Without his detection, the bug would have continued silently degrading new user acquisition — a drop from 50-70% to 12-15% verification means roughly 70-80% of new Facebook-login users were being blocked from completing onboarding.

### Why This Matters
This project shows that Franklin doesn't just analyze what he's asked to analyze — he monitors, notices patterns, and investigates anomalies proactively. The verification rate bug wasn't assigned to him; he found it because he was paying attention to the data. For an AI Product Engineer role, this maps directly to production monitoring: catching model degradation, detecting data drift, and identifying issues before users report them.

---

## Project 5: Predicting the Future of Survey Engagement (Start-Rate Investigation)

### The Interview Question This Answers
"Tell me about a time you had to make a recommendation with incomplete or uncertain data" or "Tell me about a time you used data to prevent a bad decision."

### Situation
Instagram megaphone survey start rates — the primary mechanism through which Meta collected user feedback at scale — had been declining. The survey platform leadership team was concerned and considering engineering investment to address the problem. The question was: how serious is this, and should we intervene now?

### Task
Franklin needed to determine the severity and trajectory of the decline, understand the underlying drivers, and recommend whether the team should invest engineering resources in intervention or whether the situation was manageable.

### Action
Franklin conducted a multi-dimensional investigation. He analyzed historical trends from 2020 through 2023, finding that IG start rates had declined approximately 30% over nine months, while Facebook showed more stability with a 13% decline. He quantified survey fatigue effects: users who had never started a survey showed a 73% decline in start rates after six or more invitations, while previous participants showed a 62% decline. He identified that highly active users were 2.5x more likely to participate, and that device quality and connectivity had a 15-20% impact.

Critically, Franklin built time-series forecasting models with three scenarios: a baseline where decline continued at the current rate (reaching critical lows by mid-2025), a stabilization scenario where rates plateaued around 2.5%, and an intervention scenario where strategic changes could recover rates to approximately 3.0%. The recent data showed the rate of decline had already slowed to 2% in the most recent three months, suggesting natural stabilization was occurring.

### Result
Franklin's analysis concluded that no urgent intervention was needed — the decline was real but stabilizing, and the cost of engineering intervention wasn't justified by the current trajectory. He recommended a lighter-touch approach: implementing predictive modeling for smarter survey targeting, dynamic cooldown adjustments based on engagement levels, and enhanced monitoring to detect future shifts early.

The key impact was preventing unnecessary engineering investment. Without the analysis, the team might have launched a costly intervention for a problem that was already self-correcting. Franklin translated complex time-series analysis into a clear strategic recommendation that saved engineering resources for higher-priority work.

### Why This Matters
This project demonstrates Franklin's ability to think strategically about resource allocation, not just produce analysis. He didn't just answer "are start rates declining?" — he answered "should we do anything about it, and if so, what?" The ability to frame analytical findings in terms of business decisions, including the decision not to act, is rare and valuable. For AI product work, this maps to the constant question of "should we invest in improving this model/feature, or is the current performance acceptable?"

---

## Project 6: Building a Data Product for the Whole Company (Headline Metrics)

### The Interview Question This Answers
"Tell me about a time you built something used by multiple teams" or "Tell me about experience building data products."

### Situation
Multiple teams across Meta — Governance, Public Affairs, Election Integrity, Central Social Impact, and the Media Intelligence team — were independently tracking news coverage about Meta using different third-party tools, custom pipelines, and ad hoc analyses. This led to inconsistent metrics, duplicated effort, and frequent disagreements about basic facts like "how is media coverage trending?"

### Task
The team needed to build a single, authoritative data product that could serve as the canonical source of truth for news coverage tracking across the company. Franklin was one of several contributors to this effort.

### Action
Franklin contributed to building the Headline Metrics system, which involved several interconnected components. The system ingested news articles via the Cision API, applied an ML-based topic taxonomy to classify articles into a hierarchical system of topic groups and subtopics, and matched each article to on-platform engagement data — views, comments, shares, likes, and reactions — collected for up to 90 days after publication. Engagement could be broken down by user demographics including country, age, gender, activity level, and cohort.

Franklin's specific contributions included maintaining the user-support ecosystem (building and updating the wiki, onboarding materials, and SQL query templates that enabled self-service analytics), supporting the ML topic classification system with new training data as coverage topics evolved, and working directly with partner teams to develop and validate new use cases for the dataset.

### Result
The Headline Metrics dataset became the standard for news coverage tracking at Meta, serving five or more established use cases: measuring Oversight Board decision impact for Governance, competitor benchmarking for Public Affairs, media report complementation for Media Intelligence, integrity topic monitoring for Central Social Impact, and election-related coverage tracking for Election Integrity. It replaced fragmented, inconsistent tracking with a single source of truth that multiple teams could build on.

### Why This Matters
This project demonstrates Franklin's experience building data products that serve multiple stakeholders — not just running one-off analyses. The skills involved — thinking about data modeling, user onboarding, self-service analytics, ML classification, and cross-team coordination — transfer directly to building AI-powered data products. It also shows he can contribute to systems that outlast any individual project, which is the difference between an analyst and a product builder.