import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const testMessage = 'This is a test message';
  const testSources = ['user', 'ai'];

  test.each(testSources)(
    'renders the component with the correct source (%s)',
    (source) => {
      render(<MyComponent source={source} message={testMessage} />);

      const component = screen.getByText(testMessage);
      expect(component).toHaveAttribute('data-source', source);
      expect(component).toHaveAttribute('aria-label', `Message from ${source}`);
    }
  );

  test('generates a unique key when no id is provided', () => {
    render(<MyComponent source="user" message={testMessage} />);

    const keys = Array.from(document.body.children).map((child) => child.key);
    const firstComponentKey = keys[0];
    const secondComponentKey = keys[1];

    expect(firstComponentKey).not.toEqual(secondComponentKey);
    expect(firstComponentKey).toEqual(screen.getByText(testMessage).key);
  });

  test('uses the provided id for the key', () => {
    const testId = 'test-id';

    render(<MyComponent source="user" message={testMessage} id={testId} />);

    const component = screen.getByText(testMessage);
    expect(component.key).toEqual(testId);
  });

  test('handles missing message', () => {
    render(<MyComponent source="user" message={null} />);

    expect(screen.queryByText('')).toBeNull();
  });

  test('handles missing source', () => {
    render(<MyComponent message={testMessage} />);

    expect(screen.queryByText(testMessage)).toBeNull();
  });

  test('handles invalid source', () => {
    const invalidSource = 'invalid';

    render(<MyComponent source={invalidSource} message={testMessage} />);

    const component = screen.getByText(testMessage);
    expect(component).toHaveAttribute('data-source', invalidSource);
    expect(component).toHaveAttribute('aria-label', `Message from invalid`);
  });

  test('handles empty source', () => {
    render(<MyComponent source="" message={testMessage} />);

    const component = screen.getByText(testMessage);
    expect(component).toHaveAttribute('data-source', '');
    expect(component).toHaveAttribute('aria-label', `Message from ""`);
  });

  test('handles null source', () => {
    render(<MyComponent source={null} message={testMessage} />);

    const component = screen.getByText(testMessage);
    expect(component).toHaveAttribute('data-source', null);
    expect(component).toHaveAttribute('aria-label', `Message from null`);
  });

  test('handles missing aria-labelledby when no id is provided', () => {
    render(<MyComponent source="user" message={testMessage} />);

    const component = screen.getByText(testMessage);
    expect(component).not.toHaveAttribute('aria-labelledby');
  });

  test('handles missing aria-label when no message is provided', () => {
    render(<MyComponent source="user" message={null} />);

    const component = screen.queryByText('');
    expect(component).not.toHaveAttribute('aria-label');
  });

  test('focuses the component on key press', () => {
    const { getByText } = render(<MyComponent source="user" message={testMessage} />);

    const component = getByText(testMessage);
    userEvent.tab(component);
    expect(component).toHaveFocus();
  });
});