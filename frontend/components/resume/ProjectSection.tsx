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
    <section className="mb-6">
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
              <div key={project.id} className="mb-4">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-extrabold text-[15px]">{project.name}</span>
                  <span className="text-[13px] text-gray-500 shrink-0">{project.dates}</span>
                </div>
                <div className="text-[13px] text-gray-600 italic mt-0.5 mb-2">
                  {project.description}
                </div>
                <ul className="list-none space-y-2 text-[13px]">
                  {project.bullets.map((bullet) => (
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
