---
category: "experience"
document: "meta-overview"
title: "Franklin's Meta Experience — Full Overview"
summary: "Comprehensive overview of Franklin's 4 years at Meta (2021-2025), covering two teams (Public Affairs, Survey Operations/Research Platform), 12+ projects spanning causal inference, experimentation, data product development, pipeline architecture, and strategic analytics"
chunk_strategy: "paragraph"
context_prefix: "Franklin Dickinson — Meta Experience: "
sample_queries:
  - "What did Franklin do at Meta?"
  - "Tell me about Franklin's work experience"
  - "What projects did Franklin work on at Meta?"
  - "Has Franklin run A/B tests at scale?"
  - "Does Franklin have experience with causal inference?"
  - "What kind of data science did Franklin do?"
  - "Has Franklin built data products?"
  - "What was Franklin's biggest project at Meta?"
  - "How long was Franklin at Meta?"
  - "What teams did Franklin work on?"
  - "Has Franklin worked with ML in production?"
  - "Does Franklin have experience at a large tech company?"
---

# Franklin's Meta Experience

## Overview

Franklin spent four years at Meta (2021–2025) as a Product Data Scientist, working across two distinct teams: Public Affairs (2021–early 2023) and Survey Operations / Research Platform (early 2023–mid 2025). Across both teams, he led projects spanning causal inference, A/B testing, data product development, pipeline architecture, time-series forecasting, and strategic analytics — all operating at the scale of billions of users across Facebook, Instagram, and WhatsApp.

The two roles were very different in character. Public Affairs was strategy-oriented work: measuring the causal impact of marketing campaigns on brand sentiment, building ML-powered data products for news coverage tracking, and running on-platform experiments to identify potential brand advocates. Survey Operations was infrastructure-oriented: building experimentation systems from scratch, designing data pipelines, creating monitoring dashboards, and conducting deep analytical investigations into platform-wide survey engagement trends. Together, they gave Franklin an unusually broad view of how data science operates at a company of Meta's scale — from executive-facing strategic analytics to ground-level pipeline engineering.

## Public Affairs (2021 – Early 2023)

### Headline Metrics Data Product

Franklin was one of several contributors to the Headline Metrics dataset, a canonical data product that standardized how Meta tracked news coverage and audience engagement across the company. Before Headline Metrics existed, multiple teams — Governance, Public Affairs, Election Integrity, Central Social Impact, and others — were independently tracking news coverage using different third-party tools and custom pipelines, leading to inconsistent metrics and duplicated effort.

The Headline Metrics dataset solved this by providing a unified system. It ingested news articles via the Cision API, applied an ML-based topic taxonomy to classify articles into a hierarchical system of topic groups and subtopics, and matched each article to on-platform engagement data — views, comments, shares, likes, and reactions — collected for up to 90 days after publication. Engagement could be broken down by user demographics including country, age, gender, activity level, and cohort, enabling targeted analysis of how different user segments engaged with news about Meta and its competitors.

Franklin's contributions included maintaining the user-support ecosystem (wiki, onboarding materials, SQL query templates), supporting the ML topic classification system with new training data, and working directly with partner teams to develop use cases. The dataset served five established use cases: measuring how Oversight Board decisions affected news coverage favorability for the Governance team, tracking regulatory news engagement between Meta and competitors for Public Affairs, complementing detailed media reports for the Media Intelligence team, tracking integrity and responsibility topics for Central Social Impact, and supporting election-related news monitoring for the Election Integrity team.

### Marketing Funnel Causal Inference Studies

Franklin led causal inference analyses measuring whether Meta's public affairs marketing campaigns actually changed brand sentiment — or whether observed correlations were driven by confounding factors. This was methodologically rigorous work that went well beyond standard A/B testing.

The Innovation Campaign analysis is the clearest example. The question was whether Meta's metaverse-focused messaging was causally improving brand health metrics, or whether people who recalled the messaging simply had pre-existing favorable attitudes toward Meta. Franklin applied two complementary approaches to establish causality.

The first was individual-level regression adjustment. Using survey data from waves spanning June through August 2022, Franklin measured the relationship between message recall (Message Pull Through, or MPT) and downstream attitudes while controlling for demographics, political identification, Facebook-related news exposure, media market effects, timing, and tech-related interests. This addressed two specific confounding mechanisms: negative attitude bias (people unfavorable to Meta dismissing and not recalling messages) and interest alignment bias (tech-interested people both recalling messages more easily and having more favorable attitudes). After adjustment, the analysis found meaningful causal effects: +18 to +28 percentage point lifts in metaverse attitude metrics and +15 to +24 percentage point lifts in brand health metrics among those who recalled the messaging.

The second approach was a market-level natural experiment using difference-in-differences. Franklin compared changes in metrics before and after campaign launch across geo-targeted markets (Tier 1 HINE and DC Likely Voters) versus comparable non-targeted control markets (Tier 2 HINE and Boston Likely Voters). This showed a +6 percentage point increase in MPT in targeted markets, with consistent directional improvements in downstream attitudes. The market-level effects were smaller than individual-level effects, which was expected — message penetration topped out at only 37% of users in targeted markets, meaning the campaign was working well but not reaching enough people.

The strategic recommendation was to increase media investment to expand reach, based on quantified evidence that every percentage point increase in MPT drove approximately 0.4 percentage points of improvement in brand health sentiment. Franklin also validated the funnel logic itself — confirming that message exposure caused attitude change rather than the reverse — and identified that metaverse familiarity alone did not improve attitudes toward Meta, supporting the strategy of emphasizing benefits over education.

### Community Network On-Platform Experiment

Franklin co-led an experimental program to identify and recruit potential brand advocates for Meta using on-platform lead ads. The experiment tested seven audience cohorts — including Facebook Creators, Group Admins, Messenger Power Users, Watch Power Users, and general US Monthly Active Population — to determine which groups were most receptive to advocacy recruitment and at what cost.

The methodological challenge was significant. The Facebook ads system's optimization mechanism skewed ad distribution among randomly assigned audience segments, introducing bias that required careful adjustment. The project also navigated multiple rounds of privacy review under strict time constraints, with a budget expiration deadline coinciding with an ad blackout period at the end of 2022.

Key findings: Facebook Creators were the most promising audience segment, with a 0.5% positive response rate (5x higher than the general population) and the most cost-efficient recruitment at $141.15 per potential advocate. Other segments ranged from $272 to $864 per advocate. The experiment identified 1,486 potential advocates across all segments.

Based on the results — viable proof of concept but high projected costs, lack of key implementation partners, and unresolved privacy compliance issues — Franklin contributed to a strategic recommendation to pause further investment. The recommendation, presented to leadership in February 2023, laid out clear conditions under which the program could be revisited: confirmed sponsorship, defined investment levels, concrete program goals, and dedicated staffing.

## Survey Operations / Research Platform (Early 2023 – Mid 2025)

### Megaphone Survey Start-Rate Investigation

Franklin led a comprehensive investigation into declining survey start rates across Instagram and Facebook megaphone surveys — the primary mechanism through which Meta collected user feedback at scale. The investigation was prompted by acute funnel health issues observed in Instagram surveys during late 2023.

The analysis covered multiple dimensions. Historical trend analysis of start rates from 2020 through 2023 revealed that IG megaphone start rates had declined approximately 30% over nine months, though the rate of decline had slowed to 2% in the most recent three months, suggesting potential stabilization. Facebook surveys showed greater stability, declining 13% over the same period.

Franklin quantified survey fatigue effects: users who had never started a prior survey showed a 73% decline in start rates after six or more invitations (from 2.6% to 0.7%), while users who had previously participated showed a 62% decline (from 18.0% to 6.9%). He identified that highly active users (those with 30 days of activity in the past month) were 2.5x more likely to start surveys, and that internet connectivity and device quality had a 15-20% impact on participation rates.

Using time-series forecasting, Franklin modeled three scenarios: a baseline where IG start rates continued declining approximately 1.8 percentage points annually (reaching critical lows by mid-2025), a stabilization scenario where rates plateaued around 2.5%, and an intervention scenario where strategic changes could recover rates to approximately 3.0%. The analysis concluded that no urgent intervention was needed, but recommended implementing predictive modeling for smarter survey targeting, dynamic cooldown adjustments based on engagement levels, and enhanced monitoring to detect future shifts early.

Franklin presented these findings to Survey Platform leadership, translating complex analytical findings into actionable recommendations for resource allocation. The key impact was preventing unnecessary engineering investment in a stable system while laying groundwork for future ML-based optimization.

### Experimentation Infrastructure for Viewpoints

When Franklin joined the Viewpoints team (a survey-based product under the Research Platform umbrella), basic tracking existed but there was no real experimentation infrastructure. He built the experimentation system largely from the ground up.

This involved setting up Deltoid integration for A/B testing, building the data pipelines needed to support experimentation for both logged-in and logged-out users, establishing tracking metrics to measure user conversion and retention, and conducting A/A tests to verify that the experimentation framework was correctly calibrated and free of statistical bias.

Once the infrastructure was in place, Franklin designed and ran the team's first A/B tests. The most impactful was an onboarding simplification experiment that reduced the new user experience from four screens to two. Results showed statistically significant improvements across the entire funnel: +2.9% increase in users reaching the first login page, +2.3% increase in account creation, and +3.7% increase in completing their first work unit. The consistent gains across funnel stages confirmed that reducing initial friction had compounding benefits on deeper engagement.

### Onboarding Verification Rate Bug Detection

During routine monitoring, Franklin identified a critical bug in the Viewpoints onboarding flow. SMS verification rates for users logging in via Facebook had suddenly dropped from a stable 50-70% range to as low as 12-15% — a change that, if left undetected, would have significantly impacted user acquisition.

Franklin's investigation was methodical. He segmented data by login method, notification type, and user cohorts to isolate the affected group. He cross-checked installation and notification click rates to confirm the drop wasn't caused by lower user volume. He identified that the issue was specific to new installations, ruling out legacy user behavior. He correlated the timing with recent backend deployments to flag a probable cause.

He compiled a detailed report with visualizations and affected cohort analysis, escalated to the engineering team, and proposed both immediate fixes (email verification fallback) and long-term improvements (automated anomaly detection in onboarding metrics, real-time alerting systems). The engineering team was able to prioritize and resolve the issue quickly because of the specificity and clarity of Franklin's analysis.

### Survey Platform Data Pipeline and Monitoring

Franklin worked extensively with the Tessa Funnel Event Pipeline, a multi-step data processing system that tracked user journeys through Meta's survey platform. The pipeline involved four stages: raw event logging and deduplication (cleaning interaction data from multiple platforms), funnel construction and user journey mapping (defining paths from survey invitation through completion), aggregated metrics computation (conversion rates and engagement metrics by segment), and cumulative historical analytics for long-term trend analysis and benchmarking.

Franklin also built and maintained the Survey Platform analytics dashboard, which tracked key funnel metrics including overall start rates (approximately 4.92%), start-to-completion rates (approximately 73%), and dimensional breakdowns by market, device, and survey channel. The dashboard served as the primary monitoring tool for the survey platform team, enabling identification of short-term performance dips versus long-term trends, and informing decisions about platform optimization.

Additionally, Franklin built the Survey Utilization and Cooldown monitoring system, which tracked how survey segments were allocated across users, managed cooldown periods to prevent survey fatigue, monitored utilization ratios to ensure efficient distribution, and tracked rollout capacity to prevent spikes in survey delivery that could impact response rates.

## Technical Skills Demonstrated

Across both teams, Franklin's work at Meta demonstrated depth in several technical areas:

Causal inference and experimental design — including regression adjustment, difference-in-differences, A/B and A/A testing, natural experiments with geo-targeting, and careful handling of confounding variables at both individual and market levels.

Data product development — building and maintaining a production data product (Headline Metrics) that served multiple teams, including ML-based classification, engagement matching, and self-service analytics infrastructure.

Pipeline architecture and data engineering — working with multi-step event processing pipelines, deduplication systems, funnel construction, and aggregated metrics computation at Meta's scale.

Time-series analysis and forecasting — modeling survey engagement trends across multiple scenarios to inform strategic resource allocation decisions.

Dashboarding and monitoring — building analytical dashboards for funnel tracking, root cause analysis, and platform health monitoring, with real-time anomaly detection capabilities.

Cross-functional collaboration — working with engineering teams, product managers, marketing, policy specialists, and senior leadership across multiple organizations within Meta.

Stakeholder communication — translating complex analytical findings into actionable recommendations for audiences ranging from engineers to executives.

## Scale of Operations

All of this work operated at Meta's scale. The survey platform served Facebook, Instagram, and WhatsApp — platforms with billions of users. The Headline Metrics dataset tracked news engagement across Meta's entire Family of Apps. The marketing campaign analyses covered national survey samples across multiple audience segments. The experimentation infrastructure Franklin built supported A/B tests across the Viewpoints user base with careful attention to statistical power and sample size considerations.

This experience with scale — understanding how data pipelines behave with billions of events, how A/B tests need to be designed when user populations are massive and heterogeneous, how monitoring systems need to work when the cost of undetected issues is measured in millions of affected users — is foundational to Franklin's approach to building data-intensive products.