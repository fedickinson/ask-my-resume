import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/hooks';

interface ExpansionCardProps {
  content: string;
  isOpen: boolean;
  bridgeToChatPrompt?: string;
  onBridgeClick?: (prompt: string) => void;
  contentId: string;
  triggerId: string;
}

export default function ExpansionCard({
  content,
  isOpen,
  bridgeToChatPrompt,
  onBridgeClick,
  contentId,
  triggerId,
}: ExpansionCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const animationDuration = prefersReducedMotion ? 0.01 : 0.4;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={contentId}
          role="region"
          aria-labelledby={triggerId}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { duration: animationDuration, ease: 'easeOut' },
              opacity: { duration: animationDuration * 0.625, ease: 'easeOut', delay: prefersReducedMotion ? 0 : 0.15 },
            },
          }}
          exit={{
            opacity: 0,
            height: 0,
            transition: {
              opacity: { duration: animationDuration * 0.5, ease: 'easeOut' },
              height: { duration: animationDuration * 0.875, ease: 'easeOut' },
            },
          }}
          className="overflow-hidden"
        >
          <div className="bg-gray-50 rounded p-4 my-3 text-sm text-gray-700 leading-relaxed">
            <p>{content}</p>
            {bridgeToChatPrompt && onBridgeClick && (
              <button
                onClick={() => onBridgeClick(bridgeToChatPrompt)}
                className="mt-3 text-accent hover:underline text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-1"
              >
                Want to go deeper? Start a conversation →
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
