'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getVariantData } from '@/data/variants';
import ResumeView from '@/components/resume/ResumeView';
import ChatView from '@/components/chat/ChatView';
import type { ViewState } from '@/lib/types';

export default function Page({
  params,
}: {
  params: { variant?: string[] };
}) {
  const variantSlug = params.variant?.[0] || 'default';
  const resumeData = getVariantData(variantSlug);
  const [view, setView] = useState<ViewState>('resume');
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>();

  const handleViewChange = (prompt?: string) => {
    setInitialPrompt(prompt);
    setView('chat');
  };

  const handleBackToResume = () => {
    setInitialPrompt(undefined);
    setView('resume');
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'resume' ? (
          <motion.div
            key="resume"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.3, ease: 'easeInOut' },
            }}
          >
            <ResumeView data={resumeData} onViewChange={handleViewChange} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                opacity: { delay: 0.2, duration: 0.4, ease: 'easeOut' },
                y: { delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            exit={{
              opacity: 0,
              y: -20,
              transition: { duration: 0.3, ease: 'easeInOut' },
            }}
          >
            <ChatView
              chatConfig={resumeData.chatConfig}
              onBackToResume={handleBackToResume}
              initialPrompt={initialPrompt}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
