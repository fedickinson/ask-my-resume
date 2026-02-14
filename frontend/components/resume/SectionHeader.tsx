interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold uppercase tracking-wide mb-1">
        {title}
      </h2>
      <div className="border-b border-gray-300" />
    </div>
  );
}
