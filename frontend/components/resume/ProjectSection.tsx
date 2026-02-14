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
    <section className="mb-8">
      <SectionHeader title="PROJECTS" />
      <LayoutGroup>
        <div className="space-y-6">
          {projects.map((project) => {
            const expansion = expansions.find(
              (e) => e.sectionId === project.id
            );
            const isOpen = openExpansionId === project.id;
            const triggerId = `trigger-${project.id}`;
            const contentId = `content-${project.id}`;

            return (
              <div key={project.id} className="mb-6 pb-6 border-b border-gray-100 last:border-b-0">
                <div className="mb-2">
                  <span className="font-black text-base tracking-tight">{project.name}</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="text-[13px] text-gray-600 italic flex-1">
                    {project.description}
                  </div>
                  <span className="text-[12px] text-gray-500 font-medium ml-4 shrink-0">{project.dates}</span>
                </div>

                <ul className="list-none space-y-3 text-[13px] mt-4">
                  {project.bullets.map((bullet) => (
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
