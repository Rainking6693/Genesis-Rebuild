import React from 'react';
import { render, screen, waitFor, fireEvent, userEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const renderComponent = (props: Partial<Props>) => {
    return render(<MyComponent {...props} />);
  };

  const baseProps: Props = {
    message: 'Test Message',
  };

  test('renders the component with the correct message', () => {
    renderComponent(baseProps);
    const message = screen.getByText(/Test Message/i);
    expect(message).toBeInTheDocument();
  });

  test('handles empty message', () => {
    const { container } = renderComponent({ message: '' });
    expect(container.firstChild).toBeNull();
  });

  test('handles null message', () => {
    const { container } = renderComponent({ message: null });
    expect(container.firstChild).toBeNull();
  });

  test('handles undefined message', () => {
    const { container } = renderComponent({});
    expect(container.firstChild).toBeNull();
  });

  test('handles long message', () => {
    const longMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.';
    renderComponent({ message: longMessage });
    const message = screen.getByText(longMessage);
    expect(message).toBeInTheDocument();
  });

  test('handles accessibility', () => {
    renderComponent(baseProps);
    const message = screen.getByText(/Test Message/i);
    expect(message).toHaveAccessibleName('Test Message');
  });

  test('handles focus', async () => {
    const { container } = renderComponent(baseProps);
    const message = container.firstChild as HTMLElement;
    await act(async () => {
      fireEvent.focus(message);
    });
    expect(document.activeElement).toBe(message);
  });

  test('handles click', () => {
    const handleClick = jest.fn();
    renderComponent({ ...baseProps, onClick: handleClick });
    const message = screen.getByText(/Test Message/i);
    fireEvent.click(message);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('handles loading state', async () => {
    renderComponent({ message: null, isLoading: true });
    const loadingElement = screen.getByTestId('loading-indicator');
    expect(loadingElement).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Test Message/i)).toBeNull());
  });

  test('handles error state', async () => {
    const errorMessage = 'An error occurred';
    renderComponent({ message: null, error: errorMessage });
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  test('handles keyboard interactions', () => {
    renderComponent(baseProps);
    const message = screen.getByText(/Test Message/i);
    userEvent.tab();
    expect(document.activeElement).toBe(message);
    userEvent.keyboard('{Enter}');
    expect(screen.queryByText(/Test Message/i)).toBeNull();
  });
});

In this updated version, I added tests for the loading state and error state, as well as a test for keyboard interactions. The `waitFor` function is used to ensure that the component has finished loading before making assertions about the rendered content. The `userEvent` library is used to simulate keyboard interactions.