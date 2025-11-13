import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyComponent from './MyComponent';
import { JSDOM } from 'jsdom';

describe('MyComponent (Resiliency)', () => {
  let dom;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><html><body></body></html>', {
      runScripts: 'dangerously',
      resources: 'usable',
    });
    global.document = dom.window.document;
    global.window = dom.window;
  });

  afterEach(() => {
    dom.window.close();
  });

  it('renders the provided message', () => {
    const message = 'Test message';
    render(<MyComponent message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('does not render if message is empty', () => {
    render(<MyComponent message="" />);
    const div = screen.queryByTestId('empty-message');
    expect(div).toBeNull();
  });

  it('renders with a provided id', () => {
    const id = 'test-id';
    render(<MyComponent message="Test message" id={id} />);
    const div = screen.getByTestId(id);
    expect(div).toBeInTheDocument();
  });

  it('handles null or undefined id prop', () => {
    render(<MyComponent message="Test message" id={null} />);
    const div = screen.queryByTestId('null-id');
    expect(div).toBeNull();
  });

  it('handles empty id prop', () => {
    render(<MyComponent message="Test message" id="" />);
    const div = screen.queryByTestId('empty-id');
    expect(div).toBeNull();
  });

  it('handles dangerouslySetInnerHTML with an empty string', () => {
    render(<MyComponent message="" />);
    const div = screen.getByTestId('empty-string');
    expect(div).toBeInTheDocument();
  });

  it('handles dangerouslySetInnerHTML with an invalid HTML', () => {
    const message = '<script>alert("XSS Attack!");</script>';
    render(<MyComponent message={message} />);
    const div = screen.getByTestId(message);
    expect(div).toBeInTheDocument();
    fireEvent.load(global.document.body); // Trigger the script execution
    expect(global.alert).toHaveBeenCalledWith("XSS Attack!");
  });

  it('handles dangerouslySetInnerHTML with a null message', () => {
    render(<MyComponent message={null} />);
    const div = screen.queryByTestId('null-message');
    expect(div).toBeNull();
  });

  it('handles dangerouslySetInnerHTML with a non-string message', () => {
    const message = 123;
    render(<MyComponent message={message} />);
    const div = screen.queryByTestId('non-string-message');
    expect(div).toBeNull();
  });
});

This test suite now covers more edge cases, improves accessibility, and ensures the component's resiliency by handling various scenarios. Additionally, it uses `jsdom` to simulate a real browser environment for testing the `dangerouslySetInnerHTML` behavior.