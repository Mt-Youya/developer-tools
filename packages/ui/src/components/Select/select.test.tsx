import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './select';

describe('Select', () => {
  it('renders correctly', () => {
    render(<Select>Test</Select>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // TODO: 添加更多测试用例
});
