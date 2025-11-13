import React, { FC, ReactNode, DefaultHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useId } from '@reach/auto-id';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: ReactNode;
}

const MyComponent: FC<Props> = ({ message, ...rest }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);
  const id = useId();

  return (
    <div id={id} {...rest}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

MyComponent.defaultProps = {
  role: 'alert',
};

MyComponent.propTypes = {
  message: PropTypes.node.isRequired,
  children: PropTypes.node,
};

export default MyComponent;

import React, { FC, ReactNode, DefaultHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useId } from '@reach/auto-id';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: ReactNode;
}

const MyComponent: FC<Props> = ({ message, ...rest }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);
  const id = useId();

  return (
    <div id={id} {...rest}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

MyComponent.defaultProps = {
  role: 'alert',
};

MyComponent.propTypes = {
  message: PropTypes.node.isRequired,
  children: PropTypes.node,
};

export default MyComponent;