import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CardHeader } from '@/components/web/stats/components/CardHeader';

describe('CardHeader', () => {
  it('renders the label', () => {
    render(<CardHeader label="Goal Rate" />);
    expect(screen.getByText('Goal Rate')).toBeInTheDocument();
  });

  it('renders delta display when provided', () => {
    render(<CardHeader label="Messages" delta={{ display: '▲ 255', color: '#00ff9d' }} />);
    expect(screen.getByText('▲ 255')).toBeInTheDocument();
  });

  it('does not render delta when null', () => {
    render(<CardHeader label="Messages" delta={null} />);
    expect(screen.queryByText(/[▲▼]/)).toBeNull();
  });

  it('applies custom labelClassName to the label element', () => {
    render(<CardHeader label="Friction" labelClassName="text-rose-400/60" />);
    expect(screen.getByText('Friction')).toHaveClass('text-rose-400/60');
  });
});
