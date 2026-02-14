interface ExpandableTriggerProps {
  question: string;
  isOpen: boolean;
  onClick: () => void;
}

export default function ExpandableTrigger({
  question,
  isOpen,
  onClick,
}: ExpandableTriggerProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors py-1 px-2 rounded -ml-2"
      aria-expanded={isOpen}
    >
      <span className="text-lg">{isOpen ? '‹' : '›'}</span>
      <span className="text-left">{question}</span>
    </button>
  );
}
