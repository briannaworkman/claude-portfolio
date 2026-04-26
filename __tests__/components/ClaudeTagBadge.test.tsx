import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ClaudeTagBadge } from '@/components/web/ClaudeTagBadge';

describe('ClaudeTagBadge', () => {
  it('renders "Built with Claude" for built-with', () => {
    render(<ClaudeTagBadge tags={['built-with']} />);
    expect(screen.getByText('Built with Claude')).toBeInTheDocument();
  });

  it('renders "Powered by Claude" for powered-by', () => {
    render(<ClaudeTagBadge tags={['powered-by']} />);
    expect(screen.getByText('Powered by Claude')).toBeInTheDocument();
  });

  it('renders both badges when both tags are present', () => {
    render(<ClaudeTagBadge tags={['built-with', 'powered-by']} />);
    expect(screen.getByText('Built with Claude')).toBeInTheDocument();
    expect(screen.getByText('Powered by Claude')).toBeInTheDocument();
  });

  it('renders nothing for empty array', () => {
    const { container } = render(<ClaudeTagBadge tags={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
