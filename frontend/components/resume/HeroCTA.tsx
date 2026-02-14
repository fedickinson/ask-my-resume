interface HeroCTAProps {
  onClick: () => void;
}

export default function HeroCTA({ onClick }: HeroCTAProps) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-accent hover:text-blue-600 transition-colors border-none bg-transparent cursor-pointer focus:outline-none focus:underline"
      aria-label="Start a conversation with Franklin"
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none'
      }}
    >
      or ask me anything →
    </button>
  );
}
