import React, { FC, ReactNode, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useId } from '@reach/auto-id';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: ReactNode;
}

const MyComponent: FC<Props> = ({ message, ...htmlAttributes }) => {
  const id = useId();
  const sanitizedMessage = DOMPurify.sanitize(String(message));

  return (
    <div id={id} {...htmlAttributes}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

MyComponent.defaultProps = {
  'aria-label': 'Message',
};

MyComponent.propTypes = {
  message: PropTypes.node.isRequired,
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useId } from '@reach/auto-id';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: ReactNode;
}

const MyComponent: FC<Props> = ({ message, ...htmlAttributes }) => {
  const id = useId();
  const sanitizedMessage = DOMPurify.sanitize(String(message));

  return (
    <div id={id} {...htmlAttributes}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

MyComponent.defaultProps = {
  'aria-label': 'Message',
};

MyComponent.propTypes = {
  message: PropTypes.node.isRequired,
};

export default MyComponent;