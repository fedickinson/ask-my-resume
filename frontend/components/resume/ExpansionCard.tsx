import { motion, AnimatePresence } from 'framer-motion';

interface ExpansionCardProps {
  content: string;
  isOpen: boolean;
  bridgeToChatPrompt?: string;
  onBridgeClick?: (prompt: string) => void;
}

export default function ExpansionCard({
  content,
  isOpen,
  bridgeToChatPrompt,
  onBridgeClick,
}: ExpansionCardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { duration: 0.4, ease: 'easeOut' },
              opacity: { duration: 0.25, ease: 'easeOut', delay: 0.15 },
            },
          }}
          exit={{
            opacity: 0,
            height: 0,
            transition: {
              opacity: { duration: 0.2, ease: 'easeOut' },
              height: { duration: 0.35, ease: 'easeOut' },
            },
          }}
          className="overflow-hidden"
        >
          <div className="bg-gray-50 rounded p-4 my-3 text-sm text-gray-700">
            <p>{content}</p>
            {bridgeToChatPrompt && onBridgeClick && (
              <button
                onClick={() => onBridgeClick(bridgeToChatPrompt)}
                className="mt-3 text-accent hover:underline text-sm"
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
