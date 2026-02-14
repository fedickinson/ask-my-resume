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
              <span className="font-bold text-base">{edu.institution}</span>
              <span className="text-sm text-gray-600">{edu.location}</span>
            </div>
            <div className="flex justify-between items-baseline text-sm mt-0.5">
              <div>
                <span className="font-medium">{edu.degree}</span>
                {edu.certificate && (
                  <span className="text-gray-700"> – {edu.certificate}</span>
                )}
              </div>
              <span className="text-gray-600 font-medium">{edu.graduationDate}</span>
            </div>
            {edu.gpa && (
              <div className="text-sm text-gray-600 mt-0.5">
                GPA: <span className="font-medium">{edu.gpa}</span>
              </div>
            )}
            {edu.coursework && (
              <div className="text-sm text-gray-600 mt-1">
                <span className="text-gray-500">Relevant Coursework:</span> {edu.coursework}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
