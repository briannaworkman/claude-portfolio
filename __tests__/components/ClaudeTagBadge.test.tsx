import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClaudeTagBadge } from '@/components/web/ClaudeTagBadge';

describe('ClaudeTagBadge', () => {
  it('renders "Built with Claude" for built-with', () => {
    render(<ClaudeTagBadge tag="built-with" />);
    expect(screen.getByText('Built with Claude')).toBeInTheDocument();
  });

  it('renders "Powered by Claude" for powered-by', () => {
    render(<ClaudeTagBadge tag="powered-by" />);
    expect(screen.getByText('Powered by Claude')).toBeInTheDocument();
  });

  it('renders nothing for null', () => {
    const { container } = render(<ClaudeTagBadge tag={null} />);
    expect(container.firstChild).toBeNull();
  });
});
