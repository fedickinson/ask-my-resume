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
      className="flex items-center gap-2 text-sm text-blue-500/60 hover:text-blue-500 transition-all duration-200 py-1 px-0 min-h-[44px] focus:outline-none focus:text-blue-600 border-none bg-transparent cursor-pointer w-full text-left"
      aria-expanded={isOpen}
      aria-controls={contentId}
      aria-label={`${isOpen ? 'Collapse' : 'Expand'}: ${question}`}
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none'
      }}
    >
      <span
        className="text-base transition-transform duration-200 inline-block"
        style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
      >
        ›
      </span>
      <span className="flex-1 italic">{question}</span>
    </button>
  );
}
