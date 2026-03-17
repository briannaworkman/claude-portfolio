'use client';

import { useState } from 'react';
import { social } from '@/data/social';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle');

  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!endpoint) {
      setState('error');
      return;
    }

    setState('submitting');
    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setState('success');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return <p className="font-mono text-violet-400 py-8">✓ Thanks! I'll get back to you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state === 'error' && (
        <p className="text-sm text-red-400 font-mono">
          Something went wrong. Try emailing me directly at{' '}
          <a href={`mailto:${social.email}`} className="underline">
            {social.email}
          </a>
          .
        </p>
      )}

      <div>
        <label htmlFor="name" className="block text-sm text-text-muted mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full bg-surface border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-text-muted mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-surface border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-violet-500 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-text-muted mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full bg-surface border border-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-violet-500 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded font-medium transition-colors"
      >
        {state === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
