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
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="font-extrabold text-[15px]">{exp.company}</span>
                    <span className="text-gray-600"> – </span>
                    <span className="italic">{exp.title}</span>
                  </div>
                  <span className="text-[13px] text-gray-500 shrink-0">{exp.dates}</span>
                </div>
                <div className="text-[13px] text-gray-500 mt-0.5 mb-2">{exp.location}</div>
                <ul className="list-none space-y-2 text-[13px]">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet.id} className="flex leading-relaxed">
                      <span className="mr-2.5 text-gray-400 shrink-0 mt-0.5">•</span>
                      <span className="text-gray-800">{bullet.text}</span>
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
