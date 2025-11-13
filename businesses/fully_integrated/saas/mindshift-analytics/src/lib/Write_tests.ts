import React, { FC, memo, useId } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  const defaultProps = {
    message: 'Test message',
  };

  it('should render the component with the provided message', () => {
    const { getByText } = render(<MyComponent {...defaultProps} />);
    expect(getByText(defaultProps.message)).toBeInTheDocument();
  });

  it('should generate a unique id when no custom id is provided', () => {
    const { getAllByTestId } = render(<MyComponent {...defaultProps} />);
    const ids = getAllByTestId('my-component');
    expect(ids.length).toBe(1);
    expect(ids[0]).not.toEqual(ids[1]);
  });

  it('should set the aria-label to the provided message', () => {
    const { getByRole } = render(<MyComponent {...defaultProps} />);
    expect(getByRole('text').getAttribute('aria-label')).toEqual(defaultProps.message);
  });

  it('should have a role of "text"', () => {
    const { getByRole } = render(<MyComponent {...defaultProps} />);
    expect(getByRole('text')).toBeInTheDocument();
  });

  it('should be focusable', async () => {
    const { getByTestId } = render(<MyComponent {...defaultProps} />);
    await act(async () => {
      userEvent.tab();
      userEvent.tab();
      fireEvent.focus(getByTestId('my-component'));
    });
    expect(getByTestId('my-component')).toHaveFocus();
  });

  it('should match the expected structure', async () => {
    const { container } = render(<MyComponent {...defaultProps} />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should use the provided id when available', () => {
    const customId = 'custom-id';
    const { getByTestId } = render(<MyComponent {...defaultProps} id={customId} />);
    expect(getByTestId('my-component')).toHaveAttribute('id', customId);
  });

  it('should validate the message prop', () => {
    expect(() => render(<MyComponent message="" />)).toThrow('Message cannot be empty.');
  });
});

// MyComponent component remains the same as before

import React, { FC, memo, useId } from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  const defaultProps = {
    message: 'Test message',
  };

  it('should render the component with the provided message', () => {
    const { getByText } = render(<MyComponent {...defaultProps} />);
    expect(getByText(defaultProps.message)).toBeInTheDocument();
  });

  it('should generate a unique id when no custom id is provided', () => {
    const { getAllByTestId } = render(<MyComponent {...defaultProps} />);
    const ids = getAllByTestId('my-component');
    expect(ids.length).toBe(1);
    expect(ids[0]).not.toEqual(ids[1]);
  });

  it('should set the aria-label to the provided message', () => {
    const { getByRole } = render(<MyComponent {...defaultProps} />);
    expect(getByRole('text').getAttribute('aria-label')).toEqual(defaultProps.message);
  });

  it('should have a role of "text"', () => {
    const { getByRole } = render(<MyComponent {...defaultProps} />);
    expect(getByRole('text')).toBeInTheDocument();
  });

  it('should be focusable', async () => {
    const { getByTestId } = render(<MyComponent {...defaultProps} />);
    await act(async () => {
      userEvent.tab();
      userEvent.tab();
      fireEvent.focus(getByTestId('my-component'));
    });
    expect(getByTestId('my-component')).toHaveFocus();
  });

  it('should match the expected structure', async () => {
    const { container } = render(<MyComponent {...defaultProps} />);
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });

  it('should use the provided id when available', () => {
    const customId = 'custom-id';
    const { getByTestId } = render(<MyComponent {...defaultProps} id={customId} />);
    expect(getByTestId('my-component')).toHaveAttribute('id', customId);
  });

  it('should validate the message prop', () => {
    expect(() => render(<MyComponent message="" />)).toThrow('Message cannot be empty.');
  });
});

// MyComponent component remains the same as before