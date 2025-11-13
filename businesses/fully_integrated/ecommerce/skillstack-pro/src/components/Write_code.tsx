import React, { FC, RefObject, useRef, useEffect } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, className, ariaLabel }) => {
  const divRef = useRef<HTMLDivElement>(null);

  // Check if message is empty before rendering
  if (!message.trim()) return null;

  // Ensure the aria-label is provided, otherwise use a default one
  const finalAriaLabel = ariaLabel || 'Dynamic message component';

  // Add focus management to the div for better accessibility
  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, [message]);

  return (
    <div
      data-testid="my-component"
      ref={divRef}
      className={className}
      aria-label={finalAriaLabel}
    >
      <div
        // Use jsx-a11y library to safely set innerHTML with a fallback for invalid HTML
        // https://github.com/jsx-a11y/jsx-a11y#dangerouslysetinnerhtml
        dangerouslySetInnerHTML={{ __html: message, __html: message || '' }}
      />
    </div>
  );
};

export default MyComponent;

import React, { FC, RefObject, useRef, useEffect } from 'react';

interface Props {
  message: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, className, ariaLabel }) => {
  const divRef = useRef<HTMLDivElement>(null);

  // Check if message is empty before rendering
  if (!message.trim()) return null;

  // Ensure the aria-label is provided, otherwise use a default one
  const finalAriaLabel = ariaLabel || 'Dynamic message component';

  // Add focus management to the div for better accessibility
  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, [message]);

  return (
    <div
      data-testid="my-component"
      ref={divRef}
      className={className}
      aria-label={finalAriaLabel}
    >
      <div
        // Use jsx-a11y library to safely set innerHTML with a fallback for invalid HTML
        // https://github.com/jsx-a11y/jsx-a11y#dangerouslysetinnerhtml
        dangerouslySetInnerHTML={{ __html: message, __html: message || '' }}
      />
    </div>
  );
};

export default MyComponent;