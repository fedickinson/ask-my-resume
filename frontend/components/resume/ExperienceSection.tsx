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
    <section className="mb-5">
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
                {/* Line 1: Company + Title on left, Dates on right */}
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-semibold text-sm">{exp.company}</span>
                    <span className="text-sm text-gray-700 ml-1">— {exp.title}</span>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{exp.dates}</span>
                </div>
                {/* Line 2: Location */}
                <div className="text-xs text-gray-500 mb-1">{exp.location}</div>

                {/* Bullets */}
                <ul className="list-disc list-outside ml-4 space-y-1">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet.id} className="text-sm leading-relaxed text-gray-700 pl-0.5">
                      {bullet.text}
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
