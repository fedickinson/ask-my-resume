interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <h2 className="uppercase tracking-wider font-semibold text-sm border-b border-gray-300 pb-1 mb-2">
      {title}
    </h2>
  );
}
