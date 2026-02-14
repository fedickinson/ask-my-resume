interface BottomCTAProps {
  onClick: () => void;
}

export default function BottomCTA({ onClick }: BottomCTAProps) {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        className="text-accent hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-2 py-1"
        aria-label="Start a conversation with Franklin"
      >
        Want to know more? Ask me anything.
      </button>
    </div>
  );
}
