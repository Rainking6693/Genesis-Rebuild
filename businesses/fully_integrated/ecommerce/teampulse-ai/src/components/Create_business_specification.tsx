import React, { FC, useMemo } from 'react';
import PropTypes from 'prop-types';
import { classNames } from './utilities';

// Utilities function to handle class names for better maintainability
const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

interface Props {
  message: string;
  className?: string; // Add optional className for better styling flexibility
  ariaLabel?: string; // Add optional aria-label for better accessibility
  dataTestid?: string; // Add optional data-testid for easier testing
}

const MyComponent: FC<Props> = React.memo(({ message, className, ariaLabel, dataTestid }) => {
  const effectiveAriaLabel = ariaLabel || 'AI-powered message';
  const effectiveDataTestid = dataTestid || 'ai-message';

  return (
    <div
      data-testid={effectiveDataTestid}
      aria-label={effectiveAriaLabel}
      className={classNames('message-container', className)}
      style={{
        maxWidth: '300px',
        minWidth: '150px',
        padding: '10px',
      }}
    >
      {message}
    </div>
  );
});

MyComponent.defaultProps = {
  message: 'No message provided',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  dataTestid: PropTypes.string,
};

export default MyComponent;

These changes make the component more resilient, accessible, and maintainable by addressing edge cases, improving accessibility, and adding features for easier testing.