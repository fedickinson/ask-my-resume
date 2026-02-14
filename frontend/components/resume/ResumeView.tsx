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

  // Close expansion on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openExpansionId) {
        setOpenExpansionId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openExpansionId]);

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
    // Close any open expansion before transitioning
    setOpenExpansionId(null);
    // Small delay to let expansion close animation play
    setTimeout(() => {
      onViewChange(prompt);
    }, 100);
  };

  const handleCTAClick = () => {
    // Close any open expansion before transitioning
    setOpenExpansionId(null);
    // Small delay to let expansion close animation play
    setTimeout(() => {
      onViewChange();
    }, 100);
  };

  return (
    <div className="max-w-[700px] mx-auto px-8 py-10">
      <ResumeHeader
        name={data.name}
        contact={data.contact}
        onCTAClick={handleCTAClick}
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
            onClick={handleCTAClick}
            className="text-accent hover:underline font-medium"
          >
            Want to go deeper? Start a conversation →
          </button>
        </div>
      )}

      <BottomCTA onClick={handleCTAClick} />
    </div>
  );
}
