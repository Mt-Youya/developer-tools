import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  it('renders correctly', () => {
    render(<Tooltip>Test</Tooltip>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // TODO: 添加更多测试用例
});
