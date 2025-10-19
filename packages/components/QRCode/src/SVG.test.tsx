import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRCodeSVG } from './SVG';

describe('QRCodeSVG', () => {
  it('renders correctly', () => {
    render(<QRCodeSVG>Test</QRCodeSVG>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  // TODO: 添加更多测试用例
});
