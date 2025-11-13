import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { IMessage } from './IMessage';

type Props = IMessage & {
  children?: ReactNode;
};

const FunctionalComponent: FC<Props> = ({ message, children, ...rest }: Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  // Validate props using a custom function
  const validateProps = (props: Props) => {
    if (!props.message) {
      console.error('Error: "message" prop is required.');
      return false;
    }

    if (props.children && typeof props.children !== 'string') {
      console.error('Error: "children" prop must be a string or null.');
      return false;
    }

    return true;
  };

  // Call the validation function with the current props
  if (!validateProps(rest)) return null;

  return (
    <div role="alert" aria-live="assertive" aria-labelledby="message-label">
      {/* Add a role, aria-live, and aria-labelledby attributes for accessibility */}
      <div id="message-label">{message}</div>
      {/* Render any additional children provided */}
      {children}
    </div>
  );
};

// Set default props and propTypes
FunctionalComponent.defaultProps = {
  message: '',
  children: null,
};

FunctionalComponent.propTypes = {
  message: require('prop-types').string.isRequired,
  children: require('prop-types').oneOfType([
    require('prop-types').string,
    require('prop-types').node,
  ]),
};

export default FunctionalComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import { IMessage } from './IMessage';

type Props = IMessage & {
  children?: ReactNode;
};

const FunctionalComponent: FC<Props> = ({ message, children, ...rest }: Props & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  // Validate props using a custom function
  const validateProps = (props: Props) => {
    if (!props.message) {
      console.error('Error: "message" prop is required.');
      return false;
    }

    if (props.children && typeof props.children !== 'string') {
      console.error('Error: "children" prop must be a string or null.');
      return false;
    }

    return true;
  };

  // Call the validation function with the current props
  if (!validateProps(rest)) return null;

  return (
    <div role="alert" aria-live="assertive" aria-labelledby="message-label">
      {/* Add a role, aria-live, and aria-labelledby attributes for accessibility */}
      <div id="message-label">{message}</div>
      {/* Render any additional children provided */}
      {children}
    </div>
  );
};

// Set default props and propTypes
FunctionalComponent.defaultProps = {
  message: '',
  children: null,
};

FunctionalComponent.propTypes = {
  message: require('prop-types').string.isRequired,
  children: require('prop-types').oneOfType([
    require('prop-types').string,
    require('prop-types').node,
  ]),
};

export default FunctionalComponent;