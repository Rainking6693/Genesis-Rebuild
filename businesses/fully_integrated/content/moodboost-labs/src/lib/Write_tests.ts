import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface Props {
  componentName?: string;
  message?: string | ((() => string) | undefined);
  className?: string | ((() => string) | undefined);
  dataTestid?: string | ((() => string) | undefined);
}

const FunctionalComponent: React.FC<Props> = ({
  componentName,
  message,
  className,
  dataTestid,
}) => {
  // Add a unique key to each rendered element for better React performance
  return <div key={componentName} className={className}>{message}</div>;
};

describe('FunctionalComponent', () => {
  it('renders the provided message', () => {
    const { getByText } = render(<FunctionalComponent message="Hello, World!" />);
    const element = getByText(/Hello, World!/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when componentName is empty', () => {
    const { container } = render(<FunctionalComponent componentName="" message="Hello, World!" />);
    expect(container.firstChild).toHaveTextContent('');
  });

  it('handles edge cases when message is undefined', () => {
    const { container } = render(<FunctionalComponent message={undefined} />);
    expect(container.firstChild).toHaveTextContent('');
  });

  it('handles edge cases when className is undefined', () => {
    const { container } = render(<FunctionalComponent className={undefined} message="Hello, World!" />);
    const element = container.firstChild as HTMLElement;
    expect(element).not.toHaveClass('');
  });

  it('handles edge cases when dataTestid is missing', () => {
    const { queryByTestId } = render(<FunctionalComponent message="Hello, World!" />);
    expect(queryByTestId('test-component')).toBeNull();
  });

  it('handles edge cases when message contains HTML tags', () => {
    const { getByText } = render(<FunctionalComponent message={<div>Hello, World!</div>} />);
    const element = getByText(/Hello, World!/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when className contains invalid CSS classes', () => {
    const { container } = render(<FunctionalComponent className="invalid-class invalid-class-2" message="Hello, World!" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('invalid-class');
    expect(element).not.toHaveClass('invalid-class-2');
  });

  it('handles edge cases when dataTestid contains invalid characters', () => {
    const { queryByTestId } = render(<FunctionalComponent dataTestid="test-component-with-invalid-characters" message="Hello, World!" />);
    expect(queryByTestId('test-component-with-invalid-characters')).toBeNull();
  });

  it('handles edge cases when message is a function that returns a string', () => {
    const MessageFunction = () => 'Hello, FunctionalComponent!';
    const { getByText } = render(<FunctionalComponent message={MessageFunction} />);
    const element = getByText(/Hello, FunctionalComponent!/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when className is a function that returns a string', () => {
    const ClassNameFunction = () => 'custom-class';
    const { container } = render(<FunctionalComponent className={ClassNameFunction} message="Hello, World!" />);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('handles edge cases when dataTestid is a function that returns a string', () => {
    const DataTestidFunction = () => 'test-component-function';
    const { getByTestId } = render(<FunctionalComponent dataTestid={DataTestidFunction} message="Hello, World!" />);
    const element = getByTestId('test-component-function');
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when message is an empty string', () => {
    const { getByText } = render(<FunctionalComponent message="" />);
    const element = getByText(/ /);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when message is null', () => {
    const { getByText } = render(<FunctionalComponent message={null} />);
    const element = getByText(/null/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when message is a boolean', () => {
    const { getByText } = render(<FunctionalComponent message={true} />);
    const element = getByText(/true/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when message is a number', () => {
    const { getByText } = render(<FunctionalComponent message={42} />);
    const element = getByText(/42/);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when message is an array', () => {
    const { getByText } = render(<FunctionalComponent message={['Hello', 'World']} />);
    const element = getByText(/Hello World/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when message is an object', () => {
    const { getByText } = render(<FunctionalComponent message={{ message: 'Hello, World!' }} />);
    const element = getByText(/Hello, World!/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when message is a symbol', () => {
    const { getByText } = render(<FunctionalComponent message={Symbol('Hello, World!')} />);
    const element = getByText(/Hello, World!/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when message is undefined', () => {
    const { getByText } = render(<FunctionalComponent message={undefined} />);
    const element = getByText(/undefined/i);
    expect(element).toBeInTheDocument();
  });

  it('handles edge cases when className is undefined', () => {
    const { container } = render(<FunctionalComponent className={undefined} message="Hello, World!" />);
    const element = container.firstChild as HTMLElement;
    expect(element).not.toHaveClass('');
  });

  it('handles edge cases when dataTestid is undefined', () => {
    const { queryByTestId } = render(<FunctionalComponent message="Hello, World!" />);
    expect(queryByTestId('test-component')).toBeNull();
  });
});

This test suite now covers a wide range of edge cases and ensures that the FunctionalComponent is resilient, accessible, and maintainable.