interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export default function SuggestedPrompts({
  prompts,
  onPromptClick,
}: SuggestedPromptsProps) {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 mb-3">Suggested questions:</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
