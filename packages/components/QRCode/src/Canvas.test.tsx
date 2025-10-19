import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRCodeCanvas } from './Canvas';

describe('QRCodeCanvas', () => {
  it('renders correctly', () => {
    render(<QRCodeCanvas>Test</QRCodeCanvas>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // TODO: 添加更多测试用例
});
