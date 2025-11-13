import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Define the interface for props
interface Props {
  name?: string;
  greeting?: string;
}

// Create a functional component using the interface
const FunctionalComponent: React.FC<Props> = ({ name = 'User', greeting = 'Hello' }) => {
  // Render the component with a greeting
  return <h1>{greeting}, {name}!</h1>;
};

// Export the functional component
export default FunctionalComponent;

// Import the functional component for testing
import FunctionalComponent from './FunctionalComponent';

// Test the default behavior
describe('FunctionalComponent', () => {
  it('renders the default greeting with the provided name', () => {
    render(<FunctionalComponent />);
    const greeting = screen.getByText(/Hello, User!/i);
    expect(greeting).toBeInTheDocument();
  });
});

// Test edge cases
describe('FunctionalComponent', () => {
  it('renders the custom greeting with the provided name', () => {
    render(<FunctionalComponent greeting="Hi" />);
    const greeting = screen.getByText(/Hi, User!/i);
    expect(greeting).toBeInTheDocument();
  });

  it('renders the default greeting with the custom name', () => {
    render(<FunctionalComponent name="Tester" />);
    const greeting = screen.getByText(/Hello, Tester!/i);
    expect(greeting).toBeInTheDocument();
  });

  it('renders the custom greeting with the custom name', () => {
    render(<FunctionalComponent greeting="Hi" name="Tester" />);
    const greeting = screen.getByText(/Hi, Tester!/i);
    expect(greeting).toBeInTheDocument();
  });
});

// Test accessibility
describe('FunctionalComponent', () => {
  it('has a proper heading structure', () => {
    render(<FunctionalComponent />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});

// Test resiliency
describe('FunctionalComponent', () => {
  it('does not throw an error when the name is undefined', () => {
    expect(() => render(<FunctionalComponent />)).not.toThrow();
  });

  it('does not throw an error when the greeting is undefined', () => {
    expect(() => render(<FunctionalComponent name="Tester" />)).not.toThrow();
  });
});

In this updated code, I've added default values for the `name` and `greeting` props, making the component more flexible. I've also included tests for edge cases, accessibility, and resiliency. The tests cover various scenarios, such as rendering the default greeting, rendering a custom greeting, handling undefined props, and ensuring the heading structure is correct.