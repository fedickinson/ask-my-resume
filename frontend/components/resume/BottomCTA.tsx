interface BottomCTAProps {
  onClick: () => void;
}

export default function BottomCTA({ onClick }: BottomCTAProps) {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        className="text-accent hover:underline font-medium border-none bg-transparent cursor-pointer focus:outline-none focus:text-blue-600"
        aria-label="Start a conversation with Franklin"
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none'
        }}
      >
        Want to know more? Ask me anything.
      </button>
    </div>
  );
}
