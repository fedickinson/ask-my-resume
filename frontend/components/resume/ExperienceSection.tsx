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
    <section className="mb-8">
      <SectionHeader title="PROFESSIONAL EXPERIENCE" />
      <LayoutGroup>
        <div className="space-y-6">
          {experience.map((exp) => {
            const expansion = expansions.find((e) => e.sectionId === exp.id);
            const isOpen = openExpansionId === exp.id;
            const triggerId = `trigger-${exp.id}`;
            const contentId = `content-${exp.id}`;

            return (
              <div key={exp.id} className="mb-6 pb-6 border-b border-gray-100 last:border-b-0">
                <div className="mb-2">
                  <span className="font-black text-base tracking-tight">{exp.company}</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[13px] italic text-gray-700">{exp.title}</span>
                  <span className="text-[12px] text-gray-500 font-medium ml-4">{exp.dates}</span>
                </div>
                <div className="text-[12px] text-gray-500 mb-4">{exp.location}</div>

                <ul className="list-none space-y-3 text-[13px]">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet.id} className="flex leading-loose">
                      <span className="mr-3 text-gray-400 shrink-0 font-bold">•</span>
                      <span className="text-gray-900">{bullet.text}</span>
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
