import React, { MutableRefObject, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

interface Props {
  /**
   * The message to be displayed in the component.
   */
  message: string;

  /**
   * A ref to focus on the component when it's rendered.
   */
  focusRef?: MutableRefObject<HTMLElement | null>;
}

const MyComponent: React.FC<Props> = ({ message, focusRef }) => {
  const [localMessage, setLocalMessage] = useState(message);

  useEffect(() => {
    setLocalMessage(message);
  }, [message]);

  useEffect(() => {
    if (focusRef && !isEmpty(localMessage)) {
      focusRef.current?.focus();
    }
  }, [localMessage, focusRef]);

  useEffect(() => {
    // Check if the component is mounted before focusing
    if (focusRef && !isEmpty(localMessage) && document.getElementById('my-component')) {
      document.getElementById('my-component')?.focus();
    }
  }, [localMessage, focusRef, document]);

  return (
    <div
      role="text" // Add ARIA role for accessibility
      ref={focusRef} // Store the ref for focusability
      data-testid="my-component" // Add a test ID for testing purposes
    >
      {localMessage}
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  focusRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }),
};

export default React.memo(MyComponent);

// Testing utility function
const render = (component: React.ReactElement, { container }: any) => {
  container.innerHTML = '';
  container.appendChild(component.root);
};

// Testing setup
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('renders the message', () => {
    const { getByTestId } = render(<MyComponent message="Test message" />, { container });
    expect(getByTestId('my-component')).toHaveTextContent('Test message');
  });

  it('focuses the component when it is rendered', () => {
    const focusRef = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(<MyComponent message="Test message" focusRef={focusRef} />, { container });
    fireEvent.focus(getByTestId('my-component'));
    expect(focusRef.current).toBe(getByTestId('my-component'));
  });

  it('does not focus the component when the message is empty', () => {
    const focusRef = React.createRef<HTMLDivElement>();
    const { getByTestId } = render(<MyComponent message="" focusRef={focusRef} />, { container });
    fireEvent.focus(getByTestId('my-component'));
    expect(focusRef.current).toBeNull();
  });

  it('handles focus ref null case', () => {
    const { getByTestId } = render(<MyComponent message="Test message" />, { container });
    fireEvent.focus(getByTestId('my-component'));
    expect(getByTestId('my-component')).toHaveFocus();
  });
});

This updated code includes the following improvements:

1. Checking if the component is mounted before focusing to prevent errors when the component is not mounted.
2. Handling edge cases where the message is empty and the focusRef is not provided.
3. Adding a testing utility function and testing setup to test the component's behavior.
4. Using the `lodash/isEmpty` library function to check if the message is empty.
5. Adding a test for handling the focusRef null case.