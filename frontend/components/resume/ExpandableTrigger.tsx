interface ExpandableTriggerProps {
  question: string;
  isOpen: boolean;
  onClick: () => void;
  triggerId: string;
  contentId: string;
}

export default function ExpandableTrigger({
  question,
  isOpen,
  onClick,
  triggerId,
  contentId,
}: ExpandableTriggerProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      id={triggerId}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 py-2 px-3 rounded -ml-3 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      aria-expanded={isOpen}
      aria-controls={contentId}
      aria-label={`${isOpen ? 'Collapse' : 'Expand'}: ${question}`}
    >
      <span className="text-lg transition-transform duration-200" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
        ›
      </span>
      <span className="text-left flex-1">{question}</span>
    </button>
  );
}
