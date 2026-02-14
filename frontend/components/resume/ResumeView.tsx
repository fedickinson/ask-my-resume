'use client';

import { useState, useEffect } from 'react';
import ResumeHeader from './ResumeHeader';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ProjectSection from './ProjectSection';
import BottomCTA from './BottomCTA';
import type { MergedResumeData } from '@/lib/types';

interface ResumeViewProps {
  data: MergedResumeData;
  onViewChange: (prompt?: string) => void;
}

export default function ResumeView({ data, onViewChange }: ResumeViewProps) {
  const [openExpansionId, setOpenExpansionId] = useState<string | null>(null);
  const [expansionCount, setExpansionCount] = useState(0);

  const handleExpansionToggle = (id: string) => {
    if (openExpansionId === id) {
      setOpenExpansionId(null);
    } else {
      setOpenExpansionId(id);
      if (!openExpansionId) {
        setExpansionCount((prev) => prev + 1);
      }
    }
  };

  const handleBridgeClick = (prompt: string) => {
    onViewChange(prompt);
  };

  return (
    <div className="max-w-[700px] mx-auto px-6 py-12">
      <ResumeHeader
        name={data.name}
        contact={data.contact}
        onCTAClick={() => onViewChange()}
      />

      <EducationSection education={data.education} />
      <SkillsSection skills={data.skills} />
      <ExperienceSection
        experience={data.experience}
        expansions={data.expansions}
        openExpansionId={openExpansionId}
        onExpansionToggle={handleExpansionToggle}
        onBridgeClick={handleBridgeClick}
      />
      <ProjectSection
        projects={data.projects}
        expansions={data.expansions}
        openExpansionId={openExpansionId}
        onExpansionToggle={handleExpansionToggle}
        onBridgeClick={handleBridgeClick}
      />

      {expansionCount >= 2 && (
        <div className="text-center mt-6 p-4 bg-blue-50 rounded">
          <button
            onClick={() => onViewChange()}
            className="text-accent hover:underline font-medium"
          >
            Want to go deeper? Start a conversation →
          </button>
        </div>
      )}

      <BottomCTA onClick={() => onViewChange()} />
    </div>
  );
}
