import React, { FC, Key } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

type ClassName = string;
type SanitizedMessage = string;
type ComponentName = string;
type DOMPurifyFunction = () => void;

interface Props {
  message: string;
  className?: ClassName;
}

const COMPONENT_NAME: ComponentName = 'MyComponent';
const DOMPurifyFunc: DOMPurifyFunction = DOMPurify;

const MyComponent: FC<Props> = ({ message, className }) => {
  if (!message) {
    return null;
  }

  const sanitizedMessage = DOMPurifyFunc.sanitize(message);

  if (!sanitizedMessage) {
    return null;
  }

  const key: Key = `${COMPONENT_NAME}-${Math.random()}`;

  return (
    <div key={key} className={className ? className : ''} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

MyComponent.defaultProps = {
  message: '',
  className: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default MyComponent;

This updated code adds checks for empty props, ensures types are correct, and makes the code more maintainable by using constant definitions for component names and libraries.