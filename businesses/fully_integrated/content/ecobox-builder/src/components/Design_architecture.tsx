import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  isTrusted?: boolean; // Added for resiliency and edge cases
}

const FunctionalComponent: FC<Props> = ({ message, isTrusted = false }) => {
  // Use DOMPurify for safer and more robust XSS protection
  // Install it via npm: npm install dompurify
  import 'dompurify';
  const sanitizedMessage = isTrusted
    ? new DOMPurify().sanitize(message)
    : new DOMPurify().sanitize(message, {
        ADD_ATTR: ['aria-label'],
        ALLOWED_ATTR: {
          '*': ['aria-label'],
        },
      });

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      aria-label={message} // Added for accessibility
    />
  );
};

FunctionalComponent.defaultProps = {
  message: '',
  isTrusted: false, // Set default value for isTrusted
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
  isTrusted: PropTypes.bool,
};

// Optimize performance by memoizing the component if props don't change
const MemoizedFunctionalComponent = React.memo(FunctionalComponent);

// Add accessibility by wrapping the component with a div and providing a role
const AccessibleFunctionalComponent: FC<Props> = ({ message, isTrusted }) => (
  <div role="presentation">
    <MemoizedFunctionalComponent message={message} isTrusted={isTrusted} />
  </div>
);

export default AccessibleFunctionalComponent;

In this updated code, I've used the `DOMPurify` library for safer and more robust XSS protection. I've also added an `aria-label` attribute to the rendered div for better accessibility. This attribute provides a text alternative for screen readers and other assistive technologies.