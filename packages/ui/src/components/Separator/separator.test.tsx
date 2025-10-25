import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders correctly', () => {
    render(<Separator>Test</Separator>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // TODO: 添加更多测试用例
});
