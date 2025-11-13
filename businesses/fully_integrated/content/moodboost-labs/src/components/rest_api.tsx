import React, { FC, ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

declare const DOMPurifyAvailable: boolean;

if (!DOMPurifyAvailable) {
  console.error(
    'Warning: DOMPurify library is not available. This component may not be safe to use.'
  );
}

interface Props {
  message: string;
  children?: ReactElement<any>;
  ariaLabel?: string;
  className?: string;
  testID?: string;
}

const MyComponent: FC<Props> = ({
  message,
  children,
  ariaLabel,
  className,
  testID,
}) => {
  // Use a safe method for rendering user-provided content
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Render the provided children if any
  return (
    <div data-testid={testID} aria-label={ariaLabel} className={className}>
      {sanitizedMessage}
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  children: null,
  ariaLabel: '',
  className: '',
  testID: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired.minLength(1),
  children: PropTypes.element,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  testID: PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

declare const DOMPurifyAvailable: boolean;

if (!DOMPurifyAvailable) {
  console.error(
    'Warning: DOMPurify library is not available. This component may not be safe to use.'
  );
}

interface Props {
  message: string;
  children?: ReactElement<any>;
  ariaLabel?: string;
  className?: string;
  testID?: string;
}

const MyComponent: FC<Props> = ({
  message,
  children,
  ariaLabel,
  className,
  testID,
}) => {
  // Use a safe method for rendering user-provided content
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Render the provided children if any
  return (
    <div data-testid={testID} aria-label={ariaLabel} className={className}>
      {sanitizedMessage}
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  children: null,
  ariaLabel: '',
  className: '',
  testID: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired.minLength(1),
  children: PropTypes.element,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  testID: PropTypes.string,
};

export default MyComponent;