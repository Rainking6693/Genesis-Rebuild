import React, { FC, useRef, useState, KeyboardEvent, FocusEvent } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  test?: boolean; // Test prop for testing purposes
  visible?: boolean; // Prop for controlling the component's visibility
  ariaLabel?: string; // Customizable aria-label for accessibility
}

const defaultProps: Props = {
  message: '',
  visible: true,
  ariaLabel: 'My component',
};

const MyComponent: FC<Props> = ({ message, test, visible, ariaLabel }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(false);

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    event.currentTarget.setAttribute('aria-activedescendant', 'focus-indicator');
    setFocus(true);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    event.currentTarget.removeAttribute('aria-activedescendant');
    setFocus(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (focus) {
        divRef.current?.focus();
      }
    }
  };

  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Check for non-empty messages and fallback for invalid props
  if (!message || !visible) {
    return null;
  }

  return (
    <div
      ref={divRef}
      aria-label={ariaLabel}
      aria-hidden={!visible}
      role="region"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-testid={test ? 'test-my-component' : undefined}
    >
      <div
        tabIndex={focus ? 0 : -1}
        aria-labelledby={ariaLabel}
        aria-describedby={focus ? 'focus-indicator' : undefined}
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
      {focus && <div id="focus-indicator" />}
    </div>
  );
};

MyComponent.defaultProps = defaultProps;

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  test: PropTypes.bool,
  visible: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

// Optimize performance by memoizing the component if the message prop doesn't change frequently
const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;

import React, { FC, useRef, useState, KeyboardEvent, FocusEvent } from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  test?: boolean; // Test prop for testing purposes
  visible?: boolean; // Prop for controlling the component's visibility
  ariaLabel?: string; // Customizable aria-label for accessibility
}

const defaultProps: Props = {
  message: '',
  visible: true,
  ariaLabel: 'My component',
};

const MyComponent: FC<Props> = ({ message, test, visible, ariaLabel }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(false);

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    event.currentTarget.setAttribute('aria-activedescendant', 'focus-indicator');
    setFocus(true);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    event.currentTarget.removeAttribute('aria-activedescendant');
    setFocus(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (focus) {
        divRef.current?.focus();
      }
    }
  };

  // Sanitize the message to prevent XSS attacks
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Check for non-empty messages and fallback for invalid props
  if (!message || !visible) {
    return null;
  }

  return (
    <div
      ref={divRef}
      aria-label={ariaLabel}
      aria-hidden={!visible}
      role="region"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-testid={test ? 'test-my-component' : undefined}
    >
      <div
        tabIndex={focus ? 0 : -1}
        aria-labelledby={ariaLabel}
        aria-describedby={focus ? 'focus-indicator' : undefined}
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
      {focus && <div id="focus-indicator" />}
    </div>
  );
};

MyComponent.defaultProps = defaultProps;

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  test: PropTypes.bool,
  visible: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

// Optimize performance by memoizing the component if the message prop doesn't change frequently
const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;