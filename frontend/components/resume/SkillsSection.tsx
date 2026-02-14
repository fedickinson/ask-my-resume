import SectionHeader from './SectionHeader';
import type { SkillCategory } from '@/lib/types';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section className="mb-6">
      <SectionHeader title="TECHNICAL SKILLS" />
      <div className="space-y-2">
        {skills.map((category) => (
          <div key={category.category} className="text-[13px] leading-relaxed">
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
