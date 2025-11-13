import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { forwardRef, MutableRefObject, useEffect, useState } from 'react';
import MyComponent from './MyComponent';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent = forwardRef<HTMLDivElement, Props>(({ message, className = '', ariaLabel = '', ref }, refProp) => {
  const [internalRef, setInternalRef] = useState<MutableRefObject<HTMLDivElement | null> | null>(null);

  useEffect(() => {
    if (refProp) {
      setInternalRef(refProp);
    }
  }, [refProp]);

  const handleClick = () => {
    if (internalRef && internalRef.current) {
      internalRef.current.focus();
    }
  };

  return (
    <div
      ref={internalRef}
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
      role="presentation"
    >
      {message}
    </div>
  );
});

describe('MyComponent', () => {
  let container: HTMLElement;
  let ref: MutableRefObject<HTMLDivElement | null>;

  beforeEach(() => {
    container = render(<MyComponent message="Welcome to our ecommerce store!" className="my-custom-class" ariaLabel="Welcome message" ref={ref = { current: null }} />).container;
  });

  it('should render the correct message and attributes', () => {
    const messageElement = container.querySelector('div');
    expect(messageElement).toHaveTextContent('Welcome to our ecommerce store!');
    expect(messageElement).toHaveClass('my-custom-class');
    expect(messageElement).toHaveAttribute('aria-label', 'Welcome message');
  });

  it('should focus the component when clicked', async () => {
    fireEvent.click(container.querySelector('div'));
    await waitFor(() => expect(container.querySelector('div')).toHaveFocus());
  });

  it('should not be focusable by default', () => {
    expect(container.querySelector('div')).not.toHaveFocus();
  });

  it('should have the correct role', () => {
    const div = container.querySelector('div');
    expect(div).toHaveAttribute('role', 'presentation');
  });

  it('should not handle focus events when clicked', () => {
    const div = container.querySelector('div');
    fireEvent.focus(div);
    fireEvent.click(div);
    expect(div).not.toHaveFocus();
  });

  it('should handle the edge case where refProp is not provided', () => {
    render(<MyComponent message="Welcome to our ecommerce store!" className="my-custom-class" ariaLabel="Welcome message" ref={null} />);
    expect(container.querySelector('div')).not.toHaveFocus();
  });

  it('should update the message when the prop changes', async () => {
    act(() => {
      render(<MyComponent message="You have new items!" className="my-custom-class" ariaLabel="New items message" ref={ref} />);
    });
    await waitFor(() => expect(container.querySelector('div')).toHaveTextContent('You have new items!'));
  });

  it('should update the className when the prop changes', async () => {
    act(() => {
      render(<MyComponent message="Welcome to our ecommerce store!" className="updated-class" ariaLabel="Welcome message" ref={ref} />);
    });
    await waitFor(() => expect(container.querySelector('div')).toHaveClass('updated-class'));
  });

  it('should update the ariaLabel when the prop changes', async () => {
    act(() => {
      render(<MyComponent message="Welcome to our ecommerce store!" className="my-custom-class" ariaLabel="Updated ariaLabel" ref={ref} />);
    });
    await waitFor(() => expect(container.querySelector('div')).toHaveAttribute('aria-label', 'Updated ariaLabel'));
  });
});