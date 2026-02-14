import { motion } from 'framer-motion';

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export default function SuggestedPrompts({
  prompts,
  onPromptClick,
}: SuggestedPromptsProps) {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 mb-3">Suggested questions:</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1 * index,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={() => onPromptClick(prompt)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
