import SectionHeader from './SectionHeader';
import type { Education } from '@/lib/types';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({
  education,
}: EducationSectionProps) {
  return (
    <section className="mb-6">
      <SectionHeader title="EDUCATION" />
      <div className="space-y-3">
        {education.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold">{edu.institution}</span>
              <span className="text-sm text-gray-700">{edu.location}</span>
            </div>
            <div className="flex justify-between items-baseline text-sm">
              <span>
                {edu.degree}
                {edu.certificate && ` – ${edu.certificate}`}
              </span>
              <span className="text-gray-700">{edu.graduationDate}</span>
            </div>
            {edu.gpa && (
              <div className="text-sm text-gray-700">GPA: {edu.gpa}</div>
            )}
            {edu.coursework && (
              <div className="text-sm text-gray-700">
                Relevant Coursework: {edu.coursework}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
