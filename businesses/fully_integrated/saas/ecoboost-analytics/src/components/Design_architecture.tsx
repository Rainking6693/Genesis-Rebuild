import React, { FC, useMemo, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{ message?: string }> {}

const validateMessage = (message: string): message is string => {
  try {
    // Custom validation logic based on business requirements
    // For example, ensure message does not contain any dangerous HTML tags or scripts
    const sanitizedMessage = DOMPurify.sanitize(message);
    if (sanitizedMessage !== message) {
      throw new Error('Invalid or dangerous HTML tags found in the message');
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const MyComponent: FC<Props> = ({ children }) => {
  const sanitizedMessage = useMemo(() => {
    if (!validateMessage(children)) {
      throw new Error('Invalid or dangerous HTML tags found in the message');
    }
    return DOMPurify.sanitize(children as string);
  }, [children]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

MyComponent.validateMessage = validateMessage;

export default MyComponent;

import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './MyComponent';
import { act } from 'react-dom/test-utils';

describe('MyComponent', () => {
  it('should render the sanitized message', () => {
    const message = '<p>Hello, world!</p>';
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should not render an invalid message', () => {
    const message = '<script>alert("XSS Attack!");</script>';
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('should be accessible', () => {
    const message = '<p>Hello, world!</p>';
    const { getByText } = render(<MyComponent message={message} />);
    expect(getByText('Hello, world!')).toBeInTheDocument();
  });

  it('should only sanitize the message once', () => {
    const message = '<p>Hello, world!</p>';
    const { rerender } = render(<MyComponent message={message} />);
    act(() => {
      rerender(<MyComponent message={message} />);
    });
    // Check if the sanitization process only happens once
    // This test assumes that the sanitization process is expensive
    // Adjust the test according to your specific use case
    const sanitizationCount = jest.fn();
    jest.spyOn(DOMPurify, 'sanitize').mockImplementationOnce(() => {
      sanitizationCount();
      return message;
    });
    act(() => {
      render(<MyComponent message={message} />);
    });
    expect(sanitizationCount).toHaveBeenCalledTimes(1);
  });

  it('should handle edge cases', () => {
    const emptyMessage = '';
    const { container } = render(<MyComponent message={emptyMessage} />);
    expect(container.firstChild).toBeNull();

    const invalidMessage = '<script>alert("XSS Attack!");</script>';
    const { container: invalidContainer } = render(<MyComponent message={invalidMessage} />);
    expect(invalidContainer.firstChild).toBeNull();
  });
});

import React, { FC, useMemo, PropsWithChildren } from 'react';
import DOMPurify from 'dompurify';

interface Props extends PropsWithChildren<{ message?: string }> {}

const validateMessage = (message: string): message is string => {
  try {
    // Custom validation logic based on business requirements
    // For example, ensure message does not contain any dangerous HTML tags or scripts
    const sanitizedMessage = DOMPurify.sanitize(message);
    if (sanitizedMessage !== message) {
      throw new Error('Invalid or dangerous HTML tags found in the message');
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const MyComponent: FC<Props> = ({ children }) => {
  const sanitizedMessage = useMemo(() => {
    if (!validateMessage(children)) {
      throw new Error('Invalid or dangerous HTML tags found in the message');
    }
    return DOMPurify.sanitize(children as string);
  }, [children]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

MyComponent.validateMessage = validateMessage;

export default MyComponent;

import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './MyComponent';
import { act } from 'react-dom/test-utils';

describe('MyComponent', () => {
  it('should render the sanitized message', () => {
    const message = '<p>Hello, world!</p>';
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should not render an invalid message', () => {
    const message = '<script>alert("XSS Attack!");</script>';
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('should be accessible', () => {
    const message = '<p>Hello, world!</p>';
    const { getByText } = render(<MyComponent message={message} />);
    expect(getByText('Hello, world!')).toBeInTheDocument();
  });

  it('should only sanitize the message once', () => {
    const message = '<p>Hello, world!</p>';
    const { rerender } = render(<MyComponent message={message} />);
    act(() => {
      rerender(<MyComponent message={message} />);
    });
    // Check if the sanitization process only happens once
    // This test assumes that the sanitization process is expensive
    // Adjust the test according to your specific use case
    const sanitizationCount = jest.fn();
    jest.spyOn(DOMPurify, 'sanitize').mockImplementationOnce(() => {
      sanitizationCount();
      return message;
    });
    act(() => {
      render(<MyComponent message={message} />);
    });
    expect(sanitizationCount).toHaveBeenCalledTimes(1);
  });

  it('should handle edge cases', () => {
    const emptyMessage = '';
    const { container } = render(<MyComponent message={emptyMessage} />);
    expect(container.firstChild).toBeNull();

    const invalidMessage = '<script>alert("XSS Attack!");</script>';
    const { container: invalidContainer } = render(<MyComponent message={invalidMessage} />);
    expect(invalidContainer.firstChild).toBeNull();
  });
});

I've also added the following tests using Jest: