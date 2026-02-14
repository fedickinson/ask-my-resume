interface HeroCTAProps {
  onClick: () => void;
}

export default function HeroCTA({ onClick }: HeroCTAProps) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-accent opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-2 py-1"
      aria-label="Start a conversation with Franklin"
    >
      or ask me anything →
    </button>
  );
}
