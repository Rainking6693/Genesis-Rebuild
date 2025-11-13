import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import MyComponent from './MyComponent';

interface Props {
  message: string | number | undefined | null;
  ariaLabel?: string;
  disabled?: boolean;
}

describe('MyComponent', () => {
  const defaultProps: Props = {
    message: 'Wellness-related content',
  };

  it('renders the provided message', () => {
    render(<MyComponent {...defaultProps} />);
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
  });

  it('renders the provided aria-label', () => {
    const ariaLabel = 'Test aria-label';
    render(<MyComponent {...defaultProps} ariaLabel={ariaLabel} />);
    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('aria-label', ariaLabel);
  });

  it('handles null or undefined message', () => {
    render(<MyComponent message={null} />);
    expect(screen.queryByText('Wellness-related content')).not.toBeInTheDocument();

    render(<MyComponent message={undefined} />);
    expect(screen.queryByText('Wellness-related content')).not.toBeInTheDocument();
  });

  it('handles empty message', () => {
    render(<MyComponent message="" />);
    expect(screen.queryByText('Wellness-related content')).not.toBeInTheDocument();
  });

  it('handles long message', () => {
    const longMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    render(<MyComponent message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles invalid HTML in message', () => {
    const invalidHtmlMessage = '<script>alert("XSS Attack!");</script>';
    render(<MyComponent message={invalidHtmlMessage} />);
    expect(screen.getByText(invalidHtmlMessage)).toHaveClass('html-escaped');
  });

  it('handles different types of message', () => {
    render(<MyComponent message={123} />);
    expect(screen.queryByText('123')).toBeInTheDocument();

    render(<MyComponent message={true} />);
    expect(screen.queryByText('true')).toBeInTheDocument();
  });

  it('handles invalid aria-label', () => {
    const invalidAriaLabel = 'Test aria-label with space';
    render(<MyComponent ariaLabel={invalidAriaLabel} />);
    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('aria-label', invalidAriaLabel.replace(/\s/g, '-'));
  });

  it('handles disabled state', () => {
    render(<MyComponent disabled={true} />);
    const element = screen.getByRole('button');
    expect(element).toHaveClass('disabled');
    expect(element).toHaveAttribute('disabled', 'true');
  });

  it('handles click event on enabled state', () => {
    const handleClick = jest.fn();
    render(<MyComponent onClick={handleClick} />);
    const element = screen.getByRole('button');
    fireEvent.click(element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<MyComponent tabIndex={0} onFocus={handleFocus} onBlur={handleBlur} />);
    const element = screen.getByRole('button');
    act(() => {
      userEvent.tab();
    });
    expect(element).toHaveFocus();
    act(() => {
      userEvent.tab();
    });
    expect(element).not.toHaveFocus();
    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });
});

export default MyComponent;

In this updated test suite, we added tests for different types of props, invalid `aria-label`, disabled state, click event handling, and focus and blur events. These tests help ensure the component's resiliency, edge cases, accessibility, and maintainability.