import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  className?: string;
}

const MyComponent: FC<Props> = ({ message, className, ...rest }) => {
  const messageContainerClasses = classnames('message-container', className, {
    'message-container--error': message.includes('error'),
    'message-container--success': message.includes('success'),
  });

  return (
    <div className={messageContainerClasses} {...rest}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'No message provided',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  className?: string;
}

const MyComponent: FC<Props> = ({ message, className, ...rest }) => {
  const messageContainerClasses = classnames('message-container', className, {
    'message-container--error': message.includes('error'),
    'message-container--success': message.includes('success'),
  });

  return (
    <div className={messageContainerClasses} {...rest}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'No message provided',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default MyComponent;