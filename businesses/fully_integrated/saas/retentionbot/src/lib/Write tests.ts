import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const defaultProps = {
    message: 'Default message',
  };

  const renderComponent = (props: Partial<IMyComponentProps> = {}) => {
    return render(<MyComponent {...defaultProps} {...props} />);
  };

  it('renders the default message', () => {
    renderComponent();
    const message = screen.getByText(/default message/i);
    expect(message).toBeInTheDocument();
  });

  it('renders the provided message', () => {
    const customMessage = 'Custom message';
    renderComponent({ message: customMessage });
    const message = screen.getByText(customMessage);
    expect(message).toBeInTheDocument();
  });

  it('renders children', () => {
    const children = <span data-testid="children">Children</span>;
    renderComponent({ children });
    const childrenElement = screen.getByTestId('children');
    expect(childrenElement).toBeInTheDocument();
  });

  it('applies the provided className', () => {
    const className = 'test-class';
    renderComponent({ className });
    const component = screen.getByTestId(/my-component/i);
    expect(component).toHaveClass(className);
  });

  it('applies the provided testId', () => {
    const testId = 'test-id';
    renderComponent({ testId });
    const component = screen.getByTestId(testId);
    expect(component).toBeInTheDocument();
  });

  it('handles null or undefined message', () => {
    renderComponent({ message: null });
    renderComponent({ message: undefined });
    const message = screen.queryByText(/default message/i);
    expect(message).not.toBeInTheDocument();
  });

  it('handles empty message', () => {
    renderComponent({ message: '' });
    const message = screen.queryByText(/default message/i);
    expect(message).not.toBeInTheDocument();
  });

  it('handles message of different data types', () => {
    const numbers = [0, 1, 2, 3, 4];
    numbers.forEach((number) => {
      renderComponent({ message: number });
      const message = screen.queryByText(number.toString());
      expect(message).not.toBeInTheDocument();
    });

    renderComponent({ message: true });
    const message = screen.queryByText(/true/i);
    expect(message).not.toBeInTheDocument();

    renderComponent({ message: false });
    const message = screen.queryByText(/false/i);
    expect(message).not.toBeInTheDocument();

    renderComponent({ message: [] });
    const message = screen.queryByText(/default message/i);
    expect(message).not.toBeInTheDocument();

    renderComponent({ message: () => 'Function message' });
    const message = screen.getByText(/function message/i);
    expect(message).toBeInTheDocument();
  });

  it('handles children of different data types', () => {
    const numbers = [0, 1, 2, 3, 4];
    numbers.forEach((number) => {
      renderComponent({ children: number });
      const childrenElement = screen.queryByText(number.toString());
      expect(childrenElement).not.toBeInTheDocument();
    });

    renderComponent({ children: true });
    const childrenElement = screen.queryByText(/true/i);
    expect(childrenElement).not.toBeInTheDocument();

    renderComponent({ children: false });
    const childrenElement = screen.queryByText(/false/i);
    expect(childrenElement).not.toBeInTheDocument();

    renderComponent({ children: [] });
    const childrenElement = screen.queryByText(/default message/i);
    expect(childrenElement).not.toBeInTheDocument();

    renderComponent({ children: () => 'Function children' });
    const childrenElement = screen.getByText(/function children/i);
    expect(childrenElement).toBeInTheDocument();
  });

  it('handles className with invalid values', () => {
    renderComponent({ className: null });
    renderComponent({ className: undefined });
    renderComponent({ className: 0 });
    renderComponent({ className: true });
    renderComponent({ className: false });
    renderComponent({ className: [] });
    renderComponent({ className: () => 'Function className' });
    renderComponent({ className: () => { throw new Error('Error'); } });

    const invalidClassName = 'invalid-class-name';
    renderComponent({ className: invalidClassName });
    const component = screen.getByTestId(/my-component/i);
    expect(component).toHaveClass(invalidClassName);

    renderComponent({ className: `${invalidClassName} invalid-class-name` });
    const component2 = screen.getByTestId(/my-component/i);
    expect(component2).toHaveClass(`${invalidClassName} invalid-class-name`);
  });

  it('handles testId with invalid values', () => {
    renderComponent({ testId: null });
    renderComponent({ testId: undefined });
    renderComponent({ testId: 0 });
    renderComponent({ testId: true });
    renderComponent({ testId: false });
    renderComponent({ testId: [] });
    renderComponent({ testId: () => 'Function testId' });
    renderComponent({ testId: () => { throw new Error('Error'); } });

    const invalidTestId = 'invalid-test-id';
    renderComponent({ testId: invalidTestId });
    const component = screen.getByTestId(invalidTestId);
    expect(component).toBeInTheDocument();

    renderComponent({ testId: `${invalidTestId} invalid-test-id` });
    const component2 = screen.getByTestId(`${invalidTestId} invalid-test-id`);
    expect(component2).toBeInTheDocument();
  });

  it('handles duplicate testId', () => {
    renderComponent({ testId: 'test-id' });
    renderComponent({ testId: 'test-id' });
    const component = screen.getAllByTestId('test-id');
    expect(component.length).toBe(2);
  });

  it('handles very long message', () => {
    const veryLongMessage = Array(100)
      .fill('a')
      .join('');
    renderComponent({ message: veryLongMessage });
    const message = screen.getByText(veryLongMessage);
    expect(message).toBeInTheDocument();
  });

  it('handles very long children', () => {
    const veryLongChildren = Array(100)
      .fill('a')
      .join('');
    renderComponent({ children: veryLongChildren });
    const childrenElement = screen.getByText(veryLongChildren);
    expect(childrenElement).toBeInTheDocument();
  });

  it('handles very long className', () => {
    const veryLongClassName = Array(100)
      .fill('a')
      .join('');
    renderComponent({ className: veryLongClassName });
    const component = screen.getByTestId(/my-component/i);
    expect(component).toHaveClass(veryLongClassName);
  });

  it('handles very long testId', () => {
    const veryLongTestId = Array(100)
      .fill('a')
      .join('');
    renderComponent({ testId: veryLongTestId });
    const component = screen.getByTestId(veryLongTestId);
    expect(component).toBeInTheDocument();
  });

  it('handles empty array as message', () => {
    renderComponent({ message: [] });
    const message = screen.queryByText(/default message/i);
    expect(message).not.toBeInTheDocument();
  });

  it('handles empty array as children', () => {
    renderComponent({ children: [] });
    const childrenElement = screen.queryByText(/default message/i);
    expect(childrenElement).not.toBeInTheDocument();
  });

  it('handles empty array as className', () => {
    renderComponent({ className: [] });
    const component = screen.getByTestId(/my-component/i);
    expect(component).not.toHaveClass('');
  });

  it('handles empty array as testId', () => {
    renderComponent({ testId: [] });
    const component = screen.getByTestId(/my-component/i);
    expect(component).not.toHaveAttribute('data-testid');
  });

  it('handles message as a React fragment', () => {
    renderComponent({ message: <></> });
    const message = screen.queryByText(/default message/i);
    expect(message).not.toBeInTheDocument();
  });

  it('handles children as a React fragment', () => {
    renderComponent({ children: <></> });
    const childrenElement = screen.queryByText(/default message/i);
    expect(childrenElement).not.toBeInTheDocument();
  });

  it('handles className as a React fragment', () => {
    renderComponent({ className: <></> });
    const component = screen.getByTestId(/my-component/i);
    expect(component).not.toHaveClass('');
  });

  it('handles testId as a React fragment', () => {
    renderComponent({ testId: <></> });
    const component = screen.getByTestId(/my-component/i);
    expect(component).not.toHaveAttribute('data-testid');
  });

  it('handles message as a function that returns a string', () => {
    const FunctionMessage = () => 'Function message';
    renderComponent({ message: FunctionMessage });
    const message = screen.getByText(/function message/i);
    expect(message).toBeInTheDocument();
  });

  it('handles children as a function that returns a ReactNode', () => {
    const FunctionChildren = () => <span>Function children</span>;
    renderComponent({ children: FunctionChildren });
    const childrenElement = screen.getByText(/function children/i);
    expect(childrenElement).toBeInTheDocument();
  });

  it('handles className as a function that returns a string', () => {
    const FunctionClassName = () => 'Function className';
    renderComponent({ className: FunctionClassName });
    const component = screen.getByTestId(/my-component/i);
    expect(component).toHaveClass('Function className');
  });

  it('handles testId as a function that returns a string', () => {
    const FunctionTestId = () => 'Function testId';
    renderComponent({ testId: FunctionTestId });
    const component = screen.getByTestId('Function testId');
    expect(component).toBeInTheDocument();
  });

  it('handles message as a function that throws an error', () => {
    const FunctionMessage = () => { throw new Error('Error'); };
    renderComponent({ message: FunctionMessage });
    const message = screen.queryByText(/default message/i);
    expect(message).not.toBeInTheDocument();
  });

  it('handles children as a function that throws an error', () => {
    const FunctionChildren = () => { throw new Error('Error'); };
    renderComponent({ children: FunctionChildren });
    const childrenElement = screen.queryByText(/default message/i);
    expect(childrenElement).not.toBeInTheDocument();
  });

  it('handles className as a function that throws an error', () => {
    const FunctionClassName = () => { throw new Error('Error'); };
    renderComponent({ className: FunctionClassName });
    const component = screen.getByTestId(/my-component/i);
    expect(component).not.toHaveClass('');
  });

  it('handles testId as a function that throws an error', () => {
    const FunctionTestId = () => { throw new Error('Error'); };
    renderComponent({ testId: FunctionTestId });
    const component = screen.getByTestId(/my-component/i);
    expect(component).not.toHaveAttribute('data-testid');
  });

  it('has a proper ARIA role', () => {
    renderComponent();
    const component = screen.getByTestId(/my-component/i);
    expect(component).toHaveAttribute('role', 'region');
  });

  it('renders both message and children', () => {
    const message = 'Message';
    const children = <span>Children</span>;
    renderComponent({ message, children });
    const messageElement = screen.getByText(message);
    const childrenElement = screen.getByText(/children/i);
    expect(messageElement).toBeInTheDocument();
    expect(childrenElement).toBeInTheDocument();
  });

  it('does not render both message and children when both are empty', () => {
    renderComponent({ message: '', children: '' });
    const message = screen.queryByText(/default message/i);
    const childrenElement = screen.queryByText(/children/i);
    expect(message).not.toBeInTheDocument();
    expect(childrenElement).not.toBeInTheDocument();
  });
});