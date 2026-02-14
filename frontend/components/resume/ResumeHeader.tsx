import { motion } from 'framer-motion';
import type { ContactInfo } from '@/lib/types';
import HeroCTA from './HeroCTA';

interface ResumeHeaderProps {
  name: string;
  contact: ContactInfo;
  variantSlug?: string;
  onCTAClick: () => void;
}

export default function ResumeHeader({
  name,
  contact,
  variantSlug = 'default',
  onCTAClick,
}: ResumeHeaderProps) {
  const websiteUrl =
    variantSlug === 'default'
      ? contact.website
      : `${contact.website}/${variantSlug}`;

  return (
    <motion.header layoutId="header" className="text-center mb-6">
      <h1 className="text-xl font-bold mb-2">{name}</h1>
      <p className="text-sm text-gray-600">
        {contact.location} | {contact.phone} | {contact.email}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        {contact.linkedin} |{' '}
        <span className="text-accent">{websiteUrl}</span>
      </p>
      <HeroCTA onClick={onCTAClick} />
    </motion.header>
  );
}
