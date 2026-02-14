import { LayoutGroup } from 'framer-motion';
import SectionHeader from './SectionHeader';
import ExpandableTrigger from './ExpandableTrigger';
import ExpansionCard from './ExpansionCard';
import type { Project, ExpansionData } from '@/lib/types';

interface ProjectSectionProps {
  projects: Project[];
  expansions: ExpansionData[];
  openExpansionId: string | null;
  onExpansionToggle: (id: string) => void;
  onBridgeClick?: (prompt: string) => void;
}

export default function ProjectSection({
  projects,
  expansions,
  openExpansionId,
  onExpansionToggle,
  onBridgeClick,
}: ProjectSectionProps) {
  return (
    <section className="mb-5">
      <SectionHeader title="PROJECTS" />
      <LayoutGroup>
        <div className="space-y-4">
          {projects.map((project) => {
            const expansion = expansions.find(
              (e) => e.sectionId === project.id
            );
            const isOpen = openExpansionId === project.id;
            const triggerId = `trigger-${project.id}`;
            const contentId = `content-${project.id}`;

            return (
              <div key={project.id}>
                {/* Line 1: Project Name + Dates on right */}
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm">{project.name}</span>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{project.dates}</span>
                </div>
                {/* Line 2: Description */}
                <div className="text-xs text-gray-500 italic mb-1">{project.description}</div>

                {/* Bullets */}
                <ul className="list-disc list-outside ml-4 space-y-1">
                  {project.bullets.map((bullet) => (
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
                      onClick={() => onExpansionToggle(project.id)}
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
