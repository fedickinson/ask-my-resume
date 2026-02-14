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

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {view === 'resume' ? (
          <motion.div
            key="resume"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            <ResumeView
              data={resumeData}
              onViewChange={() => setView('chat')}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.4 } }}
          >
            <ChatView
              chatConfig={resumeData.chatConfig}
              onBackToResume={() => setView('resume')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
