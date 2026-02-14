// View state for resume vs chat
export type ViewState = 'resume' | 'chat';

// Contact information
export interface ContactInfo {
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
}

// Education entry
export interface Education {
  id: string;
  institution: string;
  location: string;
  degree: string;
  certificate?: string;
  graduationDate: string;
  coursework?: string;
  gpa?: string;
}

// Skill category
export interface SkillCategory {
  category: string;
  skills: string[];
}

// Experience bullet point
export interface Bullet {
  id: string;
  text: string;
}

// Experience entry
export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  dates: string;
  bullets: Bullet[];
}

// Project entry
export interface Project {
  id: string;
  name: string;
  description: string;
  dates: string;
  bullets: Bullet[];
}

// Complete resume data structure
export interface ResumeData {
  name: string;
  contact: ContactInfo;
  education: Education[];
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
}

// Expansion content
export interface ExpansionData {
  sectionId: string;
  trigger: string;
  content: string;
  bridgeToChatPrompt?: string;
}

// Chat configuration
export interface ChatConfig {
  suggestedPrompts: string[];
  systemPromptAddendum?: string;
}

// Variant-specific experience config (which bullets to show)
export interface VariantExperienceConfig {
  bullets: string[]; // Array of bullet IDs to show
}

// Variant-specific expansion override
export interface VariantExpansion {
  trigger: string;
  content: string;
  bridgeToChatPrompt?: string;
}

// Complete variant configuration
export interface ResumeVariant {
  slug: string;
  label: string;
  experience: Record<string, VariantExperienceConfig>; // experience ID -> config
  expansions: Record<string, VariantExpansion>; // section ID -> expansion override
  chat: ChatConfig;
}

// Merged resume data (base + variant selections)
export interface MergedResumeData extends ResumeData {
  expansions: ExpansionData[];
  chatConfig: ChatConfig;
}
