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
          <div key={edu.id} className="mb-3">
            <div className="flex justify-between items-start gap-4">
              <span className="font-extrabold text-[15px]">{edu.institution}</span>
              <span className="text-[13px] text-gray-500 shrink-0">{edu.location}</span>
            </div>
            <div className="flex justify-between items-start text-[13px] mt-0.5 gap-4">
              <div className="flex-1">
                {edu.degree}
                {edu.certificate && (
                  <> – <span className="italic">{edu.certificate}</span></>
                )}
              </div>
              <span className="text-gray-500 shrink-0">{edu.graduationDate}</span>
            </div>
            {edu.gpa && (
              <div className="text-[13px] text-gray-600 mt-0.5">
                GPA: {edu.gpa}
              </div>
            )}
            {edu.coursework && (
              <div className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                Relevant Coursework: {edu.coursework}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
