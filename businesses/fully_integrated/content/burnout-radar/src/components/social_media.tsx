import React, { FC, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

type ClassName = string | undefined;

interface Props {
  message: string;
  className?: ClassName; // Adding optional className prop for accessibility and styling purposes
}

const validateProps = (props: Props) => {
  if (!props.message) {
    throw new Error('"message" is required');
  }
  return props;
};

const MyComponent: FC<Props> = ({ message, className }) => {
  const memoizedComponent = useMemo(() => (
    <div className={`social-media-message ${className ? className : ''}`}>{message}</div>
  ), [message, className]);

  useEffect(() => {
    console.log(`Message updated: ${message}`);
  }, [message as unknown as string]); // Adding type for useEffect dependency array

  return memoizedComponent;
};

MyComponent.defaultProps = {
  message: 'Welcome to Burnout Radar!',
  className: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default MyComponent;

import React, { FC, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

type ClassName = string | undefined;

interface Props {
  message: string;
  className?: ClassName; // Adding optional className prop for accessibility and styling purposes
}

const validateProps = (props: Props) => {
  if (!props.message) {
    throw new Error('"message" is required');
  }
  return props;
};

const MyComponent: FC<Props> = ({ message, className }) => {
  const memoizedComponent = useMemo(() => (
    <div className={`social-media-message ${className ? className : ''}`}>{message}</div>
  ), [message, className]);

  useEffect(() => {
    console.log(`Message updated: ${message}`);
  }, [message as unknown as string]); // Adding type for useEffect dependency array

  return memoizedComponent;
};

MyComponent.defaultProps = {
  message: 'Welcome to Burnout Radar!',
  className: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default MyComponent;