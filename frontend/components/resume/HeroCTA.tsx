interface HeroCTAProps {
  onClick: () => void;
}

export default function HeroCTA({ onClick }: HeroCTAProps) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-accent opacity-70 hover:opacity-100 transition-opacity"
    >
      or ask me anything →
    </button>
  );
}
