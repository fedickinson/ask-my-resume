import SectionHeader from './SectionHeader';
import type { Education } from '@/lib/types';

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({
  education,
}: EducationSectionProps) {
  return (
    <section className="mb-8">
      <SectionHeader title="EDUCATION" />
      <div className="space-y-5">
        {education.map((edu) => (
          <div key={edu.id} className="mb-6 pb-5 border-b border-gray-100 last:border-b-0">
            <div className="mb-2">
              <span className="font-black text-base tracking-tight">{edu.institution}</span>
            </div>
            <div className="flex justify-between items-baseline text-[13px] mb-1">
              <div className="flex-1">
                {edu.degree}
                {edu.certificate && (
                  <> – <span className="italic text-gray-700">{edu.certificate}</span></>
                )}
              </div>
              <span className="text-[12px] text-gray-500 font-medium ml-4 shrink-0">{edu.graduationDate}</span>
            </div>
            <div className="text-[12px] text-gray-500 mb-3">
              {edu.location}
              {edu.gpa && <> • GPA: {edu.gpa}</>}
            </div>
            {edu.coursework && (
              <div className="text-[12px] text-gray-600 leading-loose">
                <span className="text-gray-500">Relevant Coursework:</span> {edu.coursework}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
