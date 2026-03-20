import type { Metadata } from 'next';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import { ContactForm } from '@/components/web/ContactForm';
import { social } from '@/data/social';

export const metadata: Metadata = {
  title: 'Contact — Bri Workman',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-3">Contact</h1>
      <p className="text-text-muted mb-10">
        Say hi — I'm always happy to chat about projects, AI workflows, or engineering.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ContactForm />

        <div className="space-y-4">
          <h2 className="text-sm font-mono text-violet-400 uppercase tracking-wider">Elsewhere</h2>
          <ul className="space-y-2">
            {social.github && (
              <li>
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors"
                >
                  <GitHubIcon size={14} />
                  GitHub
                </a>
              </li>
            )}
            {social.linkedin && (
              <li>
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors"
                >
                  <LinkedInIcon size={14} />
                  LinkedIn
                </a>
              </li>
            )}
            {social.email && (
              <li>
                <a
                  href={`mailto:${social.email}`}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  {social.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
