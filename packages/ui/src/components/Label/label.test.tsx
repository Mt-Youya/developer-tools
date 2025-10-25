import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from './label';

describe('Label', () => {
  it('renders correctly', () => {
    render(<Label>Test</Label>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // TODO: 添加更多测试用例
});
