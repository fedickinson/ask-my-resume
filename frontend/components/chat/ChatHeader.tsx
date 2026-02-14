import { motion } from 'framer-motion';

interface ChatHeaderProps {
  onBackToResume: () => void;
}

export default function ChatHeader({ onBackToResume }: ChatHeaderProps) {
  return (
    <motion.header
      layoutId="header"
      className="border-b border-gray-200 p-4 flex items-center justify-between bg-white sticky top-0 z-10"
    >
      <h1 className="text-xl font-bold">Franklin Dickinson</h1>
      <button
        onClick={onBackToResume}
        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        ← View Resume
      </button>
    </motion.header>
  );
}
