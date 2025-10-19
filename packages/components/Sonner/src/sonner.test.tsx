import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sonner } from './sonner';

describe('Sonner', () => {
  it('renders correctly', () => {
    render(<Sonner>Test</Sonner>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // TODO: 添加更多测试用例
});
