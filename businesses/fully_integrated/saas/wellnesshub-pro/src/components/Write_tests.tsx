import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

interface Props {
  /**
   * The message to be displayed.
   */
  message: string;

  /**
   * Additional children elements to be rendered within the component.
   */
  children?: React.ReactNode;

  /**
   * A class name to be applied to the component for styling purposes.
   */
  className?: string;
}

/**
 * MyComponent: A functional React component that displays a message.
 *
 * @param {PropsWithChildren<Props>} props - The component props.
 * @returns {JSX.Element} A JSX element containing the message and optional children.
 */
const MyComponent: React.FC<Props> = ({ message, children, className }) => {
  return (
    <div className={className}>
      {children}
      <h1>{message}</h1>
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

MyComponent.defaultProps = {
  children: null,
  className: '',
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

interface Props {
  /**
   * The message to be displayed.
   */
  message: string;

  /**
   * Additional children elements to be rendered within the component.
   */
  children?: React.ReactNode;

  /**
   * A class name to be applied to the component for styling purposes.
   */
  className?: string;
}

/**
 * MyComponent: A functional React component that displays a message.
 *
 * @param {PropsWithChildren<Props>} props - The component props.
 * @returns {JSX.Element} A JSX element containing the message and optional children.
 */
const MyComponent: React.FC<Props> = ({ message, children, className }) => {
  return (
    <div className={className}>
      {children}
      <h1>{message}</h1>
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

MyComponent.defaultProps = {
  children: null,
  className: '',
};

export default MyComponent;