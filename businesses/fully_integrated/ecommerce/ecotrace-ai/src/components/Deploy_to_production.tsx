import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
  message?: string;
  ariaLabel?: string;
  className?: string;
  testID?: string;
}

const MyComponent: FC<Props> = ({
  children = '',
  message,
  ariaLabel = 'MyComponent',
  className,
  testID,
  ...rest
}) => {
  if (message) {
    const sanitizedMessage = new DOMParser().parseFromString(message, 'text/html').body.textContent || '';
    if (sanitizedMessage && sanitizedMessage.trim() !== '') {
      return (
        <div
          data-testid={testID}
          className={className}
          aria-label={ariaLabel}
          {...rest}
        >
          <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        </div>
      );
    }
  }

  if (typeof children !== 'string') {
    throw new Error('Children must be a string or ReactNode.');
  }

  return (
    <div data-testid={testID} className={className} aria-label={ariaLabel} {...rest}>
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  message: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  testID: PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
  message?: string;
  ariaLabel?: string;
  className?: string;
  testID?: string;
}

const MyComponent: FC<Props> = ({
  children = '',
  message,
  ariaLabel = 'MyComponent',
  className,
  testID,
  ...rest
}) => {
  if (message) {
    const sanitizedMessage = new DOMParser().parseFromString(message, 'text/html').body.textContent || '';
    if (sanitizedMessage && sanitizedMessage.trim() !== '') {
      return (
        <div
          data-testid={testID}
          className={className}
          aria-label={ariaLabel}
          {...rest}
        >
          <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        </div>
      );
    }
  }

  if (typeof children !== 'string') {
    throw new Error('Children must be a string or ReactNode.');
  }

  return (
    <div data-testid={testID} className={className} aria-label={ariaLabel} {...rest}>
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  message: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  testID: PropTypes.string,
};

export default MyComponent;