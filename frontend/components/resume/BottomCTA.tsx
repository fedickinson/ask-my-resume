interface BottomCTAProps {
  onClick: () => void;
}

export default function BottomCTA({ onClick }: BottomCTAProps) {
  return (
    <div className="text-center mt-8">
      <button
        onClick={onClick}
        className="text-accent hover:underline font-medium"
      >
        Want to know more? Ask me anything.
      </button>
    </div>
  );
}
