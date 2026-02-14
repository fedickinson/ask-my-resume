import SectionHeader from './SectionHeader';
import type { SkillCategory } from '@/lib/types';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section className="mb-5">
      <SectionHeader title="TECHNICAL SKILLS" />
      <div className="space-y-0.5">
        {skills.map((category) => (
          <div key={category.category} className="text-sm">
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
