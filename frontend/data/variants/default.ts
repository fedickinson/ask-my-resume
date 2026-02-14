import { ResumeVariant } from '@/lib/types';

/**
 * Default Variant - General Purpose Resume
 *
 * This is the variant shown when no specific variant slug is provided.
 * It presents a balanced view across all experience areas.
 */
export const defaultVariant: ResumeVariant = {
  slug: 'default',
  label: 'AI Product Engineer',

  // Experience configuration - which bullets to show for each role
  experience: {
    meta: {
      bullets: [
        'bert-model',
        'sentiment-causal',
        'experimentation-infra',
        'onboarding-ab-test',
        'survey-decline-investigation',
        'bug-detection',
      ],
    },
    civis: {
      bullets: ['civis-election-forecasting', 'civis-data-collection'],
    },
    quanticmind: {
      bullets: ['quanticmind-lead-scoring', 'quanticmind-sales-forecasting'],
    },
  },

  // Expansion overrides (using base expansions by default)
  expansions: {},

  // Chat configuration
  chat: {
    suggestedPrompts: [
      "Walk me through your career",
      "What have you built with AI?",
      "Why AI Product Engineering?",
      "Tell me about your Meta experience",
    ],
    systemPromptAddendum: undefined, // Use base system prompt
  },
};
