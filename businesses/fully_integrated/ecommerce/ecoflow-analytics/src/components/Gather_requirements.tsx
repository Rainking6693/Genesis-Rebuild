import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

interface Props {
  message?: string;
  checkMessage?: CheckMessage;
  fallbackMessage?: string;
  ariaLabel?: string;
  ariaLive?: 'assertive' | 'polite';
}

type CheckMessage = (message: string) => message is string;

const MyComponent: FC<Props> = ({ message, checkMessage, fallbackMessage = '', ariaLabel, ariaLive }) => {
  const sanitizedMessage = useMemo(() => {
    if (!message) return fallbackMessage;

    if (!checkMessage || checkMessage(message)) return message;

    throw new Error('Invalid message');
  }, [message, checkMessage, fallbackMessage]);

  const handleClick = useCallback(() => {
    const messageElement = document.querySelector('.message');
    if (messageElement) {
      messageElement.focus();
      if (ariaLive === 'assertive') messageElement.setAttribute('aria-live', 'assertive');
      else if (ariaLive === 'polite') messageElement.setAttribute('aria-live', 'polite');
    }
  }, [ariaLive]);

  const messageRef = useRef<HTMLDivElement>(null);

  const [isFocused, setFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  return (
    <div onClick={handleClick} role="presentation">
      <div
        ref={messageRef}
        aria-label={ariaLabel}
        className={`message ${isFocused ? 'focused' : ''}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

interface Props {
  message?: string;
  checkMessage?: CheckMessage;
  fallbackMessage?: string;
  ariaLabel?: string;
  ariaLive?: 'assertive' | 'polite';
}

type CheckMessage = (message: string) => message is string;

const MyComponent: FC<Props> = ({ message, checkMessage, fallbackMessage = '', ariaLabel, ariaLive }) => {
  const sanitizedMessage = useMemo(() => {
    if (!message) return fallbackMessage;

    if (!checkMessage || checkMessage(message)) return message;

    throw new Error('Invalid message');
  }, [message, checkMessage, fallbackMessage]);

  const handleClick = useCallback(() => {
    const messageElement = document.querySelector('.message');
    if (messageElement) {
      messageElement.focus();
      if (ariaLive === 'assertive') messageElement.setAttribute('aria-live', 'assertive');
      else if (ariaLive === 'polite') messageElement.setAttribute('aria-live', 'polite');
    }
  }, [ariaLive]);

  const messageRef = useRef<HTMLDivElement>(null);

  const [isFocused, setFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  return (
    <div onClick={handleClick} role="presentation">
      <div
        ref={messageRef}
        aria-label={ariaLabel}
        className={`message ${isFocused ? 'focused' : ''}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

export default MyComponent;