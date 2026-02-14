import { LayoutGroup } from 'framer-motion';
import SectionHeader from './SectionHeader';
import ExpandableTrigger from './ExpandableTrigger';
import ExpansionCard from './ExpansionCard';
import type { Experience, ExpansionData } from '@/lib/types';

interface ExperienceSectionProps {
  experience: Experience[];
  expansions: ExpansionData[];
  openExpansionId: string | null;
  onExpansionToggle: (id: string) => void;
  onBridgeClick?: (prompt: string) => void;
}

export default function ExperienceSection({
  experience,
  expansions,
  openExpansionId,
  onExpansionToggle,
  onBridgeClick,
}: ExperienceSectionProps) {
  return (
    <section className="mb-6">
      <SectionHeader title="PROFESSIONAL EXPERIENCE" />
      <LayoutGroup>
        <div className="space-y-4">
          {experience.map((exp) => {
            const expansion = expansions.find((e) => e.sectionId === exp.id);
            const isOpen = openExpansionId === exp.id;
            const triggerId = `trigger-${exp.id}`;
            const contentId = `content-${exp.id}`;

            return (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">
                    {exp.company} – {exp.title}
                  </span>
                  <span className="text-sm text-gray-700">{exp.dates}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1">{exp.location}</div>
                <ul className="list-none space-y-1 text-sm">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet.id} className="flex">
                      <span className="mr-2">•</span>
                      <span className="text-gray-700">{bullet.text}</span>
                    </li>
                  ))}
                </ul>
                {expansion && (
                  <div className="mt-2">
                    <ExpandableTrigger
                      question={expansion.trigger}
                      isOpen={isOpen}
                      onClick={() => onExpansionToggle(exp.id)}
                      triggerId={triggerId}
                      contentId={contentId}
                    />
                    <ExpansionCard
                      content={expansion.content}
                      isOpen={isOpen}
                      bridgeToChatPrompt={expansion.bridgeToChatPrompt}
                      onBridgeClick={onBridgeClick}
                      contentId={contentId}
                      triggerId={triggerId}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </section>
  );
}
