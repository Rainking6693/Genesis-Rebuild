import React, { FC, RefObject, useEffect, useRef, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // Sanitize user-generated content to prevent XSS attacks
  const sanitize = useCallback((html: string) => {
    if (html) {
      return DOMPurify.sanitize(html);
    }
    return '';
  }, []);

  const sanitizedMessage = useMemo(() => sanitize(message), [message, sanitize]);

  // Render the sanitized message
  return (
    <div ref={componentRef} role="presentation" aria-label="Social media message" style={{ maxWidth: '100%' }}>
      {sanitizedMessage}
    </div>
  );
};

// Add default props for message
MyComponent.defaultProps = {
  message: '',
};

// Add type for the component's ref for accessibility purposes
MyComponent.displayName = 'EcoProfitSocialMedia';

// Enable React performance monitoring
MyComponent.whyDidYouRender = true;

export default MyComponent;

import React, { FC, RefObject, useEffect, useRef, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  const componentRef = useRef<HTMLDivElement>(null);

  // Sanitize user-generated content to prevent XSS attacks
  const sanitize = useCallback((html: string) => {
    if (html) {
      return DOMPurify.sanitize(html);
    }
    return '';
  }, []);

  const sanitizedMessage = useMemo(() => sanitize(message), [message, sanitize]);

  // Render the sanitized message
  return (
    <div ref={componentRef} role="presentation" aria-label="Social media message" style={{ maxWidth: '100%' }}>
      {sanitizedMessage}
    </div>
  );
};

// Add default props for message
MyComponent.defaultProps = {
  message: '',
};

// Add type for the component's ref for accessibility purposes
MyComponent.displayName = 'EcoProfitSocialMedia';

// Enable React performance monitoring
MyComponent.whyDidYouRender = true;

export default MyComponent;