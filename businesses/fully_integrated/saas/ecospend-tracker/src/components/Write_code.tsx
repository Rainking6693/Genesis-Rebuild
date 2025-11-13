import React, { FunctionComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface Props {
  message: string;
  className?: string;
  children?: ReactNode;
}

const MyComponent: FunctionComponent<Props> = ({ message, className, children }) => {
  const finalChildren = children || message;

  return <div className={classNames('ecospend-message', className)} aria-label="EcoSpend message">{finalChildren}</div>;
};

MyComponent.defaultProps = {
  children: undefined,
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MyComponent;

// This component displays a message with a customizable className, aria-label for accessibility, and optional children.
// The message prop is required, and the className prop is optional. The children prop is also optional and can be used to provide additional content.
// The classNames utility library is used to merge the default 'ecospend-message' class with the user-provided className.

import React, { FunctionComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface Props {
  message: string;
  className?: string;
  children?: ReactNode;
}

const MyComponent: FunctionComponent<Props> = ({ message, className, children }) => {
  const finalChildren = children || message;

  return <div className={classNames('ecospend-message', className)} aria-label="EcoSpend message">{finalChildren}</div>;
};

MyComponent.defaultProps = {
  children: undefined,
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default MyComponent;

// This component displays a message with a customizable className, aria-label for accessibility, and optional children.
// The message prop is required, and the className prop is optional. The children prop is also optional and can be used to provide additional content.
// The classNames utility library is used to merge the default 'ecospend-message' class with the user-provided className.