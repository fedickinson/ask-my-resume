interface HeroCTAProps {
  onClick: () => void;
}

export default function HeroCTA({ onClick }: HeroCTAProps) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-blue-500/70 hover:text-blue-500 hover:translate-x-0.5 transition-all duration-200 border-none bg-transparent cursor-pointer focus:outline-none focus:underline"
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
