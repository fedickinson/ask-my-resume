import SectionHeader from './SectionHeader';
import type { SkillCategory } from '@/lib/types';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section className="mb-8">
      <SectionHeader title="TECHNICAL SKILLS" />
      <div className="space-y-3">
        {skills.map((category) => (
          <div key={category.category} className="text-[13px] leading-loose">
            <span className="font-bold">{category.category}:</span>{' '}
            <span className="text-gray-700">
              {category.skills.join(', ')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
