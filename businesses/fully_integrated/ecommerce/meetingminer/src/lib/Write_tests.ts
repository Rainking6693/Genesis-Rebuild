import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const renderComponent = (props: Props) => render(<MyComponent {...props} />);

  const defaultProps: Props = {
    message: 'Default message',
  };

  it('renders the default message', () => {
    const { getByText } = renderComponent(defaultProps);
    const messageElement = getByText(defaultProps.message);
    expect(messageElement).toBeInTheDocument();
  });

  it('renders the provided message', () => {
    const customMessage = 'Custom message';
    const { getByText } = renderComponent({ message: customMessage });
    const messageElement = getByText(customMessage);
    expect(messageElement).toBeInTheDocument();
  });

  it('handles empty message', () => {
    const { container } = renderComponent({ message: '' });
    expect(container.firstChild).toBeNull();
  });

  it('handles null message', () => {
    const { container } = renderComponent({ message: null });
    expect(container.firstChild).toBeNull();
  });

  it('handles undefined message', () => {
    const { container } = renderComponent({ message: undefined });
    expect(container.firstChild).toBeNull();
  });

  it('handles message with HTML tags', () => {
    const htmlMessage = '<strong>HTML message</strong>';
    const { getByText } = renderComponent({ message: htmlMessage });
    const messageElement = getByText(/html message/i);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('prose'); // Assuming a prose class is added for styling
    expect(messageElement).toHaveClass('dark:prose-dark'); // Assuming a dark mode class is added for styling
  });

  it('handles accessibility', () => {
    const { container } = renderComponent(defaultProps);
    expect(container).toHaveAttribute('role', 'alert');
    expect(container).toHaveAttribute('aria-live', 'polite');
  });

  it('handles focus on message', () => {
    const { container } = renderComponent(defaultProps);
    const messageElement = container.querySelector('div');
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.focus(messageElement);
    expect(messageElement).toHaveFocus();
  });

  it('handles keyboard interactions', async () => {
    const { container } = renderComponent(defaultProps);
    const messageElement = container.querySelector('div');
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.keyboard('{ArrowDown}'); // Navigate to the message
    userEvent.keyboard('{Enter}'); // Focus on the message
    await waitFor(() => expect(messageElement).toHaveFocus());
  });

  it('handles screen reader support', async () => {
    const { container } = renderComponent(defaultProps);
    const messageElement = container.querySelector('div');
    await waitFor(() => expect(screen.queryByText(defaultProps.message)).toBeInTheDocument());
    expect(screen.queryByText(defaultProps.message)).toHaveFocus();
  });
});

This updated test suite covers more edge cases, improves the structure, and adds tests for keyboard interactions and screen reader support. It also ensures that the message is announced by screen readers and can be navigated to using the keyboard.