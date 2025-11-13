import React, { FC, PropsWithChildren, ReactNode } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  testId?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message = 'Default message', testId, children }) => {
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  // Adding aria-label for accessibility
  const ariaLabel = sanitizedMessage || 'MyComponent content';

  return (
    <div data-testid={testId} aria-label={ariaLabel}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {children}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
MyComponent.propTypes = {
  message: PropTypes.string,
  testId: PropTypes.string,
  children: PropTypes.node,
};

export default MyComponent;

import React, { FC, PropsWithChildren, ReactNode } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  testId?: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message = 'Default message', testId, children }) => {
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  // Adding aria-label for accessibility
  const ariaLabel = sanitizedMessage || 'MyComponent content';

  return (
    <div data-testid={testId} aria-label={ariaLabel}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {children}
    </div>
  );
};

MyComponent.displayName = 'MyComponent';
MyComponent.propTypes = {
  message: PropTypes.string,
  testId: PropTypes.string,
  children: PropTypes.node,
};

export default MyComponent;