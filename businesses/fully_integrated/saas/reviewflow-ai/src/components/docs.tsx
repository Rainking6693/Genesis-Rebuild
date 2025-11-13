import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sanitizeUserInput, ForwardedRef, forwardRef } from 'react';

interface Props {
  message?: string;
}

interface MyComponentRef {
  focus: () => void;
}

const MyComponent = forwardRef<MyComponentRef, Props>(({ message = '' }, ref) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const divRef = useRef<HTMLDivElement>(null);

  const handleSanitize = useCallback((input: string) => {
    let sanitizedInput = sanitizeUserInput(input);

    if (!sanitizedInput) {
      throw new Error('Error sanitizing user input');
    }

    setSanitizedMessage(sanitizedInput);
  }, []);

  useEffect(() => {
    handleSanitize(message);

    if (divRef.current) {
      divRef.current.focus();
    }
  }, [message, handleSanitize]);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (divRef.current) {
        divRef.current.focus();
      }
    },
  }));

  return (
    <div ref={divRef} role="presentation" key={sanitizedMessage}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

declare function sanitizeUserInput(input: string): string | null;

describe('sanitizeUserInput', () => {
  it('should sanitize user input for security', () => {
    const input = '<script>alert("XSS Attack!");</script>';
    const expectedOutput = '';

    expect(sanitizeUserInput(input)).toEqual(expectedOutput);
  });
});

describe('MyComponent', () => {
  it('should focus the div element when it is mounted', () => {
    const mockRef = { focus: jest.fn() };
    const { getByTestId } = render(<MyComponent ref={mockRef} />);

    expect(mockRef.focus).toHaveBeenCalledTimes(1);
    expect(getByTestId('my-component')).toHaveFocus();
  });
});

export default MyComponent;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sanitizeUserInput, ForwardedRef, forwardRef } from 'react';

interface Props {
  message?: string;
}

interface MyComponentRef {
  focus: () => void;
}

const MyComponent = forwardRef<MyComponentRef, Props>(({ message = '' }, ref) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const divRef = useRef<HTMLDivElement>(null);

  const handleSanitize = useCallback((input: string) => {
    let sanitizedInput = sanitizeUserInput(input);

    if (!sanitizedInput) {
      throw new Error('Error sanitizing user input');
    }

    setSanitizedMessage(sanitizedInput);
  }, []);

  useEffect(() => {
    handleSanitize(message);

    if (divRef.current) {
      divRef.current.focus();
    }
  }, [message, handleSanitize]);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (divRef.current) {
        divRef.current.focus();
      }
    },
  }));

  return (
    <div ref={divRef} role="presentation" key={sanitizedMessage}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

declare function sanitizeUserInput(input: string): string | null;

describe('sanitizeUserInput', () => {
  it('should sanitize user input for security', () => {
    const input = '<script>alert("XSS Attack!");</script>';
    const expectedOutput = '';

    expect(sanitizeUserInput(input)).toEqual(expectedOutput);
  });
});

describe('MyComponent', () => {
  it('should focus the div element when it is mounted', () => {
    const mockRef = { focus: jest.fn() };
    const { getByTestId } = render(<MyComponent ref={mockRef} />);

    expect(mockRef.focus).toHaveBeenCalledTimes(1);
    expect(getByTestId('my-component')).toHaveFocus();
  });
});

export default MyComponent;