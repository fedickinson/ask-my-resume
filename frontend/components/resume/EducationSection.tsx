import SectionHeader from './SectionHeader';
import type { Education } from '@/lib/types';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({
  education,
}: EducationSectionProps) {
  return (
    <section className="mb-5">
      <SectionHeader title="EDUCATION" />
      <div className="space-y-3">
        {education.map((edu) => (
          <div key={edu.id}>
            {/* Line 1: Institution and Graduation Date */}
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-sm">{edu.institution}</span>
              <span className="text-sm text-gray-500 ml-4">{edu.graduationDate}</span>
            </div>
            {/* Line 2: Degree/Certificate and Location/GPA */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-700">
                {edu.degree}
                {edu.certificate && <> – <span className="italic">{edu.certificate}</span></>}
              </span>
              <span className="text-xs text-gray-500 ml-4">
                {edu.location}
                {edu.gpa && <> • GPA: {edu.gpa}</>}
              </span>
            </div>
            {/* Line 3: Coursework */}
            {edu.coursework && (
              <div className="text-sm text-gray-600 mt-0.5">
                <span className="font-medium">Relevant Coursework:</span> {edu.coursework}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
