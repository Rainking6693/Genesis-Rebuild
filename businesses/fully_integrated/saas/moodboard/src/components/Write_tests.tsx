import React, { FC, ReactNode, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

import PropTypes from 'prop-types';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sanitizedMessageRef.current) {
      const sanitizedMessage = DOMPurify.sanitize(message);
      sanitizedMessageRef.current.innerHTML = sanitizedMessage;
      sanitizedMessageRef.current.setAttribute('aria-label', sanitizedMessage);
    }
  }, [message]);

  return (
    <div id="my-component" data-testid="my-component" role="presentation">
      <div ref={sanitizedMessageRef} />
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;

import React, { FC, ReactNode, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

import PropTypes from 'prop-types';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const sanitizedMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sanitizedMessageRef.current) {
      const sanitizedMessage = DOMPurify.sanitize(message);
      sanitizedMessageRef.current.innerHTML = sanitizedMessage;
      sanitizedMessageRef.current.setAttribute('aria-label', sanitizedMessage);
    }
  }, [message]);

  return (
    <div id="my-component" data-testid="my-component" role="presentation">
      <div ref={sanitizedMessageRef} />
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyComponent;