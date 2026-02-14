import { ResumeData, ExpansionData } from '@/lib/types';

/**
 * Base Resume Data - Complete Content Library
 *
 * This file contains ALL resume content with unique IDs for every bullet point.
 * Variants select which bullets to display and in what order.
 */
export const baseResume: ResumeData = {
  name: "Franklin Dickinson",

  contact: {
    location: "New York, NY",
    phone: "917-723-3921",
    email: "franklin.e.dickinson@gmail.com",
    linkedin: "linkedin.com/in/franklindickinson",
    website: "franklindickinson.com",
  },

  education: [
    {
      id: "cornell-tech",
      institution: "Cornell Tech",
      location: "New York, NY",
      degree: "MEng in Computer Science",
      certificate: "AI for Engineers Certificate",
      graduationDate: "May 2026",
      gpa: "3.89",
      coursework: "Language Modeling, Generative AI, Deep Learning, Machine Learning Engineering, Trustworthy AI",
    },
    {
      id: "dartmouth",
      institution: "Dartmouth College",
      location: "Hanover, NH",
      degree: "BA in Government & Anthropology (modified with Economics)",
      graduationDate: "June 2016",
      gpa: "3.7",
    },
  ],

  skills: [
    {
      category: "ML/AI",
      skills: [
        "PyTorch",
        "scikit-learn",
        "Claude API",
        "transformers",
        "CNNs",
        "RNNs",
        "deep learning",
        "causal inference",
        "A/B testing",
        "prompt engineering",
      ],
    },
    {
      category: "Languages",
      skills: ["Python", "TypeScript", "JavaScript", "SQL", "R"],
    },
    {
      category: "Tools",
      skills: [
        "FastAPI",
        "React",
        "Next.js",
        "PostgreSQL",
        "Langfuse",
        "Vercel",
        "Railway",
        "Git",
        "Docker",
      ],
    },
    {
      category: "Data",
      skills: [
        "Pandas",
        "NumPy",
        "data pipelines",
        "ETL",
        "analytics",
        "dashboarding",
        "time-series forecasting",
      ],
    },
  ],

  experience: [
    {
      id: "meta",
      company: "Meta",
      title: "Product Data Scientist",
      location: "Menlo Park, CA (Remote)",
      dates: "Jan 2021 – Aug 2025",
      bullets: [
        {
          id: "bert-model",
          text: "Built ML-powered news coverage tracking system using BERT-based topic classification, serving 5+ internal teams with canonical engagement metrics across Facebook, Instagram, and WhatsApp",
        },
        {
          id: "sentiment-causal",
          text: "Led causal inference study on brand sentiment using regression adjustment and difference-in-differences, controlling for confounds to measure +18-28pp lift in brand health from metaverse marketing campaign",
        },
        {
          id: "ad-targeting",
          text: "Co-led on-platform experiment targeting 7 audience cohorts via Facebook lead ads, identifying Facebook Creators as most cost-efficient segment ($141 per advocate vs. $272-864 for other cohorts)",
        },
        {
          id: "experimentation-infra",
          text: "Built experimentation infrastructure from scratch for Viewpoints product, including Deltoid integration, data pipelines for logged-in/logged-out users, and A/A test validation",
        },
        {
          id: "onboarding-ab-test",
          text: "Designed and ran A/B test simplifying onboarding from 4 screens to 2, achieving +2.9% login page reach, +2.3% account creation, and +3.7% first work unit completion",
        },
        {
          id: "survey-decline-investigation",
          text: "Led comprehensive investigation into 30% decline in Instagram survey start rates over 9 months, built time-series forecasting models with 3 scenarios, and presented findings to Survey Platform leadership",
        },
        {
          id: "bug-detection",
          text: "Detected critical onboarding bug causing SMS verification rates to drop from 50-70% to 12-15%, isolated root cause through cohort segmentation, and escalated with detailed report enabling rapid engineering fix",
        },
        {
          id: "pipeline-monitoring",
          text: "Built and maintained Survey Platform analytics dashboard tracking funnel metrics (4.92% start rate, 73% completion rate) with dimensional breakdowns, enabling real-time platform health monitoring",
        },
      ],
    },
    {
      id: "civis",
      company: "Civis Analytics",
      title: "Applied Scientist",
      location: "Chicago, IL",
      dates: "Jan 2018 – Dec 2020",
      bullets: [
        {
          id: "civis-election-forecasting",
          text: "Built election forecasting models and A/B testing frameworks for political advertising at national scale, working alongside ML engineers and managing direct client relationships",
        },
        {
          id: "civis-data-collection",
          text: "Developed data collection methodologies combining statistical rigor with real-world impact, applying causal inference and experimental design in high-stakes political campaigns",
        },
      ],
    },
    {
      id: "quanticmind",
      company: "QuanticMind",
      title: "Revenue Intelligence Analyst",
      location: "Buenos Aires, Argentina",
      dates: "Jun 2016 – Sep 2017",
      bullets: [
        {
          id: "quanticmind-lead-scoring",
          text: "Developed lead scoring models using LinkedIn data to prioritize sales targets, predicting conversion likelihood based on company attributes, role seniority, and engagement signals",
        },
        {
          id: "quanticmind-sales-forecasting",
          text: "Built sales forecasting models projecting revenue based on historical pipeline data, conversion rates, and deal velocity, providing leadership with quarterly target visibility",
        },
      ],
    },
  ],

  projects: [
    {
      id: "budget-buddy",
      name: "Budget Buddy",
      description: "Full-stack personal finance app with AI financial coach",
      dates: "2024 – Present",
      bullets: [
        {
          id: "budget-buddy-architecture",
          text: "Built production full-stack app with React frontend (Vercel), FastAPI backend (Railway), PostgreSQL (Supabase), Claude Sonnet 4 for conversational AI, and scikit-learn for ML transaction classification",
        },
        {
          id: "budget-buddy-ai-features",
          text: "Implemented AI financial coach with modular prompt engineering, month-end review narrative generation, and automated daily/weekly/monthly insights with Langfuse observability",
        },
        {
          id: "budget-buddy-optimization",
          text: "Optimized AI costs using Anthropic prompt caching (90% cost reduction from $3.00 to $0.30 per million tokens), tracking token usage, cache hit rates, and per-call costs",
        },
        {
          id: "budget-buddy-testing",
          text: "Wrote ~430 automated tests across frontend integration tests (Vitest), backend unit/integration tests (pytest + testcontainers), and E2E tests (Playwright)",
        },
        {
          id: "budget-buddy-security",
          text: "Implemented field-level AES-256-GCM encryption for sensitive transaction data with user-specific keys, ensuring developer cannot read financial data at rest",
        },
      ],
    },
  ],
};

/**
 * Base Expansion Content - All Possible Expansions
 *
 * Variants can override trigger text and content for specific sections.
 */
export const baseExpansions: ExpansionData[] = [
  {
    sectionId: "meta",
    trigger: "How did you establish causality in the brand sentiment study?",
    content: "I used two complementary approaches: individual-level regression adjustment controlling for demographics, political ID, and news exposure to address confounding biases; and market-level difference-in-differences comparing geo-targeted markets to control markets. The regression models isolated +18-28pp causal lifts, while the market-level natural experiment validated the findings directionally with +6pp increases in targeted markets.",
  },
  {
    sectionId: "meta-infrastructure",
    trigger: "What went into building the experimentation infrastructure?",
    content: "I set up Deltoid integration for A/B testing, built data pipelines supporting both logged-in and logged-out users, established tracking metrics for conversion and retention, and ran A/A tests to verify the framework was statistically unbiased. This enabled the team's first rigorous A/B tests, including the onboarding simplification experiment that showed consistent funnel improvements.",
  },
  {
    sectionId: "civis",
    trigger: "What made the Civis experience different from Meta?",
    content: "Civis was high-stakes, national-scale political work with direct client relationships. I managed the full analytics lifecycle — from designing experiments to presenting findings to campaign leadership. The work required extreme rigor because getting it wrong had real consequences in elections. It taught me how to communicate complex statistical findings to non-technical stakeholders under pressure.",
  },
  {
    sectionId: "quanticmind",
    trigger: "What did you learn about data systems at QuanticMind?",
    content: "QuanticMind taught me that good analysis depends on good infrastructure. Building lead scoring and sales forecasting models required clean data pipelines, well-designed recording systems, and thoughtful data architecture. I learned that the hardest part of data science isn't the modeling — it's ensuring the data you're modeling is reliable, complete, and actually captures what you think it does.",
  },
  {
    sectionId: "cornell-tech",
    trigger: "What's been most valuable about Cornell Tech?",
    content: "The cross-disciplinary environment. I've taken classes with MBA students, medical researchers, and engineers from different specializations. The Trustworthy AI course with Professor Vitaly Shmatikov was particularly impactful — it taught me to think about AI safety not as an abstract concern but as a practical engineering challenge. Understanding adversarial attacks, fairness concerns, and privacy vulnerabilities shapes how I approach building AI products.",
  },
  {
    sectionId: "budget-buddy",
    trigger: "What's under the hood of Budget Buddy?",
    content: "It's a three-tier architecture: React 19 frontend on Vercel, FastAPI backend on Railway with 41 service files, and PostgreSQL 16 on Supabase. The AI integration uses Claude Sonnet 4 with modular prompt engineering and Anthropic's prompt caching for 90% cost reduction. The ML pipeline uses scikit-learn Random Forest for transaction classification — deliberately choosing a simpler model that trains in seconds and provides instant inference over a heavyweight transformer approach.",
    bridgeToChatPrompt: "Walk me through the technical architecture of Budget Buddy",
  },
];
