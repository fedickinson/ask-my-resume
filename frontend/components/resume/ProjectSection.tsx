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

            return (
              <div key={project.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{project.name}</span>
                  <span className="text-sm text-gray-700">{project.dates}</span>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  {project.description}
                </div>
                <ul className="list-none space-y-1 text-sm">
                  {project.bullets.map((bullet) => (
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
                      onClick={() => onExpansionToggle(project.id)}
                    />
                    <ExpansionCard
                      content={expansion.content}
                      isOpen={isOpen}
                      bridgeToChatPrompt={expansion.bridgeToChatPrompt}
                      onBridgeClick={onBridgeClick}
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
