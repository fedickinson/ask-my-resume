import { ResumeVariant, MergedResumeData } from '@/lib/types';
import { baseResume, baseExpansions } from './base';
import { defaultVariant } from './default';

/**
 * Variant Registry
 *
 * Add new variants here as they are created.
 * Each variant is accessible via its slug in the URL.
 */
export const variants: Record<string, ResumeVariant> = {
  default: defaultVariant,
  // Future variants:
  // anthropic: anthropicVariant,
  // openai: openaiVariant,
  // startup: startupVariant,
};

/**
 * Merge a variant configuration with the base resume data
 *
 * @param variantSlug - The variant slug (e.g., 'default', 'anthropic')
 * @returns Complete resume data with variant-specific selections applied
 */
export function getVariantData(variantSlug: string): MergedResumeData {
  const variant = variants[variantSlug] || variants.default;

  // Clone base resume
  const mergedResume = JSON.parse(JSON.stringify(baseResume));

  // Apply variant-specific bullet selections
  mergedResume.experience = mergedResume.experience.map((exp: any) => {
    const variantConfig = variant.experience[exp.id];
    if (variantConfig) {
      // Filter bullets based on variant configuration
      const selectedBullets = exp.bullets.filter((bullet: any) =>
        variantConfig.bullets.includes(bullet.id)
      );
      return { ...exp, bullets: selectedBullets };
    }
    return exp;
  });

  // Apply expansion overrides
  const expansions = baseExpansions.map((expansion) => {
    const override = variant.expansions[expansion.sectionId];
    if (override) {
      return { ...expansion, ...override };
    }
    return expansion;
  });

  return {
    ...mergedResume,
    expansions,
    chatConfig: variant.chat,
  };
}
